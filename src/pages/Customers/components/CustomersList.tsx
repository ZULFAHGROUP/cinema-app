/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag, Dropdown, Menu, Progress, Modal, InputNumber } from "antd";
import { useState } from "react";
import ReusableTable from "../../../components/shared/Table";
import { MoreHorizontal, Eye, Plus, Mail, Edit, Trash2 } from "lucide-react";
import Button from "../../../components/shared/Button";

interface CustomersListProps {
  customers: any[];
  loyaltyTiers: any[];
  onEdit: (customerId: number) => void;
  onDelete: (customerId: number) => void;
  onAddPoints: (customerId: number, points: number) => void;
}

export default function CustomersList({
  customers,
  loyaltyTiers,
  onEdit,
  onDelete,
  onAddPoints,
}: CustomersListProps) {
  const [isAddPointsModalOpen, setIsAddPointsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [pointsToAdd, setPointsToAdd] = useState(0);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "gold";
      case "Silver":
        return "default";
      case "Bronze":
        return "orange";
      default:
        return "default";
    }
  };

  const getNextTier = (currentTier: string, totalSpent: number) => {
    const currentIndex = loyaltyTiers.findIndex((t) => t.name === currentTier);
    const nextTier = loyaltyTiers[currentIndex + 1];
    if (!nextTier) return null;

    const remaining = nextTier.minSpent - totalSpent;
    return { tier: nextTier.name, remaining: Math.max(0, remaining) };
  };

  const handleAddPointsClick = (customer: any) => {
    setSelectedCustomer(customer);
    setPointsToAdd(0);
    setIsAddPointsModalOpen(true);
  };

  const handleAddPointsSubmit = () => {
    if (selectedCustomer && pointsToAdd > 0) {
      onAddPoints(selectedCustomer.id, pointsToAdd);
      setIsAddPointsModalOpen(false);
      setSelectedCustomer(null);
      setPointsToAdd(0);
    }
  };

  const getMenu = (record: any) => (
    <Menu>
      <Menu.Item key="view" icon={<Eye className="w-4 h-4" />}>
        View Profile
      </Menu.Item>
      <Menu.Item
        key="addPoints"
        icon={<Plus className="w-4 h-4" />}
        onClick={() => handleAddPointsClick(record)}
      >
        Add Points
      </Menu.Item>
      <Menu.Item key="email" icon={<Mail className="w-4 h-4" />}>
        Send Email
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="edit"
        icon={<Edit className="w-4 h-4" />}
        onClick={() => onEdit(record.id)}
      >
        Edit Customer
      </Menu.Item>
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
        Remove Customer
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
      title: "Tier",
      dataIndex: "tier",
      key: "tier",
      render: (tier: string) => <Tag color={getTierColor(tier)}>{tier}</Tag>,
      filters: [
        { text: "Gold", value: "Gold" },
        { text: "Silver", value: "Silver" },
        { text: "Bronze", value: "Bronze" },
      ],
      onFilter: (value: any, record: any) => record.tier === value,
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      sorter: (a: any, b: any) => a.points - b.points,
      render: (points: number) => points.toLocaleString(),
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",
      sorter: (a: any, b: any) => a.totalSpent - b.totalSpent,
      render: (spent: number) => `$${spent.toFixed(2)}`,
    },
    {
      title: "Visits",
      dataIndex: "visits",
      key: "visits",
      sorter: (a: any, b: any) => a.visits - b.visits,
    },
    {
      title: "Last Visit",
      dataIndex: "lastVisit",
      key: "lastVisit",
      sorter: (a: any, b: any) =>
        new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime(),
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Progress",
      key: "progress",
      render: (_: any, record: any) => {
        const nextTier = getNextTier(record.tier, record.totalSpent);
        if (!nextTier) {
          return <span className="text-sm text-gray-500">Max Tier</span>;
        }
        const currentTierData = loyaltyTiers.find(
          (t) => t.name === record.tier
        );
        const progress =
          ((record.totalSpent - (currentTierData?.minSpent || 0)) /
            (nextTier.remaining +
              record.totalSpent -
              (currentTierData?.minSpent || 0))) *
          100;
        return (
          <div className="w-24">
            <Progress percent={Math.round(progress)} size="small" />
            <span className="text-xs text-gray-500">
              ${nextTier.remaining} to {nextTier.tier}
            </span>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "default"}>{status}</Tag>
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
    <>
      <ReusableTable
        data={customers}
        columns={columns}
        title="Loyalty Customers"
        searchField={["name", "email", "phone", "tier"]}
        showSearch={true}
        showPagination={true}
        excludeColumns={["id", "preferences", "joinDate"]}
        showPdfDownload={true}
      />

      <Modal
        title="Add Points"
        open={isAddPointsModalOpen}
        onCancel={() => setIsAddPointsModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            variant="outline"
            onClick={() => setIsAddPointsModalOpen(false)}
            title="Cancel"
            className="rounded-md"
          />,
          <Button
            key="submit"
            onClick={handleAddPointsSubmit}
            disabled={pointsToAdd <= 0}
            title="Add Points"
            className="rounded-md"
          />,
        ]}
      >
        <div className="space-y-4 py-4">
          <p className="font-serif">
            Add points to <strong>{selectedCustomer?.name}</strong>
          </p>
          <div>
            <label className="block font-medium mb-2">Points to Add</label>
            <InputNumber
              min={0}
              value={pointsToAdd}
              onChange={(value) => setPointsToAdd(value || 0)}
              className="w-full"
              placeholder="Enter points"
            />
          </div>
          <div className="text-sm text-gray-600">
            Current Points: {selectedCustomer?.points.toLocaleString()}
          </div>
        </div>
      </Modal>
    </>
  );
}
