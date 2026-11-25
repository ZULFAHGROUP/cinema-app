/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, Input, Menu, Select, Tag } from "antd";
import ReusableTable from "../../../components/shared/Table";
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX, Users } from "lucide-react";
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
  /** Reloads this tab's list on the server with the given search and filters. */
  onFetch: (filters: StaffFilters) => void;
}

export default function StaffList({ staff, role, staffTab, stats, canManage = true, onFetch }: StaffListProps) {
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const search = useDebouncedValue(searchText.trim());
  const filters: StaffFilters = { search: search || undefined, is_active: isActive };
  const onRefresh = () => onFetch(filters);

  useEffect(() => {
    onFetch({ search: search || undefined, is_active: isActive });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isActive]);

  const toggleActive = (value: boolean) => setIsActive((current) => (current === value ? undefined : value));
  const statItems = [
    {
      label: "Total",
      value: stats?.total_staff ?? 0,
      icon: Users,
      onClick: () => setIsActive(undefined),
    },
    {
      label: "Active",
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
  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "Active":
  //       return "green";
  //     case "On Leave":
  //       return "orange";
  //     case "Inactive":
  //       return "red";
  //     default:
  //       return "default";
  //   }
  // };

  const getMenu = (record: any) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<Edit className="w-4 h-4" />}
        onClick={() => {
          setShowEditModal(true);
          setSelectedStaff(record);
        }}
      >
        Edit Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="delete"
        danger
        icon={<Trash2 className="w-4 h-4" />}
        onClick={() => {
          setShowDeleteModal(true);
          setSelectedStaff(record);
        }}
      >
        Remove Staff
      </Menu.Item>
    </Menu>
  );

  const dispatch = useAppDispatch();

  const handleDelete = async () => {
    if (!selectedStaff) return;
    try {
      const response = await dispatch(
        deleteStaff(selectedStaff?.admin_id)
      ).unwrap();
      if (response.code === 200) {
        // toast.success(response.message);
        // await dispatch(getManagers({ limit, page })).unwrap(); // REMOVED hardcoded refresh
        // setShowDeleteModal(false);
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
      title: "Name",
      dataIndex: "surname",
      key: "surname",
      render: (_: any, record: any) =>
        `${record.surname} ${record.other_names}`,
      sorter: (a: any, b: any) => a.surname.localeCompare(b.surname),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      render: (roles: any[]) =>
        roles?.length
          ? roles.map((r) => formatUserLabel(r.role_name)).join(", ")
          : "Role not available",
      filters:
        role?.map((r: any) => ({
          text: r?.role_name,
          value: r?.role_name,
        })) || [],

      onFilter: (value: any, record: any) =>
        record.roles?.some((r: any) => r.role_name === value),
    },
    {
      title: "Cinema",
      dataIndex: "cinema",
      key: "cinema",
      render: (cinema: any) => cinema?.name || "All cinemas",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Deactivated"}</Tag>
      ),
    },
    //   {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status: string) => (
    //     <Tag color={getStatusColor(status)}>{status}</Tag>
    //   ),
    //   filters: [
    //     { text: "Active", value: "Active" },
    //     { text: "On Leave", value: "On Leave" },
    //     { text: "Inactive", value: "Inactive" },
    //   ],
    //   onFilter: (value: any, record: any) => record.status === value,
    // },
    ...(canManage
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
              <Dropdown overlay={getMenu(record)} trigger={["click"]}>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </Dropdown>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-4">
      <StatCards items={statItems} />
      <div className="flex flex-wrap gap-3">
        <Input.Search
          allowClear
          placeholder="Search name, email or phone"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="md:w-80!"
        />
        <Select
          value={isActive === undefined ? "all" : isActive ? "active" : "inactive"}
          onChange={(value) => setIsActive(value === "all" ? undefined : value === "active")}
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Deactivated" },
          ]}
          className="w-40"
        />
      </div>
      <ReusableTable
        data={staff}
        columns={columns}
        title={
          staffTab === "managers"
            ? "Managers List"
            : staffTab === "cashiers"
            ? "Cashiers List"
            : staffTab === "admins"
            ? "Admins List"
            : "General Staff List"
        }
        showSearch={false}
        showPagination={true}
        excludeColumns={["id"]}
      />
      <DisplayModal
        open={showEditModal}
        title={"Edit Staff"}
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

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this staff, ${selectedStaff?.surname}`}
      />
    </div>
  );
}
