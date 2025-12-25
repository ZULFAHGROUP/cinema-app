/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import { Users, Shield, Settings, Plus } from "lucide-react";
import StaffList from "./components/StaffList";
import RolesList from "./components/RolesList";
import AdminSettings from "./components/AdminSettings";
import AddStaffForm from "./components/AddStaffForm";
import AddRoleForm from "./components/AddRoleForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllRoles } from "../../store/slices/roles";
import { getAllStaff, deleteStaff } from "../../store/slices/staff";

function StaffPage() {
  const [activeTab, setActiveTab] = useState("staff");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const dispatch = useAppDispatch();
  const { roles, page: rolePage, limit: roleLimit } = useAppSelector(
    (state) => state.role
  );
  const { staff, page: staffPage, limit: staffLimit } = useAppSelector(
    (state) => state.staff
  );

  useEffect(() => {
    dispatch(getAllRoles({ page: rolePage, limit: roleLimit })).unwrap();
  }, [dispatch, rolePage, roleLimit]);

  useEffect(() => {
    dispatch(getAllStaff({ page: staffPage, limit: staffLimit })).unwrap();
  }, [dispatch, staffPage, staffLimit]);

  const handleAddStaff = () => {
    setIsAddStaffModalOpen(false);
    setSelectedStaff(null);
    // Refresh staff list
    dispatch(getAllStaff({ page: staffPage, limit: staffLimit }));
  };

  const handleAddRole = (roleData: any) => {
    const newRole = {
      id: roles.length + 1,
      ...roleData,
    };
    // setRoles([...roles, newRole]);
    setIsAddRoleModalOpen(false);
  };

  const handleEditStaff = (staffId: number) => {
    const staffToEdit = staff.find((s: any) => s.id === staffId);
    if (staffToEdit) {
      setSelectedStaff(staffToEdit);
      setIsAddStaffModalOpen(true);
    }
  };

  const handleDeleteStaff = async (staffId: number) => {
    try {
      await dispatch(deleteStaff(staffId.toString())).unwrap();
      // Refresh staff list
      dispatch(getAllStaff({ page: staffPage, limit: staffLimit }));
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  const handleEditRole = (roleId: number) => {
    console.log("Edit role:", roleId);
    // Implement edit functionality
  };

  const handleDeleteRole = (roleId: number) => {
    // setRoles(roles.filter((role) => role.id !== roleId));
  };

  const tabItems = [
    {
      key: "staff",
      label: (
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" /> Staff Members
        </span>
      ),
      children: (
        <StaffList
          staff={staff}
          onEdit={handleEditStaff}
          onDelete={handleDeleteStaff}
        />
      ),
    },
    {
      key: "roles",
      label: (
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4" /> Roles & Permissions
        </span>
      ),
      children: (
        <RolesList
          roles={roles}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
        />
      ),
    },
    {
      key: "settings",
      label: (
        <span className="flex items-center gap-2">
          <Settings className="w-4 h-4" /> Admin Settings
        </span>
      ),
      children: <AdminSettings />,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-sans font-bold text-foreground">
              Staff Management
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Manage staff accounts, roles, and permissions
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab === "roles" && (
              <Button
                onClick={() => setIsAddRoleModalOpen(true)}
                variant="outline"
                className="gap-2 rounded-md"
                icon={<Shield className="w-4 h-4" />}
                title="Add Role"
              />
            )}
            {activeTab === "staff" && (
              <Button
                onClick={() => setIsAddStaffModalOpen(true)}
                className="gap-2 rounded-md"
                icon={<Plus className="w-4 h-4" />}
                title="Add Staff"
              />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center flex-col md:flex-row justify-between mb-6">
          <div className="flex-1">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems.map((item) => ({
                key: item.key,
                label: item.label,
              }))}
              className="staff-tabs"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {tabItems.find((item) => item.key === activeTab)?.children}
        </div>
      </div>

      {/* Add Staff Modal */}
      <DisplayModal
        open={isAddStaffModalOpen}
        onClose={() => {
          setIsAddStaffModalOpen(false);
          setSelectedStaff(null);
        }}
        title={selectedStaff ? "Edit Staff Member" : "Add New Staff Member"}
      >
        <AddStaffForm
          roles={roles}
          staffData={selectedStaff}
          onSuccess={handleAddStaff}
          onCancel={() => {
            setIsAddStaffModalOpen(false);
            setSelectedStaff(null);
          }}
        />
      </DisplayModal>

      {/* Add Role Modal */}
      <DisplayModal
        open={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        title="Create New Role"
      >
        <AddRoleForm
          onSubmit={handleAddRole}
          onCancel={() => setIsAddRoleModalOpen(false)}
        />
      </DisplayModal>
    </div>
  );
}

export default StaffPage;
