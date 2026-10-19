/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Checkbox, InputNumber, Switch } from "antd";
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

/** When content plays: a daily time window, optional days, one display or all of them. */
const AddScheduleForm = ({ schedule, contents, displays, onSubmit, onCancel }: AddScheduleFormProps) => {
  const [contentId, setContentId] = useState<string>(schedule?.content_id || "");
  const [displayId, setDisplayId] = useState<string>(schedule?.display_id || ALL_DISPLAYS);
  const [start, setStart] = useState(shortTime(schedule?.start_time) || "09:00");
  const [end, setEnd] = useState(shortTime(schedule?.end_time) || "18:00");
  const [days, setDays] = useState<number[]>(schedule?.days_of_week || []);
  const [priority, setPriority] = useState<number>(schedule?.priority ?? 5);
  const [isActive, setIsActive] = useState<boolean>(schedule?.is_active ?? true);
  const [saving, setSaving] = useState(false);

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
        // No days ticked (or all seven) means every day.
        days_of_week: days.length && days.length < 7 ? days : null,
        priority,
        is_active: isActive,
      });
    } catch {
      // The error toast comes from the API call.
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <ReusableSelect
        label="Content"
        value={contentId}
        onChange={(value) => setContentId(value as string)}
        options={contents.map((c) => ({
          value: c.content_id,
          label: `${c.name} (${CONTENT_TYPES[c.type as keyof typeof CONTENT_TYPES]?.label})`,
        }))}
        defaultOption="Choose content"
        required
      />
      <ReusableSelect
        label="Display"
        value={displayId}
        onChange={(value) => setDisplayId(value as string)}
        options={[
          { value: ALL_DISPLAYS, label: "Every display in this cinema" },
          ...displays.map((d) => ({ value: d.display_id, label: d.name })),
        ]}
      />

      <div>
        <label className="block font-medium md:text-lg mb-2">Time window</label>
        <div className="flex items-center gap-2">
          <input
            type="time"
            required
            value={start}
            onChange={(e) => e.target.value && setStart(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5"
          />
          <span>to</span>
          <input
            type="time"
            required
            value={end}
            onChange={(e) => e.target.value && setEnd(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {describeWindow(start, end)}. Same start and end plays all day; an end before the start runs
          past midnight.
        </p>
      </div>

      <div>
        <label className="block font-medium md:text-lg mb-2">Days</label>
        <Checkbox.Group
          value={days}
          onChange={(values) => setDays(values as number[])}
          options={DAYS.map((day, index) => ({ value: index, label: day }))}
        />
        <p className="text-xs text-muted-foreground mt-1">Leave all unticked for every day.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium md:text-lg mb-2">Priority</label>
          <InputNumber min={1} max={10} value={priority} onChange={(v) => setPriority(v || 1)} className="w-full" />
          <p className="text-xs text-muted-foreground mt-1">Higher wins when windows overlap.</p>
        </div>
        <div>
          <label className="block font-medium md:text-lg mb-2">Active</label>
          <Switch checked={isActive} onChange={setIsActive} />
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button
          className="flex-1 rounded-md"
          loading={saving}
          disabled={saving}
          title={schedule ? "Save schedule" : "Add schedule"}
          onClick={handleSubmit}
        />
        <Button variant="outline" className="rounded-md" title="Cancel" onClick={onCancel} />
      </div>
    </div>
  );
};

export default AddScheduleForm;
