/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import { Users, Plus, ShieldCheck, BadgeDollarSign, Building2 } from "lucide-react";
import StaffList from "./components/StaffList";
import AddStaffForm from "./components/AddStaffForm";
import CinemaStaffAssignment from "./components/CinemaStaffAssignment";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllRoles } from "../../store/slices/roles";
import { 
  getManagers, 
  getPosCashiers, 
  getGeneralStaff 
} from "../../store/slices/staff";

function StaffPage() {
  const [activeTab, setActiveTab] = useState("managers");
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const dispatch = useAppDispatch();
  const {
    roles,
    page: rolePage,
    limit: roleLimit,
  } = useAppSelector((state) => state.role);
  
  const {
    managers,
    cashiers,
    generalStaff,
  } = useAppSelector((state) => state.staff);

  useEffect(() => {
    dispatch(getAllRoles({ page: rolePage, limit: roleLimit })).unwrap();
  }, [dispatch, rolePage, roleLimit]);

  useEffect(() => {
    dispatch(getManagers({ page: 1, limit: 100 }));
    dispatch(getPosCashiers({ page: 1, limit: 100 }));
    dispatch(getGeneralStaff({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleAddedStaff = () => {
    setIsAddStaffModalOpen(false);
    setSelectedStaff(null);
    
  };

  const tabItems = [
    {
      key: "managers",
      label: (
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Managers
        </span>
      ),
      children: (
        <StaffList
          staff={managers}
          role={roles}
          staffTab="managers"
          onRefresh={() => dispatch(getManagers({ page: 1, limit: 100 }))}
        />
      ),
    },
    {
      key: "cashiers",
      label: (
        <span className="flex items-center gap-2">
          <BadgeDollarSign className="w-4 h-4" /> POS / Cashiers
        </span>
      ),
      children: (
        <StaffList
          staff={cashiers}
          role={roles}
          staffTab="cashiers"
          onRefresh={() => dispatch(getPosCashiers({ page: 1, limit: 100 }))}
        />
      ),
    },
    {
      key: "staff",
      label: (
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" /> General Staff
        </span>
      ),
      children: (
        <StaffList
          staff={generalStaff}
          role={roles}
          staffTab="staff"
          onRefresh={() => dispatch(getGeneralStaff({ page: 1, limit: 100 }))}
        />
      ),
    },
    {
      key: "cinema-staff",
      label: (
        <span className="flex items-center gap-2">
          <Building2 className="w-4 h-4" /> Cinema Staff
        </span>
      ),
      children: <CinemaStaffAssignment />,
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
              Manage staff accounts and assignments
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab !== "cinema-staff" && (
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
          onSuccess={handleAddedStaff}
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
