/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../../components/shared/Button";
import {
  AlertTriangle,
  Boxes,
  Edit2,
  History,
  ArrowLeftRight,
  MoreVertical,
  Package,
  PackageX,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Dropdown, Input, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getAllInventories, deleteInventory } from "../../../../store/slices/inventory";
import { getAllProductCategories } from "../../../../store/slices/productCat";
import { getAllCinemas } from "../../../../store/slices/cinema";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import StatCards from "../../../../components/shared/StatCards";
import { toast } from "react-toastify";
import ReusableTable from "../../../../components/shared/Table";
import Loader from "../../../../components/shared/Loader";
import StockInForm from "./components/StockInForm";
import SpoilageForm from "./components/SpoilageForm";
import CorrectionForm from "./components/CorrectionForm";
import TransferForm from "./components/TransferForm";
import InventoryHistoryModal from "./components/InventoryHistoryModal";
import { InventoryFilters } from "../../../../services/network/inventory";
import { useDebouncedValue } from "../../../../hooks/useDebouncedValue";
import RecordHistory from "../../../../components/shared/RecordHistory";
import { hasPermission, isAdminRole } from "../../../../utils/permissions";

const getStockStatus = (quantity: number, reorderLevel: number) => {
  if (quantity <= 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
  if (quantity <= reorderLevel) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
  return { label: "In Stock", color: "bg-green-100 text-green-800" };
};

const InventoryManagement = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [showSpoilageModal, setShowSpoilageModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("");
  const [auditFor, setAuditFor] = useState<any>(null);
  const [filters, setFilters] = useState<InventoryFilters>({});
  const [searchText, setSearchText] = useState("");
  const search = useDebouncedValue(searchText.trim());

  const dispatch = useAppDispatch();
  const { inventories, loading, page, limit, total, stats } = useAppSelector((state) => state.inventory);
  const { productCats } = useAppSelector((state) => state.productCat);
  const { allCinemas } = useAppSelector((state) => state.cinema);
  const { user } = useAppSelector((state) => state.accounts.data);

  const isAdmin = isAdminRole(user);
  const canStockIn = hasPermission(user, "stockin_inventory");
  const canManageInv = hasPermission(user, "manage_inventories") || hasPermission(user, "manage_inventory");
  const canTransfer = hasPermission(user, "transfer_inventory");
  const canViewAudit = hasPermission(user, "view_audit_logs");

  // Admins can narrow to one cinema (blank = all); everyone else sees their own cinema.
  const activeCinemaId = isAdmin ? selectedCinemaId || undefined : undefined;
  const activeFilters: InventoryFilters = { ...filters, search: search || undefined };

  useEffect(() => {
    if (isAdmin) dispatch(getAllCinemas({ page: 1, limit: 50 }));
    dispatch(getAllProductCategories({ page: 1, limit: 50 }));
  }, [dispatch, isAdmin]);

  // Back to page 1 whenever the cinema, a filter or the search changes.
  useEffect(() => {
    dispatch(getAllInventories({ page: 1, limit, cinema_id: activeCinemaId, filters: activeFilters }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, activeCinemaId, filters, search]);

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
      toast.error(error?.message || "Error deleting inventory");
      setShowDeleteModal(false);
    }
  };

  const categoryName = (categoryId?: string) =>
    (productCats as any[])?.find((c: any) => c.product_category_id === categoryId)?.name;
  const cinemaName = (cinemaId: string) =>
    allCinemas?.find((c: any) => c.cinema_id === cinemaId)?.name;

  const openModal = (record: any, open: (value: boolean) => void) => {
    setSelectedItem({ ...record, productName: record.product?.name });
    open(true);
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_: unknown, record: any) => (
        <div>
          <p className="font-medium">{record.product?.name || "Unknown Product"}</p>
          <p className="text-sm text-gray-500">{categoryName(record.product?.product_category_id)}</p>
        </div>
      ),
    },
    ...(isAdmin && !activeCinemaId
      ? [
          {
            title: "Cinema",
            key: "cinema",
            render: (_: unknown, record: any) => cinemaName(record.cinema_id) || "-",
          },
        ]
      : []),
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
        return <span className={`text-xs px-2 py-1 rounded ${status.color}`}>{status.label}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              ...(canStockIn
                ? [
                    {
                      key: "1",
                      label: "Stock In",
                      icon: <TrendingUp className="w-4 h-4" />,
                      onClick: () => openModal(record, setShowStockInModal),
                    },
                  ]
                : []),
              ...(canManageInv
                ? [
                    {
                      key: "2",
                      label: "Record Spoilage",
                      icon: <TrendingDown className="w-4 h-4" />,
                      onClick: () => openModal(record, setShowSpoilageModal),
                    },
                    {
                      key: "3",
                      label: "Correct Stock",
                      icon: <Edit2 className="w-4 h-4" />,
                      onClick: () => openModal(record, setShowCorrectionModal),
                    },
                  ]
                : []),
              ...(canTransfer
                ? [
                    {
                      key: "4",
                      label: "Transfer Stock",
                      icon: <ArrowLeftRight className="w-4 h-4" />,
                      onClick: () => openModal(record, setShowTransferModal),
                    },
                  ]
                : []),
              {
                key: "5",
                label: "Stock movements",
                icon: <History className="w-4 h-4" />,
                onClick: () => openModal(record, setShowHistoryModal),
              },
              // Who changed this record and when (audit trail; Admins only).
              ...(canViewAudit
                ? [
                    {
                      key: "6",
                      label: "Change history",
                      icon: <History className="w-4 h-4" />,
                      onClick: () => setAuditFor(record),
                    },
                  ]
                : []),
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
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    dispatch(
      getAllInventories({
        page: pagination.current,
        limit: pagination.pageSize,
        cinema_id: activeCinemaId,
      })
    );
  };

  const needsAttention = (stats?.low_stock_items || 0) + (stats?.out_of_stock_items || 0);
  const statItems = [
    {
      label: "Products stocked",
      value: stats?.total_items ?? 0,
      icon: Package,
      onClick: () => setFilters((f) => ({ ...f, low_stock: undefined })),
    },
    {
      label: "Units on hand",
      value: stats?.total_quantity ?? 0,
      icon: Boxes,
      tone: "info" as const,
    },
    {
      // The low_stock filter returns both low and empty items, so the count matches it.
      label: "Needs restock",
      value: needsAttention,
      hint: `${stats?.low_stock_items ?? 0} low · ${stats?.out_of_stock_items ?? 0} out · click to filter`,
      icon: AlertTriangle,
      tone: needsAttention ? ("warning" as const) : ("neutral" as const),
      onClick: () => setFilters((f) => ({ ...f, low_stock: f.low_stock ? undefined : true })),
      active: Boolean(filters.low_stock),
    },
    {
      label: "Out of stock",
      value: stats?.out_of_stock_items ?? 0,
      icon: PackageX,
      tone: stats?.out_of_stock_items ? ("danger" as const) : ("neutral" as const),
    },
  ];

  return (
    <div className="space-y-6">
      <StatCards items={statItems} loading={loading} />

      {needsAttention > 0 && !filters.low_stock && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex flex-wrap items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <p className="text-sm text-yellow-800 flex-1">
            {needsAttention} product{needsAttention === 1 ? "" : "s"} need restocking.
          </p>
          <Button
            size="xs"
            variant="outline"
            className="rounded-md"
            title="Show them"
            onClick={() => setFilters((f) => ({ ...f, low_stock: true }))}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <Input.Search
          allowClear
          placeholder="Search product"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-64!"
        />
        <Select
          allowClear
          placeholder="All categories"
          value={filters.product_category_id}
          onChange={(value) => setFilters((f) => ({ ...f, product_category_id: value }))}
          options={(productCats as any[])?.map((c: any) => ({ value: c.product_category_id, label: c.name }))}
          className="w-48"
        />
        <Select
          placeholder="Stock level"
          value={filters.low_stock ? "low" : "all"}
          onChange={(value) => setFilters((f) => ({ ...f, low_stock: value === "low" || undefined }))}
          options={[
            { value: "all", label: "All stock levels" },
            { value: "low", label: "Low or out of stock" },
          ]}
          className="w-48"
        />
        {isAdmin && (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="All cinemas"
            value={selectedCinemaId || undefined}
            onChange={(value) => setSelectedCinemaId(value || "")}
            options={allCinemas?.map((cinema: any) => ({ value: cinema.cinema_id, label: cinema.name }))}
            className="w-48"
          />
        )}
      </div>

      {loading && inventories.length === 0 ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={inventories || []}
          columns={columns}
          title={`Inventory (${total})`}
          showSearch={false}
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
        {/* Mounted only while open: each opening gets a fresh Idempotency-Key. */}
        {showStockInModal && (
          <StockInForm
            onCancel={() => setShowStockInModal(false)}
            inventoryId={selectedItem?.inventory_id}
            productName={selectedItem?.productName}
            cinema_id={selectedCinemaId || selectedItem?.cinema_id}
          />
        )}
      </DisplayModal>

      {/* Spoilage Modal */}
      <DisplayModal
        open={showSpoilageModal}
        title="Record Spoilage"
        onClose={() => setShowSpoilageModal(false)}
        width={600}
      >
        {/* Mounted only while open: each opening gets a fresh Idempotency-Key. */}
        {showSpoilageModal && (
          <SpoilageForm
            onCancel={() => setShowSpoilageModal(false)}
            inventoryId={selectedItem?.inventory_id}
            productName={selectedItem?.productName}
            currentStock={selectedItem?.quantity}
            cinema_id={selectedCinemaId || selectedItem?.cinema_id}
          />
        )}
      </DisplayModal>

      {/* Correction Modal */}
      <DisplayModal
        open={showCorrectionModal}
        title="Correct Inventory"
        onClose={() => setShowCorrectionModal(false)}
        width={600}
      >
        {/* Mounted only while open: each opening gets a fresh Idempotency-Key. */}
        {showCorrectionModal && (
          <CorrectionForm
            onCancel={() => setShowCorrectionModal(false)}
            inventoryId={selectedItem?.inventory_id}
            productName={selectedItem?.productName}
            currentStock={selectedItem?.quantity}         
             cinema_id={selectedCinemaId || selectedItem?.cinema_id}
          />
        )}
      </DisplayModal>

      {/* Transfer Modal */}
      <DisplayModal
        open={showTransferModal}
        title="Transfer Inventory"
        onClose={() => setShowTransferModal(false)}
        width={600}
      >
        {/* Mounted only while open: each opening gets a fresh Idempotency-Key. */}
        {showTransferModal && (
          <TransferForm
            onCancel={() => setShowTransferModal(false)}
            inventory={selectedItem}
          />
        )}
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
      <DisplayModal
        open={Boolean(auditFor)}
        title={`Change history: ${auditFor?.product?.name ?? ""}`}
        onClose={() => setAuditFor(null)}
        width={700}
      >
        {auditFor && <RecordHistory resourceId={auditFor.inventory_id} />}
      </DisplayModal>
    </div>
  );
};

export default InventoryManagement;
