/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { DatePicker, Input, Select, Tag } from "antd";
import { toast } from "react-toastify";
import ReusableTable from "../../components/shared/Table";
import Loader from "../../components/shared/Loader";
import Button from "../../components/shared/Button";
import Extras, { AuditFilters } from "../../services/network/extras";
import AuditDetailsModal from "./AuditDetailsModal";
import { ACTION_COLORS, AUDIT_ACTIONS, describeResource } from "./constants";
import StatCards from "../../components/shared/StatCards";
import { Activity, LogIn, PencilLine, ShieldAlert } from "lucide-react";
import { formatUserLabel, humanDateAndTime } from "../../utils";
import { useAppSelector } from "../../store/hook";
import { hasPermission } from "../../utils/permissions";


const AuditTrail = () => {
  const { user } = useAppSelector((state) => state.accounts.data);
  const canViewAllAudit = hasPermission(user, "view_audit_logs");
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState<AuditFilters>({});
  const [searchText, setSearchText] = useState("");
  const [resources, setResources] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const loadAudits = useCallback(
    async (page: number, limit: number, activeFilters: AuditFilters) => {
      setLoading(true);
      try {
        const response = canViewAllAudit
          ? await Extras.allAuditTrails(page, limit, activeFilters)
          : await Extras.myAuditTrails(page, limit, activeFilters);
        setAudits(response.data.data.audits || []);
        setStats(response.data.data.stats || null);
        setPagination({ page, limit, total: response.data.data.pagination.total });
      } catch (error: any) {
        toast.error(error?.message || "Could not load the audit trail");
      } finally {
        setLoading(false);
      }
    },
    [canViewAllAudit]
  );

  useEffect(() => {
    loadAudits(1, pagination.limit, filters);
    // Reload from the first page whenever a filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, loadAudits]);

  useEffect(() => {
    if (!canViewAllAudit) return;
    Extras.auditResources()
      .then((response) => setResources(response.data.data || []))
      .catch(() => setResources([]));
  }, [canViewAllAudit]);

  // Search after the user stops typing.
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) =>
        (current.search || "") === searchText.trim()
          ? current
          : { ...current, search: searchText.trim() || undefined }
      );
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const updateFilter = (changes: AuditFilters) =>
    setFilters((current) => ({ ...current, ...changes }));

  const hasFilters = Object.values(filters).some(Boolean);

  const columns = [
    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt: string) => humanDateAndTime(createdAt),
    },
    // Staff actions are recorded under `admin`, customer actions under `user`.
    {
      title: "Performed by",
      key: "actor",
      render: (_: unknown, record: any) => {
        const actor = record.admin || record.user;
        if (!actor) return <span className="text-muted-foreground">System / signed out</span>;
        return (
          <div>
            <p>
              {actor.surname} {actor.other_names}
            </p>
            <p className="text-xs text-muted-foreground">
              {actor.email} · {record.admin ? "Staff" : "Customer"}
            </p>
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action: string) => <Tag color={ACTION_COLORS[action] || "default"}>{action}</Tag>,
    },
    {
      title: "Resource",
      key: "resource",
      render: (_: unknown, record: any) => {
        // Sign-ins and profile edits act on the person's own account: they're already under "Performed by".
        const isActor =
          (record.admin_id && record.resource_details?.admin_id === record.admin_id) ||
          (record.user_id && record.resource_details?.user_id === record.user_id);
        const details = isActor ? null : describeResource(record.resource_details);
        return (
          <div className="max-w-56">
            <p>{formatUserLabel(record.resource) || "Unknown"}</p>
            {details && <p className="text-xs text-muted-foreground truncate">{details.label}</p>}
          </div>
        );
      },
    },
    {
      title: "Result",
      dataIndex: "response_status",
      key: "response_status",
      render: (status: number) =>
        status ? <Tag color={status < 400 ? "green" : "red"}>{status}</Tag> : "-",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-6 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            {canViewAllAudit ? "Audit Trail" : "My Activity Log"}
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            {canViewAllAudit
              ? "Every create, update and delete made through the API, newest first."
              : "Your actions and sign-ins recorded by the API, newest first."}
          </p>
        </div>
      </div>

      <StatCards
        loading={loading}
        items={[
          { label: "Records", value: stats?.total_records ?? 0, icon: Activity },
          {
            label: "Changes",
            value: (stats?.creates ?? 0) + (stats?.updates ?? 0) + (stats?.deletes ?? 0),
            hint: `${stats?.creates ?? 0} created · ${stats?.updates ?? 0} updated · ${stats?.deletes ?? 0} deleted`,
            icon: PencilLine,
            tone: "info",
          },
          {
            label: "Sign-ins",
            value: stats?.logins ?? 0,
            hint: `${stats?.failed_logins ?? 0} failed`,
            icon: LogIn,
            tone: stats?.failed_logins ? "warning" : "good",
            onClick: () =>
              updateFilter({ action: filters.action === "LOGIN_FAILED" ? undefined : "LOGIN_FAILED" }),
            active: filters.action === "LOGIN_FAILED",
          },
          {
            label: "Failed requests",
            value: stats?.failed_requests ?? 0,
            hint: "Click to show only these",
            icon: ShieldAlert,
            tone: stats?.failed_requests ? "danger" : "neutral",
            onClick: () => updateFilter({ status: filters.status === "failed" ? undefined : "failed" }),
            active: filters.status === "failed",
          },
        ]}
      />

      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-4 shadow-2xs flex flex-wrap gap-3 items-center">
        <Input.Search
          allowClear
          placeholder="Search name, email or request"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-72!"
        />
        <Select
          allowClear
          placeholder="Action"
          value={filters.action}
          onChange={(value) => updateFilter({ action: value })}
          options={AUDIT_ACTIONS.map((action) => ({ label: formatUserLabel(action), value: action }))}
          className="w-52"
        />
        <Select
          allowClear
          placeholder="Result"
          value={filters.status}
          onChange={(value) => updateFilter({ status: value })}
          options={[
            { value: "success", label: "Succeeded" },
            { value: "failed", label: "Failed" },
          ]}
          className="w-32"
        />
        <Select
          allowClear
          showSearch
          placeholder="Resource"
          value={filters.resource}
          onChange={(value) => updateFilter({ resource: value })}
          options={resources.map((resource) => ({
            label: formatUserLabel(resource),
            value: resource,
          }))}
          className="w-48"
        />
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => {
            setDateRange(dates);
            updateFilter({
              from: dates?.[0]?.startOf("day").toISOString(),
              to: dates?.[1]?.endOf("day").toISOString(),
            });
          }}
        />
        {hasFilters && (
          <Button
            variant="outline"
            size="xs"
            className="rounded-md"
            title="Clear filters"
            onClick={() => {
              setSearchText("");
              setDateRange(null);
              setFilters({});
            }}
          />
        )}
      </div>

      {loading ? (
        <Loader rows={10} />
      ) : (
        <ReusableTable
          onRowClick={setSelectedAudit}
          data={audits}
          columns={columns}
          title={`Audit Trail (${pagination.total})`}
          showSearch={false}
          showPagination
          paginationMode="backend"
          paginationProps={{
            total: pagination.total,
            current: pagination.page,
            pageSize: pagination.limit,
          }}
          onTableChange={(p: any) => loadAudits(p.current, p.pageSize, filters)}
        />
      )}
      <p className="text-xs text-muted-foreground">Click a row to see its details.</p>

      <AuditDetailsModal audit={selectedAudit} onClose={() => setSelectedAudit(null)} />
    </div>
  );
};

export default AuditTrail;
