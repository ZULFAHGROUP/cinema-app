import Button from "../../../../components/shared/Button";
import { Package2, TrendingUp, TrendingDown, Edit2, History, ArrowLeftRight, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getAllInventories, deleteInventory } from "../../../../store/slices/inventory";
import { getAllProducts } from "../../../../store/slices/product";
import { getAllCinemas } from "../../../../store/slices/cinema";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ReusableSelect from "../../../../components/shared/Select";
import { toast } from "react-toastify";
import ReusableTable from "../../../../components/shared/Table";
import Loader from "../../../../components/shared/Loader";
import StockInForm from "./components/StockInForm";
import SpoilageForm from "./components/SpoilageForm";
import CorrectionForm from "./components/CorrectionForm";
import TransferForm from "./components/TransferForm";
import InventoryHistoryModal from "./components/InventoryHistoryModal";

const InventoryManagement = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [showSpoilageModal, setShowSpoilageModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");

  const dispatch = useAppDispatch();
  const { inventories, loading, page, limit, total } = useAppSelector((state) => state.inventory);
  const { products } = useAppSelector((state) => state.product);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { user } = useAppSelector((state) => state.accounts.data);

  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin";

  // Determine active cinema: admin uses selected, others don't pass (backend uses auth token)
  const activeCinemaId = isAdmin ? selectedCinemaId : undefined;

  useEffect(() => {
    if (isAdmin) {
      dispatch(getAllCinemas({ page: 1, limit: 100 }));
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    if (activeCinemaId) {
      dispatch(getAllInventories({ page, limit, cinema_id: activeCinemaId }));
      dispatch(getAllProducts({ page: 1, limit: 1000, cinema_id: activeCinemaId }));
    }
  }, [dispatch, page, limit, activeCinemaId]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(deleteInventory(selectedItem.inventory_id)).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllInventories({ page, limit, cinema_id: activeCinemaId }));
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting inventory");
      setShowDeleteModal(false);
    }
  };

  // Get product details for an inventory item
  const getProductDetails = (productId: string) => {
    return products?.find((p: any) => p.product_id === productId);
  };

  // Determine stock status
  const getStockStatus = (quantity: number, reorderLevel: number) => {
    if (quantity === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (quantity <= reorderLevel) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product_id",
      key: "product_id",
      render: (productId: string) => {
        const product = getProductDetails(productId) as any;
        return (
                        <div>
              <p className="font-medium">{product?.name || "Unknown Product"}</p>
              <p className="text-sm text-gray-500">{product?.product_category?.name}</p>
            </div>
        );
      },
    },
    {
      title: "Current Stock",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => <span className="font-semibold">{quantity}</span>,
    },
    {
      title: "Reorder Level",
      dataIndex: "reorder_level",
      key: "reorder_level",
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: any) => {
        const status = getStockStatus(record.quantity, record.reorder_level);
        return (
          <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
            {status.label}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const product = getProductDetails(record.product_id) as any;
        return (
          <div className="flex gap-1 flex-wrap">
            <Dropdown
              menu={{
                items: [
                  {
                    key: "1",
                    label: "Stock In",
                    icon: <TrendingUp className="w-4 h-4" />,
                    onClick: () => {
                      setSelectedItem({ ...record, productName: product?.name });
                      setShowStockInModal(true);
                    },
                  },
                  {
                    key: "2",
                    label: "Record Spoilage",
                    icon: <TrendingDown className="w-4 h-4" />,
                    onClick: () => {
                      setSelectedItem({ ...record, productName: product?.name });
                      setShowSpoilageModal(true);
                    },
                  },
                  {
                    key: "3",
                    label: "Correct Stock",
                    icon: <Edit2 className="w-4 h-4" />,
                    onClick: () => {
                      setSelectedItem({ ...record, productName: product?.name });
                      setShowCorrectionModal(true);
                    },
                  },
                  {
                    key: "4",
                    label: "Transfer Stock",
                    icon: <ArrowLeftRight className="w-4 h-4" />,
                    onClick: () => {
                      setSelectedItem({ ...record, productName: product?.name });
                      setShowTransferModal(true);
                    },
                  },
                  {
                    key: "5",
                    label: "History",
                    icon: <History className="w-4 h-4" />,
                    onClick: () => {
                      setSelectedItem({ ...record, productName: product?.name });
                      setShowHistoryModal(true);
                    },
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Button
                size="sm"
                className="p-0 bg-transparent w-fit shadow-none text-black!"
                icon={<MoreVertical className="" size={18} />}
              />
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleTableChange = (pagination: any) => {
    dispatch(
      getAllInventories({
        page: pagination.current,
        limit: pagination.pageSize,
        cinema_id: activeCinemaId,
      })
    ).unwrap();
  };

  // Low stock items for alerts
  const lowStockItems = inventories?.filter((inv: any) => {
    const status = getStockStatus(inv.quantity, inv.reorder_level);
    return status.label !== "In Stock";
  });

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package2 className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Stock Alerts ({lowStockItems.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockItems.slice(0, 6).map((item: any) => {
              const product = getProductDetails(item.product_id) as any;
              const status = getStockStatus(item.quantity, item.reorder_level);
              return (
                <div key={item.inventory_id} className="bg-white rounded p-2 text-sm">
                  <p className="font-medium">{product?.name}</p>
                  <p className="text-gray-600">
                    Stock: {item.quantity} / Min: {item.reorder_level}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cinema Selector for Admin */}
      {isAdmin && (
        <div className="mb-4 w-64">
          <ReusableSelect
            label="Select Cinema"
            name="cinema_filter"
            value={selectedCinemaId}
            onChange={(value) => setSelectedCinemaId(value as string)}
            options={allCinemas?.map((cinema: any) => ({
              label: cinema.name,
              value: cinema.cinema_id,
            })) || []}
            defaultOption="Select cinema"
          />
        </div>
      )}

      {/* Inventory Table */}
      {loading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={inventories || []}
          columns={columns}
          title="Inventory"
          searchField={["product_id"]}
          excludeColumns={["inventory_id", "cinema_id", "created_at", "updated_at"]}
          showPagination={true}
          paginationMode="backend"
          paginationProps={{
            total,
            current: page,
            pageSize: limit,
          }}
          onTableChange={handleTableChange}
        />
      )}

      {/* Stock In Modal */}
      <DisplayModal
        open={showStockInModal}
        title="Stock In"
        onClose={() => setShowStockInModal(false)}
        width={600}
      >
        <StockInForm
          onCancel={() => setShowStockInModal(false)}
          inventoryId={selectedItem?.inventory_id}
          productName={selectedItem?.productName}
          cinema_id={selectedCinemaId}
        />
      </DisplayModal>

      {/* Spoilage Modal */}
      <DisplayModal
        open={showSpoilageModal}
        title="Record Spoilage"
        onClose={() => setShowSpoilageModal(false)}
        width={600}
      >
        <SpoilageForm
          onCancel={() => setShowSpoilageModal(false)}
          inventoryId={selectedItem?.inventory_id}
          productName={selectedItem?.productName}
          currentStock={selectedItem?.quantity}
          cinema_id={selectedCinemaId}
        />
      </DisplayModal>

      {/* Correction Modal */}
      <DisplayModal
        open={showCorrectionModal}
        title="Correct Inventory"
        onClose={() => setShowCorrectionModal(false)}
        width={600}
      >
        <CorrectionForm
          onCancel={() => setShowCorrectionModal(false)}
          inventoryId={selectedItem?.inventory_id}
          productName={selectedItem?.productName}
          currentStock={selectedItem?.quantity}         
           cinema_id={selectedCinemaId}
        />
      </DisplayModal>

      {/* Transfer Modal */}
      <DisplayModal
        open={showTransferModal}
        title="Transfer Inventory"
        onClose={() => setShowTransferModal(false)}
        width={600}
      >
        <TransferForm
          onCancel={() => setShowTransferModal(false)}
          inventoryId={selectedItem?.inventory_id}
          productName={selectedItem?.productName}
          currentStock={selectedItem?.quantity}
        />
      </DisplayModal>

      {/* History Modal */}
      <DisplayModal
        open={showHistoryModal}
        title="Inventory History"
        onClose={() => setShowHistoryModal(false)}
        width={700}
      >
        <InventoryHistoryModal
          inventoryId={selectedItem?.inventory_id}
          cinemaId={selectedItem?.cinema_id}
          productName={selectedItem?.productName}
        />
      </DisplayModal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        item={selectedItem?.productName}
      />
    </div>
  );
};

export default InventoryManagement;
