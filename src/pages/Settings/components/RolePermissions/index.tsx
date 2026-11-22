import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import Button from "../../../../components/shared/Button";
import DisplayModal from "../../../../components/shared/Modal/DisplayModal";
import ReusableTable from "../../../../components/shared/Table";
import RolePermissionsForm from "./components/RolePermissionsForm";
import { getAllRolePermissions } from "../../../../store/slices/rolePermissions";
import Loader from "../../../../components/shared/Loader";
import { Tag } from "antd";
import { formatUserLabel } from "../../../../utils";

const RolePermissions = () => {
  const [showFormModal, setShowFormModal] = useState(false);

  const dispatch = useAppDispatch();
  const { rolePermissions, rolePermissionLoading, page, limit } = useAppSelector(
    (state) => state.rolePermission
  );
  useEffect(() => {
    dispatch(getAllRolePermissions({ page, limit })).unwrap();
  }, [dispatch, page, limit]);

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
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions?.map((permission) => (
            <Tag key={permission}>{formatUserLabel(permission)}</Tag>
          ))}
        </div>
      ),
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
