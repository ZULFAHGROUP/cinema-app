/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag } from "antd";

interface RewardsListProps {
  rewards: any[];
  onEdit: (rewardId: number) => void;
  onDelete: (rewardId: number) => void;
}

export default function RewardsList({
  rewards,
  onEdit,
  onDelete,
}: RewardsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="bg-white border border-[#c77e3b]/15 rounded-2xl shadow-2xs hover:shadow-md transition-all overflow-hidden"
        >
          <div className="p-4 space-y-3">
            <div className="aspect-square relative rounded-xl overflow-hidden bg-stone-100">
              <img
                src={reward.image || "/placeholder.svg"}
                alt={reward.name}
                className="w-full h-full object-cover"
              />
              <Tag
                className={`absolute top-2 right-2 ${
                  reward.availability === "Available"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {reward.availability}
              </Tag>
            </div>
            <div>
              <h3 className="font-bold text-stone-900">{reward.name}</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {reward.description}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[#c77e3b]">
                  {reward.pointsCost.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500">points</span>
              </div>
              <Tag>{reward.category}</Tag>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onEdit(reward.id)}
                className="flex-1 px-3 py-2 border border-stone-200 rounded-xl hover:bg-[#fff8ea] text-xs font-semibold text-stone-700 cursor-pointer"
              >
                Edit Reward
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete ${reward.name}?`
                    )
                  ) {
                    onDelete(reward.id);
                  }
                }}
                className="px-3 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
