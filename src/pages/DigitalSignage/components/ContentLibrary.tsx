/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Dropdown, Input, Select, Tag } from "antd";
import { Edit, MoreVertical, Siren, Star, Trash2, Layers } from "lucide-react";
import Button from "../../../components/shared/Button";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { CONTENT_TYPES, CONTENT_TYPE_OPTIONS } from "../constants";

interface ContentLibraryProps {
  contents: any[];
  settings: any;
  onEdit: (content: any) => void;
  onDelete: (content: any) => Promise<void>;
  onSetDefault: (content: any) => void;
  onEmergency: (content: any) => void;
}

export default function ContentLibrary({
  contents,
  settings,
  onEdit,
  onDelete,
  onSetDefault,
  onEmergency,
}: ContentLibraryProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [toDelete, setToDelete] = useState<any>(null);

  const term = search.trim().toLowerCase();
  const visible = contents.filter(
    (c) =>
      (!typeFilter || c.type === typeFilter) &&
      (!term ||
        [c.name, c.description].some((v) => v?.toLowerCase().includes(term)))
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-4 shadow-2xs flex flex-wrap gap-3 items-center">
        <Input.Search
          allowClear
          placeholder="Search content library..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72!"
        />
        <Select
          allowClear
          placeholder="All content types"
          value={typeFilter}
          onChange={setTypeFilter}
          options={CONTENT_TYPE_OPTIONS}
          className="w-48"
        />
      </div>

      {contents.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-[#c77e3b]/30 rounded-2xl">
          <Layers className="w-10 h-10 text-[#c77e3b] mx-auto mb-2" />
          <p className="font-extrabold text-stone-800">
            No signage content in library yet
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            Start with a <strong>Movie Carousel</strong> or{" "}
            <strong>Menu Display</strong> — they auto-populate from your active
            showtimes and concession products.
          </p>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-center text-stone-500 py-8">
          No content matches your filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {visible.map((content) => {
            const type =
              CONTENT_TYPES[content.type as keyof typeof CONTENT_TYPES];
            const Icon = type.icon;
            const isDefault =
              settings?.default_content_id === content.content_id;
            const isEmergency =
              settings?.emergency_content_id === content.content_id;
            return (
              <div
                key={content.content_id}
                className={`bg-white border border-[#c77e3b]/15 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all group ${
                  isEmergency ? "ring-2 ring-red-500" : ""
                }`}
              >
                <div className="aspect-video bg-stone-900 relative flex items-center justify-center text-white overflow-hidden">
                  {content.media_url && content.media_kind === "video" ? (
                    <video
                      src={content.media_url}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : content.media_url ? (
                    <img
                      src={content.media_url}
                      alt={content.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-center px-4">
                      <Icon className="w-9 h-9 mx-auto mb-2 text-[#c77e3b]" />
                      <p className="text-xs text-stone-300 line-clamp-3">
                        {type.live
                          ? "Generated live from cinema data"
                          : content.description || "Text announcement"}
                      </p>
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    {isDefault && <Tag color="gold">Default</Tag>}
                    {isEmergency && <Tag color="red">Emergency</Tag>}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-stone-900 truncate">
                      {content.name}
                    </h4>
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: [
                          {
                            key: "edit",
                            label: "Edit Content",
                            icon: <Edit className="w-4 h-4" />,
                            onClick: () => onEdit(content),
                          },
                          {
                            key: "default",
                            label: isDefault
                              ? "Already Default"
                              : "Set as Default Content",
                            icon: <Star className="w-4 h-4" />,
                            disabled: isDefault,
                            onClick: () => onSetDefault(content),
                          },
                          {
                            key: "emergency",
                            label: "Broadcast on All Displays Now",
                            icon: <Siren className="w-4 h-4" />,
                            disabled: isEmergency,
                            onClick: () => onEmergency(content),
                          },
                          { type: "divider" },
                          {
                            key: "delete",
                            label: "Delete",
                            danger: true,
                            icon: <Trash2 className="w-4 h-4" />,
                            onClick: () => setToDelete(content),
                          },
                        ],
                      }}
                    >
                      <Button
                        variant="outline"
                        size="xs"
                        icon={<MoreVertical className="w-3.5 h-3.5" />}
                      />
                    </Dropdown>
                  </div>
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <Tag color={type.color}>{type.label}</Tag>
                    <span className="font-semibold text-[#754f2c]">
                      {content.duration_seconds}s slide
                    </span>
                  </div>
                  {content.description && content.media_url && (
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                      {content.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmationModal
        open={Boolean(toDelete)}
        onCancel={() => setToDelete(null)}
        onConfirm={async () => {
          try {
            await onDelete(toDelete);
          } finally {
            setToDelete(null);
          }
        }}
        content={`Delete "${toDelete?.name}"? Active schedules using it will stop playing it.`}
      />
    </div>
  );
}
