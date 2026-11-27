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
    <div className="space-y-6 pb-8">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-6 shadow-2xs flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/25 flex items-center justify-center text-[#c77e3b] shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Customers</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Customer accounts and their orders. Customers sign up from the booking app.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 px-6 pt-2 shadow-2xs">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems.map((item) => ({ key: item.key, label: item.label }))}
        />
      </div>

      <div className="tab-content">
        {tabItems.find((item) => item.key === activeTab)?.children}
      </div>
    </div>
  );
}

export default CustomersPage;
