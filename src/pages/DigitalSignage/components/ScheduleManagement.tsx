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
  onUpdateSettings: (changes: {
    auto_schedule?: boolean;
    default_content_id?: string | null;
  }) => void;
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

  const visible = schedules.filter(
    (s) => !displayFilter || !s.display_id || s.display_id === displayFilter
  );
  const contentType = (contentId: string) =>
    contents.find((c) => c.content_id === contentId)?.type as
      | keyof typeof CONTENT_TYPES
      | undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white border border-[#c77e3b]/15 rounded-2xl p-6 space-y-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-extrabold text-lg text-stone-900">
              Playback Schedule Rules
            </h3>
            <p className="text-xs text-stone-500">
              Uses local server time. Display-specific schedules take precedence
              over cinema-wide rules.
            </p>
          </div>
          <Select
            allowClear
            placeholder="All displays"
            value={displayFilter}
            onChange={setDisplayFilter}
            options={displays.map((d) => ({
              value: d.display_id,
              label: d.name,
            }))}
            className="w-48"
          />
        </div>

        {visible.length === 0 ? (
          <p className="text-center text-stone-500 text-sm py-10">
            No schedules configured yet. Displays fall back to default content
            or auto-schedule.
          </p>
        ) : (
          <div className="space-y-3">
            {visible.map((schedule) => {
              const type = contentType(schedule.content_id);
              return (
                <div
                  key={schedule.schedule_id}
                  className={`flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                    schedule.is_active
                      ? "bg-[#fff8ea]/40 border-[#c77e3b]/20"
                      : "bg-stone-50 border-stone-200 opacity-65"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#c77e3b]/25 text-xs font-extrabold text-[#754f2c] whitespace-nowrap shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-[#c77e3b]" />
                      {describeWindow(schedule.start_time, schedule.end_time)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 truncate flex items-center gap-2">
                        <span>
                          {schedule.content?.name || "Deleted content"}
                        </span>
                        {type && (
                          <Tag color={CONTENT_TYPES[type].color}>
                            {CONTENT_TYPES[type].label}
                          </Tag>
                        )}
                      </p>
                      <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                        <Monitor className="w-3.5 h-3.5 text-[#c77e3b]" />
                        <span>
                          {schedule.display?.name || "Every display"} ·{" "}
                          {describeDays(schedule.days_of_week)} · Priority #
                          {schedule.priority}
                        </span>
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
                      icon={<Edit className="w-3.5 h-3.5" />}
                      onClick={() => onEdit(schedule)}
                    />
                    <Button
                      variant="outline"
                      size="xs"
                      className="text-red-600! border-red-200! hover:bg-red-50!"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      onClick={() => setToDelete(schedule)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fallback Priority Card */}
      <div className="bg-white border border-[#c77e3b]/15 rounded-2xl p-6 space-y-5 h-fit shadow-2xs">
        <div>
          <h3 className="font-extrabold text-lg text-stone-900">
            Fallback Playback Rules
          </h3>
          <p className="text-xs text-stone-500">
            When no time-window schedule matches, displays play in this order:
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-stone-700">
            1. Default Content
          </p>
          <Select
            allowClear
            placeholder="None selected"
            value={settings?.default_content_id || undefined}
            onChange={(value) =>
              onUpdateSettings({ default_content_id: value ?? null })
            }
            options={contents.map((c) => ({
              value: c.content_id,
              label: c.name,
            }))}
            className="w-full"
          />
        </div>

        <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-700">
              2. Auto-Schedule Carousel
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Automatically build a Now-Showing carousel from today's movie
              showtimes.
            </p>
          </div>
          <Switch
            checked={Boolean(settings?.auto_schedule)}
            onChange={(checked) => onUpdateSettings({ auto_schedule: checked })}
          />
        </div>

        <p className="text-[11px] text-stone-400 border-t border-stone-100 pt-3">
          Note: Powered-off displays and active Emergency Overrides always take
          top priority.
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
        content={`Delete the ${describeWindow(
          toDelete?.start_time,
          toDelete?.end_time
        )} schedule for "${toDelete?.content?.name || "this content"}"?`}
      />
    </div>
  );
}
