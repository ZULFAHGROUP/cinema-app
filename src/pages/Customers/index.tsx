import { useState } from "react";
import { Tabs } from "antd";
import { Users, Gift, Crown, TrendingUp } from "lucide-react";
import CustomersList from "./components/CustomersList";
import ComingSoon from "../../components/shared/ComingSoon";

const LOYALTY_NOTE =
  "Points, rewards and tiers need loyalty support in the API. Customer accounts and their orders are available now.";

function CustomersPage() {
  const [activeTab, setActiveTab] = useState("customers");

  const tabItems = [
    {
      key: "customers",
      label: (
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" /> Customers
        </span>
      ),
      children: <CustomersList />,
    },
    {
      key: "rewards",
      label: (
        <span className="flex items-center gap-2">
          <Gift className="w-4 h-4" /> Rewards
        </span>
      ),
      children: <ComingSoon title="Rewards" description={LOYALTY_NOTE} />,
    },
    {
      key: "tiers",
      label: (
        <span className="flex items-center gap-2">
          <Crown className="w-4 h-4" /> Loyalty Tiers
        </span>
      ),
      children: <ComingSoon title="Loyalty tiers" description={LOYALTY_NOTE} />,
    },
    {
      key: "analytics",
      label: (
        <span className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Analytics
        </span>
      ),
      children: <ComingSoon title="Loyalty analytics" description={LOYALTY_NOTE} />,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl font-sans font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground font-serif">
            Customer accounts and their orders. Customers sign up from the booking app.
          </p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map((item) => ({ key: item.key, label: item.label }))}
          className="mb-6"
        />

        <div className="tab-content">
          {tabItems.find((item) => item.key === activeTab)?.children}
        </div>
      </div>
    </div>
  );
}

export default CustomersPage;
