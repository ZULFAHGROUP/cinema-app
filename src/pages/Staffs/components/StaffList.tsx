/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, Input, Select, Tag } from "antd";
import ReusableTable from "../../../components/shared/Table";
import {
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Users,
  Building2,
} from "lucide-react";
import { useEffect, useState } from "react";
import StatCards from "../../../components/shared/StatCards";
import { StaffFilters } from "../../../services/network/staff";
import { StaffStats } from "../../../store/slices/staff";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import DisplayModal from "../../../components/shared/Modal/DisplayModal";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { useAppDispatch } from "../../../store/hook";
import { toast } from "react-toastify";
import { deleteStaff } from "../../../store/slices/staff";
import AddStaffForm from "./AddStaffForm";
import { formatUserLabel } from "../../../utils";

interface StaffListProps {
  staff: any[];
  role: any;
  staffTab: string;
  stats?: StaffStats | null;
  canManage?: boolean;
  onFetch: (filters: StaffFilters) => void;
}

export default function StaffList({
  staff,
  role,
  staffTab,
  stats,
  canManage = true,
  onFetch,
}: StaffListProps) {
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const search = useDebouncedValue(searchText.trim());
  const filters: StaffFilters = {
    search: search || undefined,
    is_active: isActive,
  };
  const onRefresh = () => onFetch(filters);

  useEffect(() => {
    onFetch({ search: search || undefined, is_active: isActive });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isActive]);

  const toggleActive = (value: boolean) =>
    setIsActive((current) => (current === value ? undefined : value));
  const statItems = [
    {
      label: "Total Staff",
      value: stats?.total_staff ?? 0,
      icon: Users,
      onClick: () => setIsActive(undefined),
    },
    {
      label: "Active Accounts",
      value: stats?.active_staff ?? 0,
      icon: UserCheck,
      tone: "good" as const,
      onClick: () => toggleActive(true),
      active: isActive === true,
    },
    {
      label: "Deactivated",
      value: stats?.inactive_staff ?? 0,
      icon: UserX,
      tone: stats?.inactive_staff ? ("danger" as const) : ("neutral" as const),
      onClick: () => toggleActive(false),
      active: isActive === false,
    },
  ];

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (!selectedStaff) return;
    try {
      const response = await dispatch(
        deleteStaff(selectedStaff?.admin_id)
      ).unwrap();
      if (response.code === 200) {
        toast.success(response.message);
        onRefresh();
        setShowDeleteModal(false);
      }
    } catch (error: any) {
      toast.error(error?.message || "Error deleting staff");
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      title: "Staff Member",
      dataIndex: "surname",
      key: "surname",
      render: (_: any, record: any) => {
        const initials = `${record.surname?.[0] || ""}${
          record.other_names?.[0] || ""
        }`.toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#161310] text-[#fff8ea] text-xs font-bold flex items-center justify-center shrink-0">
              {initials || "S"}
            </div>
            <div>
              <p className="font-semibold text-[#12161c]">
                {record.surname} {record.other_names}
              </p>
              <p className="text-xs text-[#686259]">{record.email}</p>
            </div>
          </div>
        );
      },
      sorter: (a: any, b: any) => a.surname.localeCompare(b.surname),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <span className="text-xs font-medium text-stone-700">
          {phone || "—"}
        </span>
      ),
    },
    {
      title: "Assigned Role",
      dataIndex: "roles",
      key: "roles",
      render: (roles: any[]) =>
        roles?.length ? (
          <div className="flex flex-wrap gap-1">
            {roles.map((r: any) => (
              <span
                key={r.role_id || r.role_name}
                className="px-2.5 py-0.5 rounded-full bg-[#fff8ea] border border-[#c77e3b]/25 text-[#754f2c] text-xs font-bold"
              >
                {formatUserLabel(r.role_name)}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-stone-400">Unassigned</span>
        ),
    },
    {
      title: "Cinema Branch",
      dataIndex: "cinema",
      key: "cinema",
      render: (cinema: any) =>
        cinema?.name ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700">
            <Building2 className="w-3.5 h-3.5 text-[#c77e3b]" />
            {cinema.name}
          </span>
        ) : (
          <span className="text-xs text-stone-400">All Cinemas</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Deactivated"}
        </Tag>
      ),
    },
    ...(canManage
      ? [
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
                      label: "Edit Profile",
                      icon: <Edit className="w-4 h-4" />,
                      onClick: () => {
                        setShowEditModal(true);
                        setSelectedStaff(record);
                      },
                    },
                    { type: "divider" as const },
                    {
                      key: "delete",
                      label: "Remove Staff",
                      danger: true,
                      icon: <Trash2 className="w-4 h-4" />,
                      onClick: () => {
                        setShowDeleteModal(true);
                        setSelectedStaff(record);
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
                  <MoreVertical className="w-4 h-4" />
                </button>
              </Dropdown>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-5">
      <StatCards items={statItems} />

      <div className="bg-white rounded-2xl border border-[#e6dfd3] p-4 shadow-[0_1px_2px_rgba(18,22,28,0.05)] flex flex-wrap gap-3 items-center">
        <Input.Search
          allowClear
          placeholder="Search name, email or phone..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-80!"
        />
        <Select
          value={
            isActive === undefined ? "all" : isActive ? "active" : "inactive"
          }
          onChange={(value) =>
            setIsActive(value === "all" ? undefined : value === "active")
          }
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Deactivated" },
          ]}
          className="w-44"
        />
      </div>

      <ReusableTable
        data={staff}
        columns={columns}
        title={
          staffTab === "managers"
            ? "Branch Managers"
            : staffTab === "cashiers"
            ? "POS Cashiers"
            : staffTab === "admins"
            ? "System Administrators"
            : "General Operations Staff"
        }
        showSearch={false}
        showPagination={true}
        excludeColumns={["id"]}
      />

      <DisplayModal
        open={showEditModal}
        title="Edit Staff Account"
        onClose={() => setShowEditModal(false)}
      >
        <AddStaffForm
          onCancel={() => setShowEditModal(false)}
          isEdit={true}
          staffData={selectedStaff}
          roles={role}
          onSuccess={() => {
            setShowEditModal(false);
            onRefresh();
          }}
        />
      </DisplayModal>

      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this staff account: ${selectedStaff?.surname} ${selectedStaff?.other_names}?`}
      />
    </div>
  );
}
