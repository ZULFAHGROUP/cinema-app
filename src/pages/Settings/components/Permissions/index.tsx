/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MoreVertical, Edit, Trash2, Plus, KeyRound } from "lucide-react";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import PermissionsForm from "./components/PermissionsForm";
import {
  deletePermission,
  getAllPermissions,
} from "../../../../store/slices/permissions";
import Loader from "../../../../components/shared/Loader";
import { formatUserLabel } from "../../../../utils";

const Permissions = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { permissions, permissionLoading, page, limit, total } = useAppSelector(
    (state) => state.permission
  );

  useEffect(() => {
    dispatch(getAllPermissions({ page, limit })).unwrap();
  }, [dispatch, page, limit]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deletePermission(selectedItem?.permission_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllPermissions({ page, limit })).unwrap();
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.response?.message || "Error deleting permission");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Capability Label",
      dataIndex: "permission_name",
      key: "permission_name",
      render: (_: any, record: any) => (
        <div>
          <p className="font-bold text-stone-900">
            {formatUserLabel(record.permission_name)}
          </p>
          <code className="text-[11px] text-stone-400 font-mono">
            {record.permission_name}
          </code>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (desc: string) => (
        <span className="text-xs text-stone-600">{desc || "—"}</span>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (
        <span className="text-xs text-stone-500">
          {date ? new Date(date).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 60,
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit Permission",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setEditMode(true);
                  setShowFormModal(true);
                },
              },
              {
                key: "delete",
                label: "Delete Permission",
                danger: true,
                icon: <Trash2 className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setShowDeleteModal(true);
                },
              },
            ],
          }}
          trigger={["click"]}
        >
          <button
            type="button"
            className="w-8 h-8 rounded-lg hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>
        </Dropdown>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    dispatch(
      getAllPermissions({
        page: pagination.current,
        limit: pagination.pageSize,
      })
    ).unwrap();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              System Permissions
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Granular security capabilities that can be assigned to staff roles
            </p>
          </div>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          title="Add Permission"
          onClick={() => {
            setEditMode(false);
            setSelectedItem(null);
            setShowFormModal(true);
          }}
        />
      </div>

      {permissionLoading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={permissions || []}
          columns={columns}
          title={`Permissions (${total || permissions?.length || 0})`}
          showPagination={true}
          searchField={["permission_name"]}
          paginationMode="backend"
          paginationProps={{
            total,
            current: page,
            pageSize: limit,
          }}
          onTableChange={handleTableChange}
        />
      )}

      <DisplayModal
        open={showFormModal}
        title={editMode ? "Edit Permission" : "Add Permission"}
        onClose={() => setShowFormModal(false)}
      >
        <PermissionsForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          permissionData={selectedItem}
        />
      </DisplayModal>

      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this permission: ${selectedItem?.permission_name}?`}
      />
    </div>
  );
};

export default Permissions;
