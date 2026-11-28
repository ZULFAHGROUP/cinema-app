/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Collapse, Tag } from "antd";
import { History, Activity } from "lucide-react";
import Button from "../../components/shared/Button";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import RecordHistory from "../../components/shared/RecordHistory";
import Loader from "../../components/shared/Loader";
import Extras from "../../services/network/extras";
import { formatUserLabel, humanDateAndTime } from "../../utils";
import { describeResource, kindOf } from "./constants";

const BOOKKEEPING =
  /^(id|created_at|updated_at|deleted_at|is_deleted|last_login_at|last_seen_at|now_playing|checksum)$/;
const REFERENCE = /_id$/;
const MONEY = /(price|total|amount|subtotal)$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const CODE = /^[A-Z][A-Z_]+$/;
const OPERATION_VERBS: Record<string, string> = {
  insert: "Added",
  update: "Changed",
  upsert: "Saved",
  delete: "Removed",
};
const ROWS_SHOWN = 4;

const naira = (value: unknown) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(value) || 0);

const readable = (field: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (MONEY.test(field) && !isNaN(Number(value))) return naira(value);
  if (typeof value === "string" && ISO_DATE.test(value))
    return humanDateAndTime(value);
  if (typeof value === "string" && CODE.test(value)) {
    const words = value.replace(/_/g, " ").toLowerCase();
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
  if (Array.isArray(value))
    return value.length
      ? value.map((v) => readable(field, v)).join(", ")
      : "none";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const fieldsOf = (change: any) => {
  const source =
    change.operation === "update"
      ? { ...change.before, ...change.after }
      : change.after || change.before || {};
  return Object.keys(source).filter(
    (field) =>
      !BOOKKEEPING.test(field) &&
      (!REFERENCE.test(field) || change.operation === "update")
  );
};

const actorName = (audit: any) => {
  const actor = audit.admin || audit.user;
  return actor ? `${actor.surname} ${actor.other_names}` : "Someone";
};

const summarize = (audit: any) => {
  const who = actorName(audit);
  const email = audit.metadata?.body?.email;
  const resource = describeResource(audit.resource_details);
  const ownAccount =
    (audit.admin_id && audit.resource_details?.admin_id === audit.admin_id) ||
    (audit.user_id && audit.resource_details?.user_id === audit.user_id);
  const target = ownAccount
    ? "their own account"
    : resource
    ? `the ${resource.kind.toLowerCase()} ${resource.label}`
    : `a ${formatUserLabel(audit.resource).toLowerCase()} record`;
  const ok = audit.response_status < 400;

  switch (audit.action) {
    case "LOGIN":
      return `${who} signed in`;
    case "LOGIN_FAILED":
      return `Failed sign-in attempt${email ? ` for ${email}` : ""}`;
    case "LOGOUT":
      return `${who} signed out`;
    case "SIGNUP":
      return `${who} created a customer account`;
    case "PASSWORD_RESET_REQUEST":
      return `Password reset requested${email ? ` for ${email}` : ""}`;
    case "PASSWORD_RESET":
      return ok
        ? `${email || who} reset their password`
        : `Password reset failed${email ? ` for ${email}` : ""}`;
    case "SWITCH_CINEMA":
      return `${who} switched cinema`;
    default: {
      const verb =
        { CREATE: "created", UPDATE: "updated", DELETE: "deleted" }[
          audit.action as string
        ] || "changed";
      const tried =
        { CREATE: "create", UPDATE: "update", DELETE: "delete" }[
          audit.action as string
        ] || "change";
      return ok
        ? `${who} ${verb} ${target}`
        : `${who} tried to ${tried} ${target}, but it failed`;
    }
  }
};

function ChangeSummary({ change }: { change: any }) {
  const fields = fieldsOf(change);
  const source = change.after || change.before || {};

  return (
    <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3.5 space-y-1.5">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#754f2c]">
        {OPERATION_VERBS[change.operation] || "Changed"}: {kindOf(change.table)}
      </p>
      {fields.map((field) => (
        <p key={field} className="text-xs">
          <span className="font-semibold text-stone-500">
            {formatUserLabel(field.replace(REFERENCE, ""))}:{" "}
          </span>
          {change.operation !== "update" ? (
            <span className="font-medium text-stone-800">
              {readable(field, source[field])}
            </span>
          ) : REFERENCE.test(field) ? (
            <span className="font-bold text-stone-800">changed</span>
          ) : (
            <>
              <span className="text-rose-600 line-through">
                {readable(field, change.before?.[field])}
              </span>
              {" → "}
              <span className="text-emerald-700 font-bold">
                {readable(field, change.after?.[field])}
              </span>
            </>
          )}
        </p>
      ))}
    </div>
  );
}

interface AuditDetailsModalProps {
  audit: any | null;
  onClose: () => void;
}

export default function AuditDetailsModal({
  audit: row,
  onClose,
}: AuditDetailsModalProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showAllChanges, setShowAllChanges] = useState(false);
  const [audit, setAudit] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setShowHistory(false);
    setShowAllChanges(false);
    setAudit(null);
    setLoadError(null);
    if (!row?.audit_id) return;
    let cancelled = false;
    Extras.auditById(row.audit_id)
      .then((response) => !cancelled && setAudit(response.data.data))
      .catch(
        (error: any) =>
          !cancelled &&
          setLoadError(error?.message || "Could not load this entry")
      );
    return () => {
      cancelled = true;
    };
  }, [row?.audit_id]);

  if (!row) return null;

  if (!audit) {
    return (
      <DisplayModal
        open
        onClose={onClose}
        width={640}
        title="Audit Event Details"
      >
        {loadError ? (
          <p className="text-red-600 py-6">{loadError}</p>
        ) : (
          <Loader rows={5} />
        )}
      </DisplayModal>
    );
  }

  const ok = audit.response_status < 400;
  const meta = audit.metadata || {};
  const device = meta.device;
  const actor = audit.admin || audit.user;
  const isSession = ["LOGIN", "LOGOUT", "LOGIN_FAILED"].includes(audit.action);
  const changes: any[] = isSession ? [] : audit.changes || [];
  const meaningful = changes.filter((change) => fieldsOf(change).length > 0);
  const shownChanges = showAllChanges
    ? meaningful
    : meaningful.slice(0, ROWS_SHOWN);

  return (
    <DisplayModal
      open
      onClose={onClose}
      width={660}
      title="Audit Event Details"
    >
      <div className="space-y-5">
        <div className="rounded-2xl bg-[#fff8ea]/70 border border-[#c77e3b]/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0 mt-0.5">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-base font-extrabold text-stone-900">
                  {summarize(audit)}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {humanDateAndTime(audit.created_at)}
                </p>
                {actor && (
                  <p className="text-xs font-semibold text-[#754f2c] mt-1">
                    {actor.email} · {audit.admin ? "Staff" : "Customer"}
                  </p>
                )}
              </div>
            </div>
            <Tag color={ok ? "green" : "red"}>
              {ok ? "Succeeded" : "Failed"}
            </Tag>
          </div>
        </div>

        {meaningful.length > 0 && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Field Changes
            </h4>
            {shownChanges.map((change, index) => (
              <ChangeSummary
                key={`${change.table}-${change.id}-${index}`}
                change={change}
              />
            ))}
            {meaningful.length > shownChanges.length && (
              <button
                type="button"
                className="text-xs font-bold text-[#c77e3b] hover:underline cursor-pointer"
                onClick={() => setShowAllChanges(true)}
              >
                Show {meaningful.length - shownChanges.length} more change(s)
              </button>
            )}
          </div>
        )}
        {!ok && !isSession && (
          <p className="text-xs text-stone-500">
            No changes were saved because the request failed.
          </p>
        )}

        <Collapse
          size="small"
          className="bg-stone-50/70 rounded-xl border border-stone-200/80"
          items={[
            {
              key: "technical",
              label: (
                <span className="text-xs font-bold text-stone-700">
                  Technical Request Diagnostics
                </span>
              ),
              children: (
                <div className="space-y-2 text-xs">
                  <p>
                    <span className="text-stone-500 font-semibold">
                      Request:{" "}
                    </span>
                    <code className="px-1.5 py-0.5 rounded bg-stone-200/70 font-mono">
                      {audit.method} {audit.path}
                    </code>{" "}
                    → {audit.response_status}
                    {audit.duration_ms != null &&
                      ` in ${audit.duration_ms} ms`}
                  </p>
                  <p>
                    <span className="text-stone-500 font-semibold">
                      Client:{" "}
                    </span>
                    {device
                      ? `${device.browser} on ${device.os} (${device.device})`
                      : audit.user_agent || "unknown"}{" "}
                    · IP {audit.ip_address || "unknown"}
                  </p>
                  {meta.roles?.length > 0 && (
                    <p>
                      <span className="text-stone-500 font-semibold">
                        Roles:{" "}
                      </span>
                      {meta.roles.join(", ")}
                    </p>
                  )}
                  {meta.body && Object.keys(meta.body).length > 0 && (
                    <>
                      <p className="text-stone-500 font-semibold">
                        Payload (secrets masked):
                      </p>
                      <pre className="text-[11px] bg-stone-900 text-[#fff8ea] p-3 rounded-xl overflow-x-auto">
                        {JSON.stringify(meta.body, null, 2)}
                      </pre>
                    </>
                  )}
                </div>
              ),
            },
          ]}
        />

        {audit.resource_id && !isSession && (
          <div>
            {showHistory ? (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Full Record Timeline
                </h4>
                <RecordHistory
                  resourceId={audit.resource_id}
                  currentAuditId={audit.audit_id}
                />
              </div>
            ) : (
              <Button
                variant="outline"
                size="xs"
                icon={<History className="w-3.5 h-3.5" />}
                title="View Record History Timeline"
                onClick={() => setShowHistory(true)}
              />
            )}
          </div>
        )}
      </div>
    </DisplayModal>
  );
}
