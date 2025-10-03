/* eslint-disable @typescript-eslint/no-explicit-any */
import { Progress } from "antd";
import { Users, Star, Gift, TrendingUp } from "lucide-react";

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
    customers.reduce((total, c) => total + c.totalSpent, 0) / customers.length;

  const recentActivity = [
    {
      id: 1,
      message: "Alice Johnson earned 25 points",
      detail: "Movie ticket purchase • 2 hours ago",
      color: "bg-green-500",
    },
    {
      id: 2,
      message: "Bob Smith redeemed Free Popcorn",
      detail: "500 points redeemed • 4 hours ago",
      color: "bg-blue-500",
    },
    {
      id: 3,
      message: "Carol Davis upgraded to Silver",
      detail: "Tier promotion • 1 day ago",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-serif text-sm text-muted-foreground">
                Total Members
              </p>
              <p className="font-sans text-2xl font-bold">
                {customers.length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/10">
              <Star className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-serif text-sm text-muted-foreground">
                Points Issued
              </p>
              <p className="font-sans text-2xl font-bold">
                {totalPoints.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-secondary/10">
              <Gift className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="font-serif text-sm text-muted-foreground">
                Rewards Redeemed
              </p>
              <p className="font-sans text-2xl font-bold">147</p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted">
              <TrendingUp className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-serif text-sm text-muted-foreground">
                Avg Spend
              </p>
              <p className="font-sans text-2xl font-bold">
                ${avgSpend.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Distribution and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="font-sans font-semibold text-lg mb-2">
            Tier Distribution
          </h3>
          <p className="text-sm text-muted-foreground font-serif mb-4">
            Members by loyalty tier
          </p>
          <div className="space-y-4">
            {tiers.map((tier) => {
              const count = customers.filter(
                (c) => c.tier === tier.name
              ).length;
              const percentage = (count / customers.length) * 100;
              return (
                <div key={tier.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif">{tier.name}</span>
                    <span className="font-sans text-sm">
                      {count} members ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress percent={percentage} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h3 className="font-sans font-semibold text-lg mb-2">
            Recent Activity
          </h3>
          <p className="text-sm text-muted-foreground font-serif mb-4">
            Latest loyalty program activity
          </p>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                <div className={`w-2 h-2 ${activity.color} rounded-full`} />
                <div className="flex-1">
                  <p className="font-serif font-medium">{activity.message}</p>
                  <p className="text-sm font-serif text-muted-foreground">
                    {activity.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
