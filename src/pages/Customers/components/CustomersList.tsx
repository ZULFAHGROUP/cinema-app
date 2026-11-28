/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Dropdown, Input, Select, Tag } from "antd";
import {
  BadgeCheck,
  CalendarPlus,
  MailWarning,
  MoreVertical,
  Receipt,
  Trash2,
  Users,
} from "lucide-react";
import StatCards from "../../../components/shared/StatCards";
import { toast } from "react-toastify";
import ReusableTable from "../../../components/shared/Table";
import Loader from "../../../components/shared/Loader";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { getAllCustomers } from "../../../store/slices/customer";
import Customer from "../../../services/network/customer";
import Order from "../../../services/network/order";
import { formatCurrency, humanDateAndTime } from "../../../utils";
import { hasPermission } from "../../../utils/permissions";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "green",
  PENDING: "gold",
  NEEDS_REFUND: "orange",
  REFUND_PENDING: "blue",
  REFUNDED: "purple",
};

function CustomerOrders({ customer }: { customer: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
  });

  const load = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await Order.userOrders(customer.user_id, page, limit);
      setOrders(response.data.data.orders || []);
      setPagination({
        page,
        limit,
        total: response.data.data.pagination.total,
      });
    } catch (error: any) {
      toast.error(error?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer.user_id]);

  if (loading) return <Loader rows={4} />;

  return (
    <ReusableTable
      data={orders}
      title={`${pagination.total} Order(s)`}
      showSearch={false}
      showPagination
      paginationMode="backend"
      paginationProps={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
      }}
      onTableChange={(p: any) => load(p.current, p.pageSize)}
      columns={[
        {
          title: "Date",
          dataIndex: "created_at",
          key: "created_at",
          render: (date: string) => humanDateAndTime(date),
        },
        {
          title: "Cinema",
          key: "cinema",
          render: (_: unknown, r: any) => r.cinema?.name,
        },
        {
          title: "Tickets",
          key: "tickets",
          render: (_: unknown, r: any) => r.tickets?.length ?? 0,
        },
        {
          title: "Total",
          dataIndex: "grand_total",
          key: "grand_total",
          render: (total: number) => (
            <span className="font-bold">{formatCurrency(total)}</span>
          ),
        },
        {
          title: "Status",
          dataIndex: "payment_status",
          key: "payment_status",
          render: (status: string) => (
            <Tag color={STATUS_COLORS[status] || "default"}>
              {status?.replace(/_/g, " ")}
            </Tag>
          ),
        },
      ]}
    />
  );
}

export default function CustomersList() {
  const dispatch = useAppDispatch();
  const { customers, loading, page, limit, total, stats } = useAppSelector(
    (state) => state.customer
  );
  const { user } = useAppSelector((state) => state.accounts.data);
  const canDeleteCustomer = hasPermission(user, "manage_users");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined);
  const [ordersFor, setOrdersFor] = useState<any>(null);
  const [toDelete, setToDelete] = useState<any>(null);

  useEffect(() => {
    dispatch(
      getAllCustomers({ page: 1, limit, search, is_verified: isVerified })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search, isVerified]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchText.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      const response = await Customer.deleteCustomer(toDelete.user_id);
      toast.success(response.data.message);
      dispatch(
        getAllCustomers({ page, limit, search, is_verified: isVerified })
      );
    } catch (error: any) {
      toast.error(error?.message || "Could not delete the customer");
    } finally {
      setToDelete(null);
    }
  };

  const columns = [
    {
      title: "Customer",
      key: "name",
      render: (_: unknown, record: any) => {
        const initials = `${record.surname?.[0] || ""}${
          record.other_names?.[0] || ""
        }`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fff8ea] border border-[#c77e3b]/30 text-[#754f2c] text-xs font-bold flex items-center justify-center shrink-0">
              {initials || "C"}
            </div>
            <div>
              <p className="font-bold text-stone-900">
                {record.surname} {record.other_names}
              </p>
              <p className="text-xs text-stone-500">{record.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <span className="text-xs font-medium text-stone-700">
          {phone || "—"}
        </span>
      ),
    },
    {
      title: "Joined",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (
        <span className="text-xs text-stone-600">{humanDateAndTime(date)}</span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      render: (_: unknown, record: any) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "orders",
                label: "View Orders",
                icon: <Receipt className="w-4 h-4" />,
                onClick: () => setOrdersFor(record),
              },
              ...(canDeleteCustomer
                ? [
                    { type: "divider" as const },
                    {
                      key: "delete",
                      label: "Delete Customer",
                      danger: true,
                      icon: <Trash2 className="w-4 h-4" />,
                      onClick: () => setToDelete(record),
                    },
                  ]
                : []),
            ],
          }}
        >
          <button
            type="button"
            className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </Dropdown>
      ),
    },
  ];

  const toggleVerified = (value: boolean) =>
    setIsVerified((current) => (current === value ? undefined : value));

  const statItems = [
    {
      label: "Total Customers",
      value: stats?.total_customers ?? 0,
      icon: Users,
      onClick: () => setIsVerified(undefined),
    },
    {
      label: "Verified Accounts",
      value: stats?.verified_customers ?? 0,
      icon: BadgeCheck,
      tone: "good" as const,
      onClick: () => toggleVerified(true),
      active: isVerified === true,
    },
    {
      label: "Unverified",
      value: stats?.unverified_customers ?? 0,
      icon: MailWarning,
      tone: "warning" as const,
      onClick: () => toggleVerified(false),
      active: isVerified === false,
    },
    {
      label: "New This Month",
      value: stats?.new_this_month ?? 0,
      icon: CalendarPlus,
      tone: "info" as const,
    },
  ];

  return (
    <div className="space-y-5">
      <StatCards items={statItems} loading={loading} />

      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-4 shadow-2xs flex flex-wrap gap-3 items-center">
        <Input.Search
          allowClear
          placeholder="Search name, email or phone..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-80!"
        />
        <Select
          value={isVerified === undefined ? "all" : isVerified ? "yes" : "no"}
          onChange={(value) =>
            setIsVerified(value === "all" ? undefined : value === "yes")
          }
          options={[
            { value: "all", label: "All customers" },
            { value: "yes", label: "Verified" },
            { value: "no", label: "Not verified" },
          ]}
          className="w-44"
        />
      </div>

      {loading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={customers}
          columns={columns}
          title={`Registered Customers (${total})`}
          showSearch={false}
          showPagination
          paginationMode="backend"
          paginationProps={{ current: page, pageSize: limit, total }}
          onTableChange={(p: any) =>
            dispatch(
              getAllCustomers({
                page: p.current,
                limit: p.pageSize,
                search,
                is_verified: isVerified,
              })
            )
          }
        />
      )}

      <DisplayModal
        open={Boolean(ordersFor)}
        title={
          ordersFor
            ? `Order History — ${ordersFor.surname} ${ordersFor.other_names}`
            : ""
        }
        onClose={() => setOrdersFor(null)}
        width={820}
      >
        {ordersFor && <CustomerOrders customer={ordersFor} />}
      </DisplayModal>

      <ConfirmationModal
        open={Boolean(toDelete)}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        content={`Delete ${toDelete?.surname} ${toDelete?.other_names}? They will no longer be able to sign in.`}
      />
    </div>
  );
}
