/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MoreVertical, Edit, Trash2, Plus, UserCog } from "lucide-react";
import { Dropdown } from "antd";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../../components/shared/Modal/ConfirmationModal";
import ReusableTable from "../../../../components/shared/Table";
import RolesForm from "./components/RolesForm";
import { deleteRole, getAllRoles } from "../../../../store/slices/roles";
import Loader from "../../../../components/shared/Loader";
import { BUILT_IN_ROLES } from "../../../../constants";

const Roles = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { roles, roleLoading, page, limit, total } = useAppSelector(
    (state) => state.role
  );

  useEffect(() => {
    dispatch(getAllRoles({ page, limit })).unwrap();
  }, [dispatch, page, limit]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const response = await dispatch(
        deleteRole(selectedItem?.role_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        await dispatch(getAllRoles({ page, limit })).unwrap();
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.message || "Error deleting role");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "role_name",
      key: "role_name",
      render: (roleName: string) => {
        const isBuiltIn = BUILT_IN_ROLES.includes(roleName);
        return (
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">{roleName}</span>
            {isBuiltIn && (
              <span className="px-2 py-0.5 rounded-full bg-[#fff8ea] border border-[#c77e3b]/30 text-[#754f2c] text-[10px] font-bold uppercase">
                System Role
              </span>
            )}
          </div>
        );
      },
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
      title: "",
      key: "actions",
      width: 60,
      render: (_: any, record: any) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit Role",
                icon: <Edit className="w-4 h-4" />,
                onClick: () => {
                  setSelectedItem(record);
                  setEditMode(true);
                  setShowFormModal(true);
                },
              },
              {
                key: "delete",
                label: "Delete Role",
                danger: true,
                disabled: BUILT_IN_ROLES.includes(record.role_name),
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
      getAllRoles({
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
            <UserCog className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              Staff Roles
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Define organizational roles and access tiers for your staff
              accounts
            </p>
          </div>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          title="Add Role"
          onClick={() => {
            setEditMode(false);
            setSelectedItem(null);
            setShowFormModal(true);
          }}
        />
      </div>

      {roleLoading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={roles || []}
          columns={columns}
          title={`Configured Roles (${total || roles?.length || 0})`}
          searchField={["role_name"]}
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
        title={editMode ? "Edit Role" : "Create Role"}
        onClose={() => setShowFormModal(false)}
      >
        <RolesForm
          onCancel={() => setShowFormModal(false)}
          editMode={editMode}
          roleData={selectedItem}
        />
      </DisplayModal>

      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this role: ${selectedItem?.role_name}?`}
      />
    </div>
  );
};

export default Roles;
