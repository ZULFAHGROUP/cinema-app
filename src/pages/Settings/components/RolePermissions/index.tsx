import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ReusableTable from "../../../../components/shared/Table";
import RolePermissionsForm from "./components/RolePermissionsForm";
import { getAllRolePermissions } from "../../../../store/slices/rolePermissions";
import { getAllRoles } from "../../../../store/slices/roles";
import RolePermissionsService from "../../../../services/network/rolePermissions";
import Loader from "../../../../components/shared/Loader";
import { Tag } from "antd";
import { formatUserLabel } from "../../../../utils";
import { toast } from "react-toastify";
import { BUILT_IN_ROLES } from "../../../../constants";

const RolePermissions = () => {
  const [showFormModal, setShowFormModal] = useState(false);

  const dispatch = useAppDispatch();
  const { rolePermissions, rolePermissionLoading, page, limit } = useAppSelector(
    (state) => state.rolePermission
  );
  const { roles } = useAppSelector((state) => state.role);

  useEffect(() => {
    dispatch(getAllRolePermissions({ page, limit })).unwrap();
    dispatch(getAllRoles({ page: 1, limit: 50 }));
  }, [dispatch, page, limit]);

  const handleUnassign = async (roleName: string, permissionName: string) => {
    const role = (roles as any[])?.find((r) => r.role_name === roleName);
    if (!role?.role_id) {
      toast.error("Could not find role ID to unassign permission");
      return;
    }
    try {
      const res = await RolePermissionsService.unassignRolePermission({
        role_id: role.role_id,
        permission_name: permissionName,
      });
      toast.success(res.data?.message || "Permission unassigned");
      await dispatch(getAllRolePermissions({ page, limit }));
    } catch (error: any) {
      toast.error(error?.message || "Could not unassign permission");
    }
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "role_name",
      key: "role_name",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[], record: any) => {
        const isBuiltInAdmin = record.role_name === "Admin";
        return (
          <div className="flex flex-wrap gap-1">
            {permissions?.map((permission) => (
              <Tag
                key={permission}
                closable={!isBuiltInAdmin && !BUILT_IN_ROLES.includes(record.role_name)}
                onClose={(e) => {
                  e.preventDefault();
                  handleUnassign(record.role_name, permission);
                }}
              >
                {formatUserLabel(permission)}
              </Tag>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Role-Permissions Settings</h2>
        <Button
          className="rounded-md"
          icon={<Plus className="w-4 h-4" />}
          title="Assign Permission"
          onClick={() => {
            setShowFormModal(true);
          }}
        />
      </div>

      {rolePermissionLoading ? (
        <Loader rows={6} />
      ) : (
        <ReusableTable
          data={rolePermissions || []}
          columns={columns}
          title="Role-Permission Assignments"
          showPagination={true}
          searchField={["role_name"]}
        />
      )}

      {/* Add Modal */}
      <DisplayModal
        open={showFormModal}
        title="Assign Permission to Role"
        onClose={() => setShowFormModal(false)}
      >
        <RolePermissionsForm
          onCancel={() => setShowFormModal(false)}
        />
      </DisplayModal>
    </div>
  );
};

export default RolePermissions;
