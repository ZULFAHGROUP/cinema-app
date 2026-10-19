/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Tag, Timeline } from "antd";
import { toast } from "react-toastify";
import Loader from "./Loader";
import Extras from "../../services/network/extras";
import { formatUserLabel, humanDateAndTime } from "../../utils";
import { ACTION_COLORS } from "../../pages/AuditTrail/constants";

const actorName = (entry: any) => {
  const actor = entry.admin || entry.user;
  return actor ? `${actor.surname} ${actor.other_names}` : "System / not signed in";
};

/**
 * Everything that happened to one record (an order, stock record, display...), oldest
 * first, from the audit trail. Needs the view_audit_logs permission.
 */
export default function RecordHistory({ resourceId, currentAuditId }: { resourceId: string; currentAuditId?: string }) {
  const [entries, setEntries] = useState<any[] | null>(null);

  useEffect(() => {
    Extras.auditTimeline(resourceId, 1, 50)
      .then((response) => setEntries(response.data.data.audits || []))
      .catch((error: any) => {
        toast.error(error?.message || "Could not load the history");
        setEntries([]);
      });
  }, [resourceId]);

  if (!entries) return <Loader rows={3} />;
  if (!entries.length) return <p className="text-sm text-muted-foreground">No other activity on this record.</p>;

  return (
    <Timeline
      items={entries.map((entry) => {
        const changed = (entry.record_changes || []).flatMap((c: any) =>
          c.operation === "update" ? Object.keys(c.after || {}) : []
        );
        return {
          color: entry.response_status >= 400 ? "red" : entry.audit_id === currentAuditId ? "orange" : "blue",
          children: (
            <div className="text-sm">
              <p>
                <Tag color={ACTION_COLORS[entry.action] || "default"}>{entry.action}</Tag>
                {actorName(entry)}
                {entry.audit_id === currentAuditId && <span className="text-[#c77e3b]"> (this entry)</span>}
              </p>
              <p className="text-xs text-muted-foreground">
                {humanDateAndTime(entry.created_at)} · {entry.method} {entry.path}
              </p>
              {changed.length > 0 && (
                <p className="text-xs">Changed: {changed.map((f: string) => formatUserLabel(f)).join(", ")}</p>
              )}
            </div>
          ),
        };
      })}
    />
  );
}

