/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag } from "antd";
import { Award, Crown } from "lucide-react";

interface LoyaltyTiersProps {
  tiers: any[];
  customers: any[];
}

export default function LoyaltyTiers({ tiers, customers }: LoyaltyTiersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tiers.map((tier, index) => (
        <div
          key={tier.name}
          className="border rounded-lg relative overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-sans text-lg font-semibold flex items-center gap-2">
                {index === 0 && <Award className="w-5 h-5 text-amber-500" />}
                {index === 1 && <Award className="w-5 h-5 text-gray-500" />}
                {index === 2 && <Crown className="w-5 h-5 text-yellow-500" />}
                {tier.name}
              </h3>
              <Tag
                color={
                  index === 0 ? "orange" : index === 1 ? "default" : "gold"
                }
              >
                {tier.name}
              </Tag>
            </div>
            <p className="text-sm text-muted-foreground font-serif mb-4">
              Minimum spend: ${tier.minSpent} • {tier.pointsMultiplier}x points
            </p>

            <div className="space-y-3">
              <div>
                <p className="font-serif text-sm text-muted-foreground mb-2">
                  Benefits
                </p>
                <ul className="space-y-1">
                  {tier.benefits.map(
                    (benefit: string, benefitIndex: number) => (
                      <li
                        key={benefitIndex}
                        className="font-serif text-sm flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {benefit}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="pt-2 border-t">
                <p className="font-serif text-sm text-muted-foreground">
                  {customers.filter((c) => c.tier === tier.name).length} members
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
