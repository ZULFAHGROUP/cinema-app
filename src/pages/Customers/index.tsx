/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Tabs } from "antd";
import Button from "../../components/shared/Button";
import { Users, Gift, Crown, TrendingUp, Plus } from "lucide-react";
import CustomersList from "./components/CustomersList";
import RewardsList from "./components/RewardsList";
import LoyaltyTiers from "./components/LoyaltyTiers";
import LoyaltyAnalytics from "./components/LoyaltyAnalytics";
import AddCustomerForm from "./components/AddCustomerForm";
import AddRewardForm from "./components/AddRewardForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";

function CustomersPage() {
  const [activeTab, setActiveTab] = useState("customers");
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddRewardModalOpen, setIsAddRewardModalOpen] = useState(false);

  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      phone: "(555) 123-4567",
      joinDate: "2023-01-15",
      tier: "Gold",
      points: 2450,
      totalSpent: 485.99,
      visits: 24,
      lastVisit: "2024-01-10",
      preferences: ["Action", "Comedy"],
      status: "Active",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@email.com",
      phone: "(555) 234-5678",
      joinDate: "2023-03-20",
      tier: "Silver",
      points: 1250,
      totalSpent: 298.5,
      visits: 15,
      lastVisit: "2024-01-08",
      preferences: ["Drama", "Thriller"],
      status: "Active",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@email.com",
      phone: "(555) 345-6789",
      joinDate: "2023-06-10",
      tier: "Bronze",
      points: 680,
      totalSpent: 156.75,
      visits: 8,
      lastVisit: "2024-01-05",
      preferences: ["Romance", "Comedy"],
      status: "Active",
    },
  ]);

  const [rewards, setRewards] = useState([
    {
      id: 1,
      name: "Free Movie Ticket",
      description: "Redeem for any regular movie ticket",
      pointsCost: 1000,
      category: "Tickets",
      availability: "Available",
      image: "/movie-ticket-reward.png",
    },
    {
      id: 2,
      name: "Large Popcorn",
      description: "Free large popcorn with any purchase",
      pointsCost: 500,
      category: "Concessions",
      availability: "Available",
      image: "/popcorn-reward.png",
    },
    {
      id: 3,
      name: "VIP Experience",
      description: "Premium seating + concessions for 2",
      pointsCost: 2500,
      category: "Experiences",
      availability: "Limited",
      image: "/vip-experience-reward.png",
    },
    {
      id: 4,
      name: "$10 Concession Credit",
      description: "Credit towards any concession purchase",
      pointsCost: 750,
      category: "Credits",
      availability: "Available",
      image: "/concession-credit-reward.png",
    },
  ]);

  const loyaltyTiers = [
    {
      name: "Bronze",
      minSpent: 0,
      pointsMultiplier: 1,
      benefits: ["1 point per $1 spent", "Birthday discount"],
      color: "bg-amber-100 text-amber-800",
    },
    {
      name: "Silver",
      minSpent: 200,
      pointsMultiplier: 1.25,
      benefits: [
        "1.25 points per $1 spent",
        "Priority booking",
        "Member-only screenings",
      ],
      color: "bg-gray-100 text-gray-800",
    },
    {
      name: "Gold",
      minSpent: 500,
      pointsMultiplier: 1.5,
      benefits: [
        "1.5 points per $1 spent",
        "Free upgrades",
        "Exclusive events",
        "Concession discounts",
      ],
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  const handleAddCustomer = (customerData: any) => {
    const newCustomer = {
      id: customers.length + 1,
      ...customerData,
      tier: "Bronze",
      points: 0,
      totalSpent: 0,
      visits: 0,
      lastVisit: new Date().toISOString().split("T")[0],
      status: "Active",
    };
    setCustomers([...customers, newCustomer]);
    setIsAddCustomerModalOpen(false);
  };

  const handleAddReward = (rewardData: any) => {
    const newReward = {
      id: rewards.length + 1,
      ...rewardData,
      image: "/placeholder.svg",
      availability: "Available",
    };
    setRewards([...rewards, newReward]);
    setIsAddRewardModalOpen(false);
  };

  const handleEditCustomer = (customerId: number) => {
    console.log("Edit customer:", customerId);
    // Implement edit functionality
  };

  const handleDeleteCustomer = (customerId: number) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
  };

  const handleAddPoints = (customerId: number, points: number) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId
          ? { ...customer, points: customer.points + points }
          : customer
      )
    );
  };

  const handleEditReward = (rewardId: number) => {
    console.log("Edit reward:", rewardId);
    // Implement edit functionality
  };

  const handleDeleteReward = (rewardId: number) => {
    setRewards(rewards.filter((reward) => reward.id !== rewardId));
  };

  const tabItems = [
    {
      key: "customers",
      label: (
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" /> Customers
        </span>
      ),
      children: (
        <CustomersList
          customers={customers}
          loyaltyTiers={loyaltyTiers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
          onAddPoints={handleAddPoints}
        />
      ),
    },
    {
      key: "rewards",
      label: (
        <span className="flex items-center gap-2">
          <Gift className="w-4 h-4" /> Rewards
        </span>
      ),
      children: (
        <RewardsList
          rewards={rewards}
          onEdit={handleEditReward}
          onDelete={handleDeleteReward}
        />
      ),
    },
    {
      key: "tiers",
      label: (
        <span className="flex items-center gap-2">
          <Crown className="w-4 h-4" /> Loyalty Tiers
        </span>
      ),
      children: <LoyaltyTiers tiers={loyaltyTiers} customers={customers} />,
    },
    {
      key: "analytics",
      label: (
        <span className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Analytics
        </span>
      ),
      children: <LoyaltyAnalytics customers={customers} tiers={loyaltyTiers} />,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-sans font-bold text-foreground">
              Customer Loyalty
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Manage customers, points, and rewards
            </p>
          </div>
          <div className="flex gap-2">
            {activeTab === "rewards" && (
              <Button
                onClick={() => setIsAddRewardModalOpen(true)}
                variant="outline"
                className="gap-2 rounded-md"
                icon={<Gift className="w-4 h-4" />}
                title="Add Reward"
              />
            )}
            {activeTab === "customers" && (
              <Button
                onClick={() => setIsAddCustomerModalOpen(true)}
                className="gap-2 rounded-md"
                icon={<Plus className="w-4 h-4" />}
                title="Add Customer"
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
              className="loyalty-tabs"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {tabItems.find((item) => item.key === activeTab)?.children}
        </div>
      </div>

      {/* Add Customer Modal */}
      <DisplayModal
        open={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        title="Add New Customer"
      >
        <AddCustomerForm
          onSubmit={handleAddCustomer}
          onCancel={() => setIsAddCustomerModalOpen(false)}
        />
      </DisplayModal>

      {/* Add Reward Modal */}
      <DisplayModal
        open={isAddRewardModalOpen}
        onClose={() => setIsAddRewardModalOpen(false)}
        title="Create New Reward"
      >
        <AddRewardForm
          onSubmit={handleAddReward}
          onCancel={() => setIsAddRewardModalOpen(false)}
        />
      </DisplayModal>
    </div>
  );
}

export default CustomersPage;
