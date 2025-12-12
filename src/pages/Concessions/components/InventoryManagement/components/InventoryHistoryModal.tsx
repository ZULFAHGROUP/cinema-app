/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { getInventoryHistory } from "../../../../../store/slices/inventory";
import Loader from "../../../../../components/shared/Loader";

interface InventoryHistoryModalProps {
  inventoryId: string;
  cinemaId?: any;
  productName: string;
}

const InventoryHistoryModal = ({ inventoryId, cinemaId, productName }: InventoryHistoryModalProps) => {
  const dispatch = useAppDispatch();
  const { history, loading } = useAppSelector((state) => state.inventory);

  useEffect(() => {
    if (inventoryId) {
      dispatch(getInventoryHistory({inventoryId, cinemaId})).unwrap();
    }
  }, [dispatch, inventoryId]);

  const getOperationColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "stock-in":
      case "stock_in":
        return "bg-green-100 text-green-800";
      case "spoilage":
        return "bg-red-100 text-red-800";
      case "correction":
        return "bg-orange-100 text-orange-800";
      case "transfer-out":
      case "transfer_out":
        return "bg-blue-100 text-blue-800";
      case "transfer-in":
      case "transfer_in":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatOperationType = (type: string) => {
    return type?.replace(/_/g, " ").replace(/-/g, " ").toUpperCase() || "UNKNOWN";
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <p className="text-sm font-semibold text-blue-800">Product: {productName}</p>
      </div>

      {loading ? (
        <Loader rows={5} />
      ) : history && history.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded ${getOperationColor(item.type)}`}>
                      {formatOperationType(item.type)}
                    </span>
                    <span className="text-sm font-semibold">
                      {/* {item.quantity_change > 0 ? "+" : ""} */}
                      {item.quantity_change} units
                    </span>
                  </div>
                  {item.reason && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Reason:</span> {item.reason}
                    </p>
                  )}
                  {item.destination_cinema_id && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">To:</span> {item.destination_cinema_name || item.destination_cinema_id}
                    </p>
                  )}
                  {item.source_cinema_id && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">From:</span> {item.source_cinema_name || item.source_cinema_id}
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-gray-500">
                  {item.created_at && (
                    <>
                      <p>{new Date(item.created_at).toLocaleDateString()}</p>
                      <p>{new Date(item.created_at).toLocaleTimeString()}</p>
                    </>
                  )}
                  {item.user_name && <p className="mt-1 font-medium">{item.user_name}</p>}
                </div>
              </div>
              {item.balance_after !== undefined && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Balance after: <span className="font-semibold">{item.balance_after} units</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No history available for this item</p>
        </div>
      )}
    </div>
  );
};

export default InventoryHistoryModal;
