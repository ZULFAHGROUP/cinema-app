/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MoreHorizontal, Edit, Trash2, Plus } from "lucide-react";
import { Dropdown, Menu } from "antd";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import VATConfigForm from "./components/VATConfigForm";
import { deleteVatConfig, getAllVatConfigs } from "../../../../store/slices/vatConfig";
import Loader from "../../../../components/shared/Loader";
import { formatUserLabel } from "../../../../utils";

const VATConfig = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { vatConfigs, vatLoading, page, limit, total } = useAppSelector(
    (state) => state.vatConfig
  );

  useEffect(() => {
    dispatch(getAllVatConfigs({ page, limit })).unwrap();
  }, [dispatch, page, limit]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteVatConfig(selectedItem?.vat_config_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllVatConfigs({ page, limit })).unwrap();
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting VAT config");
      setShowDeleteModal(false);
    }
  };

  const getMenu = (record: any) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<Edit className="w-4 h-4" />}
        onClick={() => {
          setSelectedItem(record);
          setEditMode(true);
          setShowFormModal(true);
        }}
      >
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        danger
        icon={<Trash2 className="w-4 h-4" />}
        onClick={() => {
          setSelectedItem(record);
          setShowDeleteModal(true);
        }}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (val: string) => formatUserLabel(val),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (rate: number) => `${rate}`,
    },
    {
        title: "Global",
        dataIndex: "is_global",
        key: "is_global",
        render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
        title: "Active",
        dataIndex: "is_active",
        key: "is_active",
        render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Effective From",
      dataIndex: "effective_from",
      key: "effective_from",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown overlay={getMenu(record)} trigger={["click"]}>
          <button className="p-2 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    dispatch(
      getAllVatConfigs({
        page: pagination.current,
        limit: pagination.pageSize,
      })
    ).unwrap();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">VAT Settings</h2>
        <Button
          className="rounded-md"
          icon={<Plus className="w-4 h-4" />}
          title="Add New"
          onClick={() => {
            setEditMode(false);
            setSelectedItem(null);
            setShowFormModal(true);
          }}
        />
      </div>

      {vatLoading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={vatConfigs || []}
          columns={columns}
          title="VAT Configurations"
          showPagination={true}
          searchField={["name"]}
          paginationMode="backend"
          paginationProps={{
            total,
            current: page,
            pageSize: limit,
          }}
          onTableChange={handleTableChange}
        />
      )}

      {/* Add / Edit Modal */}
      <DisplayModal
        open={showFormModal}
        title={editMode ? "Edit VAT Config" : "Add VAT Config"}
        onClose={() => setShowFormModal(false)}
      >
        <VATConfigForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          vatData={selectedItem}
        />
      </DisplayModal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this VAT config: ${selectedItem?.name}`}
      />
    </div>
  );
};

export default VATConfig;
