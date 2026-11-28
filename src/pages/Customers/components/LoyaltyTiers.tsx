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
          className="bg-white border border-[#e6dfd3] rounded-2xl shadow-[0_1px_2px_rgba(18,22,28,0.05)] relative overflow-hidden p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
              {index === 0 && <Award className="w-5 h-5 text-amber-600" />}
              {index === 1 && <Award className="w-5 h-5 text-stone-400" />}
              {index === 2 && <Crown className="w-5 h-5 text-amber-500" />}
              {tier.name}
            </h3>
            <Tag
              color={index === 0 ? "orange" : index === 1 ? "default" : "gold"}
            >
              {tier.name}
            </Tag>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Minimum spend: ₦{tier.minSpent} • {tier.pointsMultiplier}x points
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Member Benefits
              </p>
              <ul className="space-y-1.5">
                {tier.benefits.map((benefit: string, benefitIndex: number) => (
                  <li
                    key={benefitIndex}
                    className="text-xs text-stone-700 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-[#c77e3b] rounded-full shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-3 border-t border-stone-100">
              <p className="text-xs font-semibold text-stone-500">
                {customers.filter((c) => c.tier === tier.name).length} members
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
