/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Checkbox, Tag } from "antd";
import { RotateCcw, Info } from "lucide-react";
import { toast } from "react-toastify";
import ReusableTable from "../../../components/shared/Table";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import TextArea from "../../../components/shared/TextArea";
import Button from "../../../components/shared/Button";
import Loader from "../../../components/shared/Loader";
import Order from "../../../services/network/order";
import { newIdempotencyKey } from "../../../services/httpClient";
import { formatCurrency, humanDateAndTime } from "../../../utils";

export default function Refunds() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [note, setNote] = useState("");
  const [manual, setManual] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);

  const loadRefunds = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await Order.refunds(page, limit);
      setOrders(response.data.data.orders || []);
      setPagination({
        page,
        limit,
        total: response.data.data.pagination.total,
      });
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
      render: (createdAt: string) => (
        <span className="text-xs font-medium text-stone-700">
          {humanDateAndTime(createdAt)}
        </span>
      ),
    },
    {
      title: "Customer",
      key: "user",
      render: (_: unknown, record: any) =>
        record.user ? (
          <div>
            <p className="font-bold text-stone-900">
              {record.user.surname} {record.user.other_names}
            </p>
            <p className="text-xs text-stone-500">{record.user.email}</p>
          </div>
        ) : (
          <div>
            <p className="font-bold text-stone-800">Counter Sale</p>
            {record.cashier && (
              <p className="text-xs text-stone-500">
                by {record.cashier.surname} {record.cashier.other_names}
              </p>
            )}
          </div>
        ),
    },
    {
      title: "Cinema",
      key: "cinema",
      render: (_: unknown, record: any) => (
        <span className="text-xs font-semibold text-stone-700">
          {record.cinema?.name || "—"}
        </span>
      ),
    },
    {
      title: "Refund Amount",
      dataIndex: "grand_total",
      key: "grand_total",
      render: (total: number) => (
        <span className="font-extrabold text-stone-900 tabular-nums">
          {formatCurrency(total)}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string) =>
        status === "REFUND_PENDING" ? (
          <Tag color="blue">Refund in Progress</Tag>
        ) : (
          <Tag color="orange">Needs Refund</Tag>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: any) => (
        <Button
          title="Process Refund"
          size="xs"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          disabled={record.payment_status !== "NEEDS_REFUND"}
          onClick={() => openRefund(record)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-4 shadow-2xs flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <p className="text-xs text-stone-600">
          Orders listed below were paid after their seat hold expired and the
          seats had been resold. Issue full refunds to customers here.
        </p>
      </div>

      {loading ? (
        <Loader rows={4} />
      ) : (
        <ReusableTable
          data={orders}
          columns={columns}
          title={`Orders Awaiting Refund (${pagination.total})`}
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
        title="Process Order Refund"
        subtitle="Issue a full payment reversal or log an external cash/gateway refund"
        onClose={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <div className="space-y-5">
            <div className="rounded-xl bg-[#fff8ea] border border-[#c77e3b]/25 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
                  Refund Total
                </p>
                <p className="text-xl font-extrabold text-stone-900 mt-0.5">
                  {formatCurrency(selectedOrder.grand_total)}
                </p>
              </div>
              {selectedOrder.user && (
                <div className="text-right">
                  <p className="text-xs font-semibold text-stone-500">
                    Recipient
                  </p>
                  <p className="text-xs font-bold text-stone-800">
                    {selectedOrder.user.email}
                  </p>
                </div>
              )}
            </div>

            <TextArea
              label="Refund Note (Optional)"
              value={note}
              maxLength={500}
              rows={3}
              placeholder="Add an internal note or reference number..."
              onChange={(e) => setNote(e.target.value)}
            />

            <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-3.5">
              <Checkbox
                checked={manual}
                onChange={(e) => setManual(e.target.checked)}
              >
                <span className="text-xs font-medium text-stone-700">
                  Already refunded outside the app (gateway dashboard or cash) —
                  only record it
                </span>
              </Checkbox>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200/80">
              <Button
                variant="outline"
                title="Cancel"
                disabled={refunding}
                onClick={() => setSelectedOrder(null)}
              />
              <Button
                className="min-w-[170px]"
                title={manual ? "Record Manual Refund" : "Refund via Gateway"}
                loading={refunding}
                disabled={refunding}
                onClick={handleRefund}
              />
            </div>
          </div>
        )}
      </DisplayModal>
    </div>
  );
}
