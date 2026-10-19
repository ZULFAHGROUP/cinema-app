/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Select, Switch, Tag } from "antd";
import { Clock, Edit, Monitor, Trash2 } from "lucide-react";
import Button from "../../../components/shared/Button";
import ConfirmationModal from "../../../components/shared/Modal/ConfirmationModal";
import { CONTENT_TYPES, describeDays, describeWindow } from "../constants";

interface ScheduleManagementProps {
  schedules: any[];
  contents: any[];
  displays: any[];
  settings: any;
  onEdit: (schedule: any) => void;
  onToggle: (schedule: any, isActive: boolean) => void;
  onDelete: (schedule: any) => Promise<void>;
  onUpdateSettings: (changes: { auto_schedule?: boolean; default_content_id?: string | null }) => void;
}

export default function ScheduleManagement({
  schedules,
  contents,
  displays,
  settings,
  onEdit,
  onToggle,
  onDelete,
  onUpdateSettings,
}: ScheduleManagementProps) {
  const [displayFilter, setDisplayFilter] = useState<string | undefined>();
  const [toDelete, setToDelete] = useState<any>(null);

  // A display's own schedules plus the cinema-wide ones, like the API's display filter.
  const visible = schedules.filter(
    (s) => !displayFilter || !s.display_id || s.display_id === displayFilter
  );
  const contentType = (contentId: string) =>
    contents.find((c) => c.content_id === contentId)?.type as keyof typeof CONTENT_TYPES | undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 border rounded-lg p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-sans font-semibold text-lg">Content schedule</h3>
            <p className="text-sm text-muted-foreground">
              Uses the server's local time. A display's own schedules beat cinema-wide ones.
            </p>
          </div>
          <Select
            allowClear
            placeholder="All displays"
            value={displayFilter}
            onChange={setDisplayFilter}
            options={displays.map((d) => ({ value: d.display_id, label: d.name }))}
            className="w-48"
          />
        </div>

        {visible.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No schedules yet. Displays fall back to the default content or auto-schedule.
          </p>
        ) : (
          <div className="space-y-3">
            {visible.map((schedule) => {
              const type = contentType(schedule.content_id);
              return (
                <div
                  key={schedule.schedule_id}
                  className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border ${
                    schedule.is_active ? "bg-white" : "bg-gray-50 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center gap-1 text-sm font-medium whitespace-nowrap">
                      <Clock className="w-4 h-4" />
                      {describeWindow(schedule.start_time, schedule.end_time)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {schedule.content?.name || "Deleted content"}
                        {type && (
                          <Tag className="ml-2" color={CONTENT_TYPES[type].color}>
                            {CONTENT_TYPES[type].label}
                          </Tag>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Monitor className="w-3 h-3" />
                        {schedule.display?.name || "Every display"} · {describeDays(schedule.days_of_week)} ·
                        priority {schedule.priority}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      size="small"
                      checked={schedule.is_active}
                      onChange={(checked) => onToggle(schedule, checked)}
                    />
                    <Button
                      variant="outline"
                      size="xs"
                      icon={<Edit className="w-4 h-4" />}
                      className="rounded-md"
                      onClick={() => onEdit(schedule)}
                    />
                    <Button
                      variant="outline"
                      size="xs"
                      icon={<Trash2 className="w-4 h-4" />}
                      className="rounded-md"
                      onClick={() => setToDelete(schedule)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* What plays when nothing is scheduled */}
      <div className="border rounded-lg p-6 space-y-5 h-fit">
        <div>
          <h3 className="font-sans font-semibold text-lg">When nothing is scheduled</h3>
          <p className="text-sm text-muted-foreground">Used in this order.</p>
        </div>
        <div>
          <p className="font-medium mb-1">1. Default content</p>
          <Select
            allowClear
            placeholder="None"
            value={settings?.default_content_id || undefined}
            onChange={(value) => onUpdateSettings({ default_content_id: value ?? null })}
            options={contents.map((c) => ({ value: c.content_id, label: c.name }))}
            className="w-full"
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">2. Auto-schedule</p>
            <p className="text-xs text-muted-foreground">
              Show a now-showing carousel built from today's showtimes.
            </p>
          </div>
          <Switch
            checked={Boolean(settings?.auto_schedule)}
            onChange={(checked) => onUpdateSettings({ auto_schedule: checked })}
          />
        </div>
        <p className="text-xs text-muted-foreground border-t pt-3">
          Otherwise the screen stays blank. Powered-off displays and an emergency override always come first.
        </p>
      </div>

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
        content={`Delete the ${describeWindow(toDelete?.start_time, toDelete?.end_time)} schedule for "${
          toDelete?.content?.name || "this content"
        }"?`}
      />
    </div>
  );
}
