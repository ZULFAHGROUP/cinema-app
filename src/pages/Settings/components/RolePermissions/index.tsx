/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
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
  const { rolePermissions, rolePermissionLoading, page, limit } =
    useAppSelector((state) => state.rolePermission);
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
      title: "Role",
      dataIndex: "role_name",
      key: "role_name",
      width: 180,
      render: (roleName: string) => (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#fff8ea] border border-[#c77e3b]/30 text-[#754f2c] font-extrabold text-xs">
          {roleName}
        </span>
      ),
    },
    {
      title: "Assigned Capabilities",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[], record: any) => {
        const isBuiltInAdmin = record.role_name === "Admin";
        return (
          <div className="flex flex-wrap gap-1.5 py-1">
            {permissions?.map((permission) => (
              <Tag
                key={permission}
                className="m-0! px-2.5! py-0.5! rounded-lg! bg-stone-50! border-stone-200! text-stone-700! text-xs!"
                closable={
                  !isBuiltInAdmin && !BUILT_IN_ROLES.includes(record.role_name)
                }
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
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              Role-Permission Matrix
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              View and manage which system permissions are granted to each staff
              role
            </p>
          </div>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          title="Assign Permission"
          onClick={() => setShowFormModal(true)}
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

      <DisplayModal
        open={showFormModal}
        title="Assign Permission to Role"
        onClose={() => setShowFormModal(false)}
      >
        <RolePermissionsForm onCancel={() => setShowFormModal(false)} />
      </DisplayModal>
    </div>
  );
};

export default RolePermissions;
