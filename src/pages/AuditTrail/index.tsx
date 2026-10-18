/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { DatePicker, Input, Select, Tag, Tooltip } from "antd";
import { toast } from "react-toastify";
import ReusableTable from "../../components/shared/Table";
import Loader from "../../components/shared/Loader";
import Button from "../../components/shared/Button";
import Extras, { AuditFilters } from "../../services/network/extras";
import { formatUserLabel, humanDateAndTime } from "../../utils";

const ACTION_COLORS: Record<string, string> = {
  CREATE: "green",
  UPDATE: "blue",
  DELETE: "red",
};

/** "Chrome on Linux" instead of the full user agent string. */
const describeUserAgent = (userAgent?: string) => {
  if (!userAgent) return "Unknown";
  const browser =
    ["Edg", "OPR", "Chrome", "Firefox", "Safari"].find((name) => userAgent.includes(name)) ||
    (userAgent.includes("PostmanRuntime") ? "Postman" : userAgent.includes("curl") ? "curl" : "");
  const os = ["Windows", "Mac OS", "Android", "iPhone", "Linux"].find((name) =>
    userAgent.includes(name)
  );
  const label = [browser === "Edg" ? "Edge" : browser === "OPR" ? "Opera" : browser, os]
    .filter(Boolean)
    .join(" on ");
  return label || userAgent.slice(0, 30);
};

const AuditTrail = () => {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState<AuditFilters>({});
  const [searchText, setSearchText] = useState("");
  const [resources, setResources] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<any>(null);

  const loadAudits = useCallback(
    async (page: number, limit: number, activeFilters: AuditFilters) => {
      setLoading(true);
      try {
        const response = await Extras.allAuditTrails(page, limit, activeFilters);
        setAudits(response.data.data.audits || []);
        setPagination({ page, limit, total: response.data.data.pagination.total });
      } catch (error: any) {
        toast.error(error?.message || "Could not load the audit trail");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAudits(1, pagination.limit, filters);
    // Reload from the first page whenever a filter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, loadAudits]);

  useEffect(() => {
    Extras.auditResources()
      .then((response) => setResources(response.data.data || []))
      .catch(() => setResources([]));
  }, []);

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
      dataIndex: "resource",
      key: "resource",
      render: (resource: string) => formatUserLabel(resource) || "Unknown",
    },
    {
      title: "Result",
      dataIndex: "response_status",
      key: "response_status",
      render: (status: number) =>
        status ? <Tag color={status < 400 ? "green" : "red"}>{status}</Tag> : "-",
    },
    {
      title: "Request",
      dataIndex: "description",
      key: "description",
      render: (description: string) => <span className="text-xs break-all">{description}</span>,
    },
    {
      title: "Client",
      key: "client",
      render: (_: unknown, record: any) => (
        <Tooltip title={record.user_agent}>
          <div className="text-xs">
            <p>{describeUserAgent(record.user_agent)}</p>
            <p className="text-muted-foreground">{record.ip_address}</p>
          </div>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-lg font-semibold">Audit Trail</h2>
          <p className="text-sm text-muted-foreground">
            Every create, update and delete made through the API, newest first.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
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
          options={["CREATE", "UPDATE", "DELETE"].map((action) => ({ label: action, value: action }))}
          className="w-36"
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
    </div>
  );
};

export default AuditTrail;
