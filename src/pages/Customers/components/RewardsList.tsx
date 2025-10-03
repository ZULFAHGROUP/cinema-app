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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {rewards.map((reward) => (
        <div
          key={reward.id}
          className="border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="space-y-3">
              <div className="aspect-square relative">
                <img
                  src={reward.image || "/placeholder.svg"}
                  alt={reward.name}
                  className="w-full h-full object-cover rounded"
                />
                <Tag
                  className={`absolute top-2 right-2 ${
                    reward.availability === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {reward.availability}
                </Tag>
              </div>
              <div>
                <h3 className="font-sans font-semibold">{reward.name}</h3>
                <p className="text-sm font-serif text-muted-foreground">
                  {reward.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-sans font-bold text-primary">
                    {reward.pointsCost.toLocaleString()}
                  </span>
                  <span className="font-serif text-sm text-muted-foreground">
                    points
                  </span>
                </div>
                <Tag>{reward.category}</Tag>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(reward.id)}
                  className="flex-1 px-3 py-2 border rounded-md hover:bg-gray-50 text-sm font-serif"
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
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 text-sm font-serif"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
