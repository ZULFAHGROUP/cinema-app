/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, Menu, Tag } from "antd";
import ReusableTable from "../../../components/shared/Table";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
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
  onRefresh?: () => void;
  staffTab: string
}

export default function StaffList({ staff, role,staffTab, onRefresh }: StaffListProps) {
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
        if (onRefresh) {
            onRefresh();
        }
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
  ];

  return (
    <>
      <ReusableTable
        data={staff}
        columns={columns}
        title={staffTab === 'managers'? "Managers List" : staffTab === "cashiers" ? "Cashiers List" : "General Staff List"}
        searchField={["surname", "other_names", "email", "phone"]}
        showSearch={true}
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
          onSuccess={() => setShowEditModal(false)}
        />
      </DisplayModal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        content={`Are you sure that you want to delete this staff, ${selectedStaff?.surname}`}
      />
    </>
  );
}
