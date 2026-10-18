/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { DatePicker, Input, Select, Tag } from "antd";
import { Banknote, Clock, Receipt, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import ReusableTable from "../../../components/shared/Table";
import Loader from "../../../components/shared/Loader";
import Button from "../../../components/shared/Button";
import StatCards from "../../../components/shared/StatCards";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { getAllCinemas } from "../../../store/slices/cinema";
import Order, { OrderFilters } from "../../../services/network/order";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { ORDER_STATUSES, ORDER_STATUS_OPTIONS } from "../../../constants/orders";
import { formatCurrency, humanDateAndTime } from "../../../utils";

const EMPTY_STATS = {
  total_orders: 0,
  completed_orders: 0,
  pending_orders: 0,
  awaiting_refund: 0,
  refunded_orders: 0,
  online_orders: 0,
  counter_orders: 0,
  revenue: 0,
  vat_collected: 0,
};

export default function Sales() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.accounts.data);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState<OrderFilters>({});
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<any>(null);
  const search = useDebouncedValue(searchText.trim());

  useEffect(() => {
    if (isAdmin) dispatch(getAllCinemas({ page: 1, limit: 50 }));
  }, [dispatch, isAdmin]);

  const load = useCallback(async (page: number, limit: number, active: OrderFilters) => {
    setLoading(true);
    try {
      const response = await Order.allOrders(page, limit, active);
      const data = response.data.data;
      setOrders(data.orders || []);
      setStats({ ...EMPTY_STATS, ...data.stats });
      setPagination({ page, limit, total: data.pagination.total });
    } catch (error: any) {
      toast.error(error?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const activeFilters = { ...filters, search: search || undefined };

  // Back to page 1 whenever a filter or the search changes.
  useEffect(() => {
    load(1, pagination.limit, activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, search, load]);

  const updateFilter = (changes: OrderFilters) => setFilters((current) => ({ ...current, ...changes }));
  const toggleStatus = (status: string) =>
    updateFilter({ status: filters.status === status ? undefined : status });
  const hasFilters = Boolean(search) || Object.values(filters).some(Boolean);

  const statItems = [
    {
      label: "Revenue",
      value: formatCurrency(stats.revenue),
      hint: `${formatCurrency(stats.vat_collected)} VAT · completed orders`,
      icon: Banknote,
      tone: "good" as const,
    },
    {
      label: "Orders",
      value: stats.total_orders,
      hint: `${stats.online_orders.toLocaleString()} online · ${stats.counter_orders.toLocaleString()} counter`,
      icon: Receipt,
    },
    {
      label: "Pending payment",
      value: stats.pending_orders,
      hint: "Click to show only these",
      icon: Clock,
      tone: "warning" as const,
      onClick: () => toggleStatus("PENDING"),
      active: filters.status === "PENDING",
    },
    {
      label: "Awaiting refund",
      value: stats.awaiting_refund,
      hint: `${stats.refunded_orders.toLocaleString()} already refunded`,
      icon: RotateCcw,
      tone: stats.awaiting_refund ? ("danger" as const) : ("neutral" as const),
      onClick: () => toggleStatus("NEEDS_REFUND"),
      active: filters.status === "NEEDS_REFUND",
    },
  ];

  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => humanDateAndTime(date),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: unknown, record: any) =>
        record.user ? (
          <div>
            <p>
              {record.user.surname} {record.user.other_names}
            </p>
            <p className="text-xs text-muted-foreground">{record.user.email}</p>
          </div>
        ) : (
          <div>
            <p>Counter sale</p>
            {record.cashier && (
              <p className="text-xs text-muted-foreground">
                by {record.cashier.surname} {record.cashier.other_names}
              </p>
            )}
          </div>
        ),
    },
    { title: "Type", dataIndex: "order_type", key: "order_type" },
    {
      title: "Cinema",
      key: "cinema",
      render: (_: unknown, record: any) => record.cinema?.name,
    },
    {
      title: "Total",
      dataIndex: "grand_total",
      key: "grand_total",
      render: (total: number, record: any) => (
        <div>
          <p className="font-semibold">{formatCurrency(total)}</p>
          <p className="text-xs text-muted-foreground">VAT {formatCurrency(record.vat_amount)}</p>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string) => (
        <Tag color={ORDER_STATUSES[status]?.color || "default"}>
          {ORDER_STATUSES[status]?.label || status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <StatCards items={statItems} loading={loading} />

      <div className="flex flex-wrap gap-3 items-center">
        <Input.Search
          allowClear
          placeholder="Search order id, customer or cashier"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-72!"
        />
        <Select
          allowClear
          placeholder="Status"
          value={filters.status}
          onChange={(value) => updateFilter({ status: value })}
          options={ORDER_STATUS_OPTIONS}
          className="w-44"
        />
        <Select
          allowClear
          placeholder="Channel"
          value={filters.channel}
          onChange={(value) => updateFilter({ channel: value })}
          options={[
            { value: "online", label: "Online" },
            { value: "counter", label: "Counter" },
          ]}
          className="w-32"
        />
        <Select
          allowClear
          placeholder="Type"
          value={filters.order_type}
          onChange={(value) => updateFilter({ order_type: value })}
          options={["Ticket", "Concession", "Mixed"].map((type) => ({ value: type, label: type }))}
          className="w-32"
        />
        {isAdmin && (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="All cinemas"
            value={filters.cinema_id}
            onChange={(value) => updateFilter({ cinema_id: value })}
            options={allCinemas.map((cinema: any) => ({ value: cinema.cinema_id, label: cinema.name }))}
            className="w-48"
          />
        )}
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => {
            setDateRange(dates);
            // The API includes the whole `to` day.
            updateFilter({
              from: dates?.[0]?.format("YYYY-MM-DD"),
              to: dates?.[1]?.format("YYYY-MM-DD"),
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

      {loading && orders.length === 0 ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={orders}
          columns={columns}
          title={`Orders (${pagination.total.toLocaleString()})`}
          showSearch={false}
          showPagination
          paginationMode="backend"
          paginationProps={{
            total: pagination.total,
            current: pagination.page,
            pageSize: pagination.limit,
          }}
          onTableChange={(p: any) => load(p.current, p.pageSize, activeFilters)}
        />
      )}
    </div>
  );
}
