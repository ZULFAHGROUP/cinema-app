/* eslint-disable @typescript-eslint/no-explicit-any */
import { Progress } from "antd";
import { Users, Star, Gift, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../utils";

interface LoyaltyAnalyticsProps {
  customers: any[];
  tiers: any[];
}

export default function LoyaltyAnalytics({
  customers,
  tiers,
}: LoyaltyAnalyticsProps) {
  const totalPoints = customers.reduce((total, c) => total + c.points, 0);
  const avgSpend =
    customers.length > 0
      ? customers.reduce((total, c) => total + c.totalSpent, 0) /
        customers.length
      : 0;

  const recentActivity = [
    {
      id: 1,
      message: "Alice Johnson earned 25 points",
      detail: "Movie ticket purchase • 2 hours ago",
      color: "bg-emerald-500",
    },
    {
      id: 2,
      message: "Bob Smith redeemed Free Popcorn",
      detail: "500 points redeemed • 4 hours ago",
      color: "bg-[#5480c7]",
    },
    {
      id: 3,
      message: "Carol Davis upgraded to Silver",
      detail: "Tier promotion • 1 day ago",
      color: "bg-[#c77e3b]",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#fff8ea] text-[#c77e3b]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Total Members
            </p>
            <p className="text-2xl font-extrabold text-stone-900">
              {customers.length.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Points Issued
            </p>
            <p className="text-2xl font-extrabold text-stone-900">
              {totalPoints.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#5480c7]/10 text-[#5480c7]">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Rewards Redeemed
            </p>
            <p className="text-2xl font-extrabold text-stone-900">147</p>
          </div>
        </div>

        <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-5 shadow-2xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Avg Spend
            </p>
            <p className="text-2xl font-extrabold text-stone-900">
              {formatCurrency(avgSpend)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 shadow-2xs">
          <h3 className="font-bold text-lg text-stone-900 mb-0.5">
            Tier Distribution
          </h3>
          <p className="text-xs text-stone-500 mb-4">Members by loyalty tier</p>
          <div className="space-y-4">
            {tiers.map((tier) => {
              const count = customers.filter(
                (c) => c.tier === tier.name
              ).length;
              const percentage =
                customers.length > 0 ? (count / customers.length) * 100 : 0;
              return (
                <div key={tier.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-stone-700">
                      {tier.name}
                    </span>
                    <span className="font-bold text-stone-900">
                      {count} members ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress
                    percent={Number(percentage.toFixed(0))}
                    strokeColor="#c77e3b"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 shadow-2xs">
          <h3 className="font-bold text-lg text-stone-900 mb-0.5">
            Recent Activity
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Latest loyalty program activity
          </p>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-[#fff8ea]/60 border border-[#c77e3b]/15 rounded-xl"
              >
                <div
                  className={`w-2.5 h-2.5 ${activity.color} rounded-full shrink-0`}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-stone-800">
                    {activity.message}
                  </p>
                  <p className="text-xs text-stone-500">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
