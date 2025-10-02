/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag, Dropdown, Menu } from "antd";
import ReusableTable from "../../../components/shared/Table";
import { MoreHorizontal, Edit, Trash2, Shield } from "lucide-react";

interface RolesListProps {
  roles: any[];
  onEdit: (roleId: number) => void;
  onDelete: (roleId: number) => void;
}

export default function RolesList({ roles, onEdit, onDelete }: RolesListProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Admin":
        return "red";
      case "Supervisor":
        return "blue";
      case "Technical":
        return "purple";
      case "Staff":
        return "green";
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
        Edit Role
      </Menu.Item>
      <Menu.Item key="permissions" icon={<Shield className="w-4 h-4" />}>
        Manage Permissions
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="delete"
        danger
        icon={<Trash2 className="w-4 h-4" />}
        onClick={() => {
          if (
            window.confirm(
              `Are you sure you want to delete the ${record.name} role?`
            )
          ) {
            onDelete(record.id);
          }
        }}
      >
        Delete Role
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Access Level",
      dataIndex: "level",
      key: "level",
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>{level}</Tag>
      ),
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Supervisor", value: "Supervisor" },
        { text: "Technical", value: "Technical" },
        { text: "Staff", value: "Staff" },
      ],
      onFilter: (value: any, record: any) => record.level === value,
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions.slice(0, 3).map((permission) => (
            <Tag key={permission} className="text-xs">
              {permission}
            </Tag>
          ))}
          {permissions.length > 3 && (
            <Tag className="text-xs">+{permissions.length - 3} more</Tag>
          )}
        </div>
      ),
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
      data={roles}
      columns={columns}
      title="Roles & Permissions"
      searchField={["name", "description", "level"]}
      showSearch={true}
      showPagination={true}
      excludeColumns={["id"]}
    />
  );
}
