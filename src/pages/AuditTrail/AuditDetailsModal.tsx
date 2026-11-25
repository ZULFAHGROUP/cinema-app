/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Collapse, Modal, Tag } from "antd";
import { History } from "lucide-react";
import Button from "../../components/shared/Button";
import RecordHistory from "../../components/shared/RecordHistory";
import Loader from "../../components/shared/Loader";
import Extras from "../../services/network/extras";
import { formatUserLabel, humanDateAndTime } from "../../utils";
import { describeResource, kindOf } from "./constants";

// Bookkeeping the API records but people don't need.
const BOOKKEEPING = /^(id|created_at|updated_at|deleted_at|is_deleted|last_login_at|last_seen_at|now_playing|checksum)$/;
// Links to other records (cinema_id, display_id...): their values are ids, so only say they changed.
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
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(Number(value) || 0);

/** A value as a person would write it: ₦ amounts, dates, "Needs refund", Yes/No. */
const readable = (field: string, value: unknown): string => {
  if (value === null || value === undefined || value === "") return "empty";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (MONEY.test(field) && !isNaN(Number(value))) return naira(value);
  if (typeof value === "string" && ISO_DATE.test(value)) return humanDateAndTime(value);
  if (typeof value === "string" && CODE.test(value)) {
    const words = value.replace(/_/g, " ").toLowerCase();
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
  if (Array.isArray(value)) return value.length ? value.map((v) => readable(field, v)).join(", ") : "none";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

/** The fields worth showing for one changed row (updates list only fields that changed). */
const fieldsOf = (change: any) => {
  const source =
    change.operation === "update" ? { ...change.before, ...change.after } : change.after || change.before || {};
  return Object.keys(source).filter(
    (field) =>
      !BOOKKEEPING.test(field) &&
      // New or removed rows: their links are just ids. Updates: a changed link still matters.
      (!REFERENCE.test(field) || change.operation === "update")
  );
};

const actorName = (audit: any) => {
  const actor = audit.admin || audit.user;
  return actor ? `${actor.surname} ${actor.other_names}` : "Someone";
};

/** One sentence saying what happened, e.g. "Sig Mgr updated the cinema Smoke Cinema, Lagos". */
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
      return ok ? `${email || who} reset their password` : `Password reset failed${email ? ` for ${email}` : ""}`;
    case "SWITCH_CINEMA":
      return `${who} switched cinema`;
    default: {
      const verb = { CREATE: "created", UPDATE: "updated", DELETE: "deleted" }[audit.action as string] || "changed";
      const tried = { CREATE: "create", UPDATE: "update", DELETE: "delete" }[audit.action as string] || "change";
      return ok ? `${who} ${verb} ${target}` : `${who} tried to ${tried} ${target}, but it failed`;
    }
  }
};

