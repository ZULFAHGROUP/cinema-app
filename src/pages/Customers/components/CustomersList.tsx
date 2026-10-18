/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Dropdown, Input, Tag } from "antd";
import { MoreHorizontal, Receipt, Trash2 } from "lucide-react";
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

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "green",
  PENDING: "gold",
  NEEDS_REFUND: "orange",
  REFUND_PENDING: "blue",
  REFUNDED: "purple",
};

/** One customer's orders, loaded when the modal opens. */
function CustomerOrders({ customer }: { customer: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0 });

  const load = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await Order.userOrders(customer.user_id, page, limit);
      setOrders(response.data.data.orders || []);
      setPagination({ page, limit, total: response.data.data.pagination.total });
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
      title={`${pagination.total} order(s)`}
      showSearch={false}
      showPagination
      paginationMode="backend"
      paginationProps={{ current: pagination.page, pageSize: pagination.limit, total: pagination.total }}
      onTableChange={(p: any) => load(p.current, p.pageSize)}
      columns={[
        {
          title: "Date",
          dataIndex: "created_at",
          key: "created_at",
          render: (date: string) => humanDateAndTime(date),
        },
        { title: "Cinema", key: "cinema", render: (_: unknown, r: any) => r.cinema?.name },
        {
          title: "Tickets",
          key: "tickets",
          render: (_: unknown, r: any) => r.tickets?.length ?? 0,
        },
        {
          title: "Total",
          dataIndex: "grand_total",
          key: "grand_total",
          render: (total: number) => formatCurrency(total),
        },
        {
          title: "Status",
          dataIndex: "payment_status",
          key: "payment_status",
          render: (status: string) => (
            <Tag color={STATUS_COLORS[status] || "default"}>{status?.replace(/_/g, " ")}</Tag>
          ),
        },
      ]}
    />
  );
}

export default function CustomersList() {
  const dispatch = useAppDispatch();
  const { customers, loading, page, limit, total } = useAppSelector((state) => state.customer);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [ordersFor, setOrdersFor] = useState<any>(null);
  const [toDelete, setToDelete] = useState<any>(null);

  useEffect(() => {
    dispatch(getAllCustomers({ page: 1, limit, search }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, search]);

  // Search on the server after the user stops typing.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchText.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      const response = await Customer.deleteCustomer(toDelete.user_id);
      toast.success(response.data.message);
      dispatch(getAllCustomers({ page, limit, search }));
    } catch (error: any) {
      toast.error(error?.message || "Could not delete the customer");
    } finally {
      setToDelete(null);
    }
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_: unknown, record: any) => `${record.surname} ${record.other_names}`,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Joined",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => humanDateAndTime(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: any) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "orders",
                label: "View orders",
                icon: <Receipt className="w-4 h-4" />,
                onClick: () => setOrdersFor(record),
              },
              { type: "divider" },
              {
                key: "delete",
                label: "Delete customer",
                danger: true,
                icon: <Trash2 className="w-4 h-4" />,
                onClick: () => setToDelete(record),
              },
            ],
          }}
        >
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Input.Search
        allowClear
        placeholder="Search name, email or phone"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="md:w-80!"
      />

      {loading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={customers}
          columns={columns}
          title={`Customers (${total})`}
          showSearch={false}
          showPagination
          paginationMode="backend"
          paginationProps={{ current: page, pageSize: limit, total }}
          onTableChange={(p: any) =>
            dispatch(getAllCustomers({ page: p.current, limit: p.pageSize, search }))
          }
        />
      )}

      <DisplayModal
        open={Boolean(ordersFor)}
        title={ordersFor ? `Orders: ${ordersFor.surname} ${ordersFor.other_names}` : ""}
        onClose={() => setOrdersFor(null)}
        width={800}
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
