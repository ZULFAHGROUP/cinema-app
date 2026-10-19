/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Dropdown, Input, Select, Tag } from "antd";
import { Edit, MoreVertical, Siren, Star, Trash2 } from "lucide-react";
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
      (!term || [c.name, c.description].some((v) => v?.toLowerCase().includes(term)))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Input.Search
          allowClear
          placeholder="Search content"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72!"
        />
        <Select
          allowClear
          placeholder="All types"
          value={typeFilter}
          onChange={setTypeFilter}
          options={CONTENT_TYPE_OPTIONS}
          className="w-48"
        />
      </div>

      {contents.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <p className="font-medium">No content yet</p>
          <p className="text-sm text-muted-foreground">
            Start with a Movie Carousel or Menu Display: they fill themselves from your showtimes and products.
          </p>
        </div>
      ) : visible.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No content matches.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visible.map((content) => {
            const type = CONTENT_TYPES[content.type as keyof typeof CONTENT_TYPES];
            const Icon = type.icon;
            const isDefault = settings?.default_content_id === content.content_id;
            const isEmergency = settings?.emergency_content_id === content.content_id;
            return (
              <div
                key={content.content_id}
                className={`border rounded-lg overflow-hidden bg-white ${isEmergency ? "ring-2 ring-red-500" : ""}`}
              >
                <div className="aspect-video bg-gray-900 relative flex items-center justify-center text-white">
                  {content.media_url && content.media_kind === "video" ? (
                    <video src={content.media_url} className="w-full h-full object-cover" muted />
                  ) : content.media_url ? (
                    <img src={content.media_url} alt={content.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center px-4">
                      <Icon className="w-10 h-10 mx-auto mb-2 opacity-70" />
                      <p className="text-xs opacity-80 line-clamp-3">
                        {type.live ? "Built live from your data" : content.description || "Text only"}
                      </p>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {isDefault && <Tag color="gold">Default</Tag>}
                    {isEmergency && <Tag color="red">Emergency</Tag>}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-medium truncate">{content.name}</h4>
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: [
                          { key: "edit", label: "Edit", icon: <Edit className="w-4 h-4" />, onClick: () => onEdit(content) },
                          {
                            key: "default",
                            label: isDefault ? "Already the default" : "Use as default content",
                            icon: <Star className="w-4 h-4" />,
                            disabled: isDefault,
                            onClick: () => onSetDefault(content),
                          },
                          {
                            key: "emergency",
                            label: "Show on every display now",
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
                      <Button variant="outline" size="xs" className="rounded-md" icon={<MoreVertical className="w-4 h-4" />} />
                    </Dropdown>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Tag color={type.color}>{type.label}</Tag>
                    <span>{content.duration_seconds}s</span>
                  </div>
                  {content.description && content.media_url && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{content.description}</p>
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
        content={`Delete "${toDelete?.name}"? Schedules that use it stop playing it.`}
      />
    </div>
  );
}
