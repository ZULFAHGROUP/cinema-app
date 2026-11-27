/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import { Users, Plus, ShieldCheck, BadgeDollarSign, Building2, Crown } from "lucide-react";
import StaffList from "./components/StaffList";
import AddStaffForm from "./components/AddStaffForm";
import CinemaStaffAssignment from "./components/CinemaStaffAssignment";
import DisplayModal from "../../components/shared/Modal/DisplayModal";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getAllRoles } from "../../store/slices/roles";
import { 
  getAdmins,
  getManagers, 
  getPosCashiers, 
  getGeneralStaff 
} from "../../store/slices/staff";
import { hasPermission } from "../../utils/permissions";

function StaffPage() {
  const { user } = useAppSelector((state) => state.accounts.data);
  const canManageUsers = hasPermission(user, "manage_users");
  const canAssignRoles = hasPermission(user, "assign_roles");
  const canViewAdmins = hasPermission(user, "view_admin_users");
  const canViewManagers = hasPermission(user, "view_manager_users");
  const canViewCashiers = hasPermission(user, "view_pos_cashier_users");
  const canViewStaff = hasPermission(user, "view_staff_users");
  const canViewCinemaStaff = hasPermission(user, "view_cinema_users");

  const defaultTab = canViewManagers
    ? "managers"
    : canViewCashiers
    ? "cashiers"
    : canViewStaff
    ? "staff"
    : canViewAdmins
    ? "admins"
    : "cinema-staff";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const dispatch = useAppDispatch();
  const {
    roles,
    page: rolePage,
    limit: roleLimit,
  } = useAppSelector((state) => state.role);
  
  const {
    admins,
    managers,
    cashiers,
    generalStaff,
    adminsStats,
    managersStats,
    cashiersStats,
    staffStats,
  } = useAppSelector((state) => state.staff);

  useEffect(() => {
    if (canAssignRoles) {
      dispatch(getAllRoles({ page: rolePage, limit: roleLimit })).unwrap();
    }
  }, [dispatch, rolePage, roleLimit, canAssignRoles]);

  const handleAddedStaff = () => {
    setIsAddStaffModalOpen(false);
    setSelectedStaff(null);
  };

  const tabItems = [
    ...(canViewManagers
      ? [
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
                stats={managersStats}
                canManage={canManageUsers}
                onFetch={(filters) => dispatch(getManagers({ page: 1, limit: 50, filters }))}
              />
            ),
          },
        ]
      : []),
    ...(canViewCashiers
      ? [
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
                stats={cashiersStats}
                canManage={canManageUsers}
                onFetch={(filters) => dispatch(getPosCashiers({ page: 1, limit: 50, filters }))}
              />
            ),
          },
        ]
      : []),
    ...(canViewStaff
      ? [
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
                stats={staffStats}
                canManage={canManageUsers}
                onFetch={(filters) => dispatch(getGeneralStaff({ page: 1, limit: 50, filters }))}
              />
            ),
          },
        ]
      : []),
    ...(canViewAdmins
      ? [
          {
            key: "admins",
            label: (
              <span className="flex items-center gap-2">
                <Crown className="w-4 h-4" /> Admins
              </span>
            ),
            children: (
              <StaffList
                staff={admins}
                role={roles}
                staffTab="admins"
                stats={adminsStats}
                canManage={canManageUsers}
                onFetch={(filters) => dispatch(getAdmins({ page: 1, limit: 50, filters }))}
              />
            ),
          },
        ]
      : []),
    ...(canViewCinemaStaff
      ? [
          {
            key: "cinema-staff",
            label: (
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Cinema Staff
              </span>
            ),
            children: <CinemaStaffAssignment />,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              Staff Management
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              Manage staff accounts, roles, and cinema branch assignments
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {canManageUsers && activeTab !== "cinema-staff" && (
            <Button
              onClick={() => setIsAddStaffModalOpen(true)}
              icon={<Plus className="w-4 h-4" />}
              title="Add Staff"
            />
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 px-6 pt-2 shadow-2xs">
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

      {/* Tab Content */}
      <div className="tab-content">
        {tabItems.find((item) => item.key === activeTab)?.children}
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
