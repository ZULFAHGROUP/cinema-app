/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import { Users, Shield, Settings, Plus } from "lucide-react";
import StaffList from "./components/StaffList";
import RolesList from "./components/RolesList";
import AdminSettings from "./components/AdminSettings";
import AddStaffForm from "./components/AddStaffForm";
import AddRoleForm from "./components/AddRoleForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";

function StaffPage() {
  const [activeTab, setActiveTab] = useState("staff");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@cinema.com",
      phone: "(555) 123-4567",
      role: "Manager",
      department: "Operations",
      status: "Active",
      hireDate: "2023-01-15",
      schedule: "Full-time",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@cinema.com",
      phone: "(555) 234-5678",
      role: "Cashier",
      department: "Box Office",
      status: "Active",
      hireDate: "2023-03-20",
      schedule: "Part-time",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@cinema.com",
      phone: "(555) 345-6789",
      role: "Usher",
      department: "Theater Operations",
      status: "Active",
      hireDate: "2023-06-10",
      schedule: "Part-time",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@cinema.com",
      phone: "(555) 456-7890",
      role: "Projectionist",
      department: "Technical",
      status: "On Leave",
      hireDate: "2022-11-05",
      schedule: "Full-time",
    },
  ]);

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Manager",
      description: "Full system access and staff management",
      permissions: ["all"],
      level: "Admin",
    },
    {
      id: 2,
      name: "Assistant Manager",
      description: "Limited admin access and staff supervision",
      permissions: ["staff", "reports", "tickets", "concessions", "movies"],
      level: "Supervisor",
    },
    {
      id: 3,
      name: "Cashier",
      description: "Ticket sales and customer service",
      permissions: ["tickets", "concessions", "customers"],
      level: "Staff",
    },
    {
      id: 4,
      name: "Usher",
      description: "Theater operations and customer assistance",
      permissions: ["theater", "customers"],
      level: "Staff",
    },
    {
      id: 5,
      name: "Projectionist",
      description: "Technical operations and movie management",
      permissions: ["technical", "movies", "theater"],
      level: "Technical",
    },
  ]);

  const handleAddStaff = (staffData: any) => {
    const newStaff = {
      id: staff.length + 1,
      ...staffData,
      status: "Active",
    };
    setStaff([...staff, newStaff]);
    setIsAddStaffModalOpen(false);
  };

  const handleAddRole = (roleData: any) => {
    const newRole = {
      id: roles.length + 1,
      ...roleData,
    };
    setRoles([...roles, newRole]);
    setIsAddRoleModalOpen(false);
  };

  const handleEditStaff = (staffId: number) => {
    console.log("Edit staff:", staffId);
    // Implement edit functionality
  };

  const handleDeleteStaff = (staffId: number) => {
    setStaff(staff.filter((member) => member.id !== staffId));
  };

  const handleEditRole = (roleId: number) => {
    console.log("Edit role:", roleId);
    // Implement edit functionality
  };

  const handleDeleteRole = (roleId: number) => {
    setRoles(roles.filter((role) => role.id !== roleId));
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
        onClose={() => setIsAddStaffModalOpen(false)}
        title="Add New Staff Member"
      >
        <AddStaffForm
          roles={roles}
          onSubmit={handleAddStaff}
          onCancel={() => setIsAddStaffModalOpen(false)}
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
