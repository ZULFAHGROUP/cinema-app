/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { InputNumber, Switch } from "antd";
import { Clock, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { ScheduleInput } from "../../../services/network/signage";
import { CONTENT_TYPES, DAYS, describeWindow, shortTime } from "../constants";

interface AddScheduleFormProps {
  schedule?: any;
  contents: any[];
  displays: any[];
  onSubmit: (values: ScheduleInput) => Promise<void>;
  onCancel: () => void;
}

const ALL_DISPLAYS = "all";

const AddScheduleForm = ({
  schedule,
  contents,
  displays,
  onSubmit,
  onCancel,
}: AddScheduleFormProps) => {
  const [contentId, setContentId] = useState<string>(
    schedule?.content_id || ""
  );
  const [displayId, setDisplayId] = useState<string>(
    schedule?.display_id || ALL_DISPLAYS
  );
  const [start, setStart] = useState(
    shortTime(schedule?.start_time) || "09:00"
  );
  const [end, setEnd] = useState(shortTime(schedule?.end_time) || "18:00");
  const [days, setDays] = useState<number[]>(schedule?.days_of_week || []);
  const [priority, setPriority] = useState<number>(schedule?.priority ?? 5);
  const [isActive, setIsActive] = useState<boolean>(
    schedule?.is_active ?? true
  );
  const [saving, setSaving] = useState(false);

  const toggleDay = (dayIndex: number) => {
    setDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort()
    );
  };

  const handleSubmit = async () => {
    if (!contentId) {
      toast.error("Choose the content to play");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        content_id: contentId,
        display_id: displayId === ALL_DISPLAYS ? null : displayId,
        start_time: start,
        end_time: end,
        days_of_week: days.length && days.length < 7 ? days : null,
        priority,
        is_active: isActive,
      });
    } catch {
      // Handled upstream
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReusableSelect
          label="Signage Content"
          value={contentId}
          onChange={(value) => setContentId(value as string)}
          options={contents.map((c) => ({
            value: c.content_id,
            label: `${c.name} (${
              CONTENT_TYPES[c.type as keyof typeof CONTENT_TYPES]?.label
            })`,
          }))}
          defaultOption="Choose content"
          required
        />
        <ReusableSelect
          label="Target Display"
          value={displayId}
          onChange={(value) => setDisplayId(value as string)}
          options={[
            { value: ALL_DISPLAYS, label: "Every display in this cinema" },
            ...displays.map((d) => ({ value: d.display_id, label: d.name })),
          ]}
        />
      </div>

      {/* Time Window Card */}
      <div className="rounded-2xl bg-stone-50/80 border border-stone-200/80 p-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-[#c77e3b]" />
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Playback Time Window
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="time"
            required
            value={start}
            onChange={(e) => e.target.value && setStart(e.target.value)}
            className="flex-1 bg-white border border-stone-200 hover:border-[#c77e3b] focus:border-[#c77e3b] outline-none rounded-xl px-3.5 py-2 text-sm font-medium text-stone-800"
          />
          <span className="text-xs font-semibold text-stone-400 uppercase">
            to
          </span>
          <input
            type="time"
            required
            value={end}
            onChange={(e) => e.target.value && setEnd(e.target.value)}
            className="flex-1 bg-white border border-stone-200 hover:border-[#c77e3b] focus:border-[#c77e3b] outline-none rounded-xl px-3.5 py-2 text-sm font-medium text-stone-800"
          />
        </div>
        <p className="text-[11px] text-stone-500">
          <strong className="text-[#754f2c]">
            {describeWindow(start, end)}
          </strong>
          . Same start and end plays all day; an end before the start runs past
          midnight.
        </p>
      </div>

      {/* Days of Week Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Calendar size={14} className="text-[#c77e3b]" /> Active Days
          </label>
          <span className="text-[11px] text-stone-400">
            {days.length === 0 || days.length === 7
              ? "Playing every day"
              : `${days.length} day(s) selected`}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((day, index) => {
            const active = days.includes(index);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  active
                    ? "bg-[#c77e3b] border-[#c77e3b] text-white shadow-xs"
                    : "bg-white border-stone-200 text-stone-600 hover:border-[#c77e3b]/40"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-stone-400 mt-1.5">
          Leave all unticked to play every day of the week.
        </p>
      </div>

      {/* Priority & Active Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
            Priority (1 - 10)
          </label>
          <InputNumber
            min={1}
            max={10}
            value={priority}
            onChange={(v) => setPriority(v || 1)}
            className="w-full! rounded-xl! py-1!"
          />
          <p className="text-[11px] text-stone-400 mt-1">
            Higher priority wins when schedules overlap.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200/80 bg-stone-50/60 p-3.5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Schedule Status
            </p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {isActive ? "Active & broadcasting" : "Paused"}
            </p>
          </div>
          <Switch checked={isActive} onChange={setIsActive} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-stone-200/80">
        <Button
          variant="outline"
          title="Cancel"
          onClick={onCancel}
          disabled={saving}
        />
        <Button
          className="min-w-[150px]"
          loading={saving}
          disabled={saving}
          title={schedule ? "Save Schedule" : "Add Schedule"}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddScheduleForm;
