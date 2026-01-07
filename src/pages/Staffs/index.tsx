/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import { Users, Settings, Plus } from "lucide-react";
import StaffList from "./components/StaffList";
import AdminSettings from "./components/AdminSettings";
import AddStaffForm from "./components/AddStaffForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllRoles } from "../../store/slices/roles";
import { getAllStaff } from "../../store/slices/staff";

function StaffPage() {
  const [activeTab, setActiveTab] = useState("staff");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const dispatch = useAppDispatch();
  const {
    roles,
    page: rolePage,
    limit: roleLimit,
  } = useAppSelector((state) => state.role);
  const {
    staff,
    page: staffPage,
    limit: staffLimit,
  } = useAppSelector((state) => state.staff);

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
                role={roles}
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
              Manage staff accounts
            </p>
          </div>
          <div className="flex gap-2">
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
    </div>
  );
}

export default StaffPage;
