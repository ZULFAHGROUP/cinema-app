/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag, Dropdown, Menu } from "antd";
import ReusableTable from "../../../components/shared/Table";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  UserCheck,
} from "lucide-react";

interface StaffListProps {
  staff: any[];
  onEdit: (staffId: number) => void;
  onDelete: (staffId: number) => void;
}

export default function StaffList({ staff, onEdit, onDelete }: StaffListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green";
      case "On Leave":
        return "orange";
      case "Inactive":
        return "red";
      default:
        return "default";
    }
  };

  const getMenu = (record: any) => (
    <Menu>
      <Menu.Item
        key="edit"
        icon={<Edit className="w-4 h-4" />}
        onClick={() => onEdit(record.id)}
      >
        Edit Profile
      </Menu.Item>
      <Menu.Item key="schedule" icon={<Calendar className="w-4 h-4" />}>
        View Schedule
      </Menu.Item>
      <Menu.Item key="permissions" icon={<UserCheck className="w-4 h-4" />}>
        Permissions
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="delete"
        danger
        icon={<Trash2 className="w-4 h-4" />}
        onClick={() => {
          if (
            window.confirm(`Are you sure you want to remove ${record.name}?`)
          ) {
            onDelete(record.id);
          }
        }}
      >
        Remove Staff
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
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
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Manager", value: "Manager" },
        { text: "Cashier", value: "Cashier" },
        { text: "Usher", value: "Usher" },
        { text: "Projectionist", value: "Projectionist" },
      ],
      onFilter: (value: any, record: any) => record.role === value,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
      filters: [
        { text: "Active", value: "Active" },
        { text: "On Leave", value: "On Leave" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: "Schedule",
      dataIndex: "schedule",
      key: "schedule",
      render: (schedule: string) => <Tag>{schedule}</Tag>,
    },
    {
      title: "Hire Date",
      dataIndex: "hireDate",
      key: "hireDate",
      sorter: (a: any, b: any) =>
        new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
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
    <ReusableTable
      data={staff}
      columns={columns}
      title="Staff Members"
      searchField={["name", "email", "role", "department"]}
      showSearch={true}
      showPagination={true}
      excludeColumns={["id"]}
    />
  );
}