/** One changed row: updates as before → after (links just "changed"), otherwise the values. */
function ChangeSummary({ change }: { change: any }) {
  const fields = fieldsOf(change);
  const source = change.after || change.before || {};

  return (
    <div className="rounded-md bg-gray-50 p-3 space-y-1.5">
      <p className="text-xs font-medium text-gray-500">
        {OPERATION_VERBS[change.operation] || "Changed"}: {kindOf(change.table)}
      </p>
      {fields.map((field) => (
        <p key={field} className="text-sm">
          <span className="text-gray-600">{formatUserLabel(field.replace(REFERENCE, ""))}: </span>
          {change.operation !== "update" ? (
            <span>{readable(field, source[field])}</span>
          ) : REFERENCE.test(field) ? (
            <span className="font-medium">changed</span>
          ) : (
            <>
              <span className="text-red-700 line-through">{readable(field, change.before?.[field])}</span>
              {" → "}
              <span className="text-green-700 font-medium">{readable(field, change.after?.[field])}</span>
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

export default function AuditDetailsModal({ audit: row, onClose }: AuditDetailsModalProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showAllChanges, setShowAllChanges] = useState(false);
  const [audit, setAudit] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // The list row is a summary; load the full record (changes, roles, device, data sent).
  useEffect(() => {
    setShowHistory(false);
    setShowAllChanges(false);
    setAudit(null);
    setLoadError(null);
    if (!row?.audit_id) return;
    let cancelled = false;
    Extras.auditById(row.audit_id)
      .then((response) => !cancelled && setAudit(response.data.data))
      .catch((error: any) => !cancelled && setLoadError(error?.message || "Could not load this entry"));
    return () => {
      cancelled = true;
    };
  }, [row?.audit_id]);

  if (!row) return null;

  if (!audit) {
    return (
      <Modal open onCancel={onClose} footer={null} width={640} title={null}>
        {loadError ? <p className="text-red-600 py-6">{loadError}</p> : <Loader rows={5} />}
      </Modal>
    );
  }

  const ok = audit.response_status < 400;
  const meta = audit.metadata || {};
  const device = meta.device;
  const actor = audit.admin || audit.user;
  // A sign-in or sign-out only bumps its own timestamps: nothing worth listing.
  const isSession = ["LOGIN", "LOGOUT", "LOGIN_FAILED"].includes(audit.action);
  const changes: any[] = isSession ? [] : audit.changes || [];
  const meaningful = changes.filter((change) => fieldsOf(change).length > 0);
  const shownChanges = showAllChanges ? meaningful : meaningful.slice(0, ROWS_SHOWN);

  return (
    <Modal open onCancel={onClose} footer={null} width={640} title={null}>
      <div className="space-y-5 pt-2">
        <div>
          <p className="text-lg font-semibold">{summarize(audit)}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
            <span>{humanDateAndTime(audit.created_at)}</span>
            <Tag color={ok ? "green" : "red"}>{ok ? "Succeeded" : "Failed"}</Tag>
          </div>
          {actor && (
            <p className="text-sm text-gray-500 mt-1">
              {actor.email} · {audit.admin ? "Staff" : "Customer"}
            </p>
          )}
        </div>

        {meaningful.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">What changed</h4>
            {shownChanges.map((change, index) => (
              <ChangeSummary key={`${change.table}-${change.id}-${index}`} change={change} />
            ))}
            {meaningful.length > shownChanges.length && (
              <button
                type="button"
                className="text-sm text-[#c77e3b] underline"
                onClick={() => setShowAllChanges(true)}
              >
                Show {meaningful.length - shownChanges.length} more
              </button>
            )}
          </div>
        )}
        {!ok && !isSession && (
          <p className="text-sm text-gray-500">Nothing was saved because the request failed.</p>
        )}

        {/* For support and investigations; closed by default. */}
        <Collapse
          size="small"
          items={[
            {
              key: "technical",
              label: "Technical details",
              children: (
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-500">Request: </span>
                    <code className="text-xs">
                      {audit.method} {audit.path}
                    </code>{" "}
                    → {audit.response_status}
                    {audit.duration_ms != null && ` in ${audit.duration_ms} ms`}
                  </p>
                  <p>
                    <span className="text-gray-500">Device: </span>
                    {device ? `${device.browser} on ${device.os} (${device.device})` : audit.user_agent || "unknown"} · IP{" "}
                    {audit.ip_address || "unknown"}
                  </p>
                  {meta.roles?.length > 0 && (
                    <p>
                      <span className="text-gray-500">Roles: </span>
                      {meta.roles.join(", ")}
                    </p>
                  )}
                  {meta.body && Object.keys(meta.body).length > 0 && (
                    <>
                      <p className="text-gray-500">Data sent (passwords and keys hidden):</p>
                      <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
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
              <>
                <h4 className="font-semibold mb-3">History of this record</h4>
                <RecordHistory resourceId={audit.resource_id} currentAuditId={audit.audit_id} />
              </>
            ) : (
              <Button
                variant="outline"
                size="xs"
                className="rounded-md"
                icon={<History className="w-4 h-4" />}
                title="See this record's full history"
                onClick={() => setShowHistory(true)}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
