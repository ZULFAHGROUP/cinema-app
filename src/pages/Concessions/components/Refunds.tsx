/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Checkbox, Tag } from "antd";
import { RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import ReusableTable from "../../../components/shared/Table";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import TextArea from "../../../components/shared/TextArea";
import Button from "../../../components/shared/Button";
import Loader from "../../../components/shared/Loader";
import Order from "../../../services/network/order";
import { newIdempotencyKey } from "../../../services/httpClient";
import { formatCurrency, humanDateAndTime } from "../../../utils";

/** Paid orders whose seats were resold after the hold ran out; staff refund them here. */
export default function Refunds() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [note, setNote] = useState("");
  const [manual, setManual] = useState(false);
  const [refunding, setRefunding] = useState(false);
  // New key for each refund dialog; reused if the user retries the same refund.
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);

  const loadRefunds = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await Order.refunds(page, limit);
      setOrders(response.data.data.orders || []);
      setPagination({ page, limit, total: response.data.data.pagination.total });
    } catch (error: any) {
      toast.error(error?.message || "Could not load refunds");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRefunds();
  }, [loadRefunds]);

  const openRefund = (order: any) => {
    setSelectedOrder(order);
    setNote("");
    setManual(false);
    setIdempotencyKey(newIdempotencyKey());
  };

  const handleRefund = async () => {
    if (!selectedOrder) return;
    setRefunding(true);
    try {
      const response = await Order.refundOrder(
        selectedOrder.order_id,
        { note: note.trim() || undefined, manual: manual || undefined },
        idempotencyKey
      );
      toast.success(response.data.message);
      setSelectedOrder(null);
      loadRefunds(pagination.page, pagination.limit);
    } catch (error: any) {
      toast.error(error?.message || "Refund failed");
    } finally {
      setRefunding(false);
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt: string) => humanDateAndTime(createdAt),
    },
    {
      title: "Customer",
      key: "user",
      render: (_: unknown, record: any) =>
        record.user ? (
          <div>
            <p>
              {record.user.surname} {record.user.other_names}
            </p>
            <p className="text-xs">{record.user.email}</p>
          </div>
        ) : (
          <div>
            <p>Counter sale</p>
            {record.cashier && (
              <p className="text-xs">
                by {record.cashier.surname} {record.cashier.other_names}
              </p>
            )}
          </div>
        ),
    },
    {
      title: "Cinema",
      key: "cinema",
      render: (_: unknown, record: any) => record.cinema?.name,
    },
    {
      title: "Amount",
      dataIndex: "grand_total",
      key: "grand_total",
      render: (total: number) => <span className="font-semibold">{formatCurrency(total)}</span>,
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string) =>
        status === "REFUND_PENDING" ? (
          <Tag color="blue">Refund in progress</Tag>
        ) : (
          <Tag color="orange">Needs refund</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: any) => (
        <Button
          title="Refund"
          size="xs"
          className="rounded-md"
          icon={<RotateCcw className="w-4 h-4" />}
          disabled={record.payment_status !== "NEEDS_REFUND"}
          onClick={() => openRefund(record)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        These orders were paid after their seat hold ended and the seats had been resold.
        Refund them in full here.
      </p>
      {loading ? (
        <Loader rows={4} />
      ) : (
        <ReusableTable
          data={orders}
          columns={columns}
          title="Orders Awaiting Refund"
          showSearch={false}
          showPagination
          paginationMode="backend"
          paginationProps={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
          }}
          onTableChange={(p: any) => loadRefunds(p.current, p.pageSize)}
        />
      )}

      <DisplayModal
        open={Boolean(selectedOrder)}
        title="Refund order"
        onClose={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p>
              Refund <strong>{formatCurrency(selectedOrder.grand_total)}</strong> in full
              {selectedOrder.user ? ` to ${selectedOrder.user.email}` : ""}.
            </p>
            <TextArea
              label="Note (optional)"
              value={note}
              maxLength={500}
              rows={3}
              onChange={(e) => setNote(e.target.value)}
            />
            <Checkbox checked={manual} onChange={(e) => setManual(e.target.checked)}>
              Already refunded outside the app (gateway dashboard or cash): only record it
            </Checkbox>
            <div className="flex gap-2 pt-4 border-t">
              <Button
                className="flex-1 rounded-md"
                title={manual ? "Record refund" : "Refund through gateway"}
                loading={refunding}
                disabled={refunding}
                onClick={handleRefund}
              />
              <Button
                variant="outline"
                className="rounded-md"
                title="Cancel"
                disabled={refunding}
                onClick={() => setSelectedOrder(null)}
              />
            </div>
          </div>
        )}
      </DisplayModal>
    </div>
  );
}
