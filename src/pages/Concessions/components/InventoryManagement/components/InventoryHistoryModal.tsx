/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { History, Package } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { getInventoryHistory } from "../../../../../store/slices/inventory";
import Loader from "../../../../../components/shared/Loader";

interface InventoryHistoryModalProps {
  inventoryId: string;
  cinemaId?: any;
  productName: string;
}

const InventoryHistoryModal = ({
  inventoryId,
  cinemaId,
  productName,
}: InventoryHistoryModalProps) => {
  const dispatch = useAppDispatch();
  const { history, loading } = useAppSelector((state) => state.inventory);

  useEffect(() => {
    if (inventoryId) {
      dispatch(getInventoryHistory({ inventoryId, cinemaId })).unwrap();
    }
  }, [dispatch, inventoryId, cinemaId]);

  const getOperationColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "stock-in":
      case "stock_in":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "spoilage":
        return "bg-red-50 text-red-700 border-red-200";
      case "correction":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "transfer-out":
      case "transfer_out":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "transfer-in":
      case "transfer_in":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  const formatOperationType = (type: string) => {
    return (
      type?.replace(/_/g, " ").replace(/-/g, " ").toUpperCase() || "UNKNOWN"
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[#fff8ea]/80 border border-[#c77e3b]/25 p-3.5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
          <Package size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
            Stock Movement Ledger
          </p>
          <p className="text-sm font-bold text-stone-900">{productName}</p>
        </div>
      </div>

      {loading ? (
        <Loader rows={5} />
      ) : history && history.length > 0 ? (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {history.map((item: any, index: number) => (
            <div
              key={index}
              className="border border-stone-200/80 rounded-2xl p-3.5 bg-white shadow-xs hover:border-[#c77e3b]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getOperationColor(
                        item.type
                      )}`}
                    >
                      {formatOperationType(item.type)}
                    </span>
                    <span className="text-sm font-bold text-stone-900">
                      {item.quantity_change} units
                    </span>
                  </div>
                  {item.reason && (
                    <p className="text-xs text-stone-600">
                      <span className="font-semibold text-stone-500">
                        Note:
                      </span>{" "}
                      {item.reason}
                    </p>
                  )}
                  {item.destination_cinema_id && (
                    <p className="text-xs text-stone-600">
                      <span className="font-semibold text-stone-500">To:</span>{" "}
                      {item.destination_cinema_name ||
                        item.destination_cinema_id}
                    </p>
                  )}
                  {item.source_cinema_id && (
                    <p className="text-xs text-stone-600">
                      <span className="font-semibold text-stone-500">
                        From:
                      </span>{" "}
                      {item.source_cinema_name || item.source_cinema_id}
                    </p>
                  )}
                </div>

                <div className="text-right text-xs text-stone-400 shrink-0">
                  {item.created_at && (
                    <>
                      <p className="font-medium text-stone-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                      <p>{new Date(item.created_at).toLocaleTimeString()}</p>
                    </>
                  )}
                  {item.user_name && (
                    <p className="mt-1 font-semibold text-[#754f2c]">
                      {item.user_name}
                    </p>
                  )}
                </div>
              </div>

              {item.balance_after !== undefined && (
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Closing Balance</span>
                  <span className="font-bold text-stone-800">
                    {item.balance_after} units
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 text-stone-500">
          <History className="w-7 h-7 text-stone-400 mx-auto mb-1.5" />
          <p className="text-sm font-medium">
            No stock movement history recorded yet
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryHistoryModal;
