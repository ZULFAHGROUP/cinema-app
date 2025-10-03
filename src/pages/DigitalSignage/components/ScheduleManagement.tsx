/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from "antd";
import Button from "../../../components/shared/Button";
import ReusableSelect from "../../../components/shared/Select";
import { Clock, Edit, Trash2 } from "lucide-react";

interface ScheduleManagementProps {
  scheduleItems: any[];
  onDelete: (scheduleId: number) => void;
}

export default function ScheduleManagement({
  scheduleItems,
  onDelete,
}: ScheduleManagementProps) {
  const defaultContentOptions = [
    { value: "now-showing", label: "Now Showing Carousel" },
    { value: "welcome", label: "Welcome Message" },
    { value: "promo", label: "Promotional Content" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border rounded-lg p-6">
        <h3 className="font-sans font-semibold text-lg mb-2">Content Schedule</h3>
        <p className="text-sm text-muted-foreground font-serif mb-4">
          Automated content scheduling
        </p>
        <div className="space-y-4">
          {scheduleItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm font-serif">
                  <Clock className="w-4 h-4" />
                  {item.time}
                </div>
                <div>
                  <p className="font-serif font-medium">{item.content}</p>
                  <p className="font-serif text-sm text-muted-foreground">
                    {item.duration}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  icon={<Edit className="w-4 h-4" />}
                  className="rounded-md px-3"
                />
                <Button
                  variant="outline"
                  icon={<Trash2 className="w-4 h-4" />}
                  className="rounded-md px-3"
                  onClick={() => {
                    if (window.confirm("Delete this schedule item?")) {
                      onDelete(item.id);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="font-sans font-semibold text-lg mb-2">Schedule Settings</h3>
        <p className="text-sm text-muted-foreground font-serif mb-4">
          Configure automatic scheduling
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <label className="font-serif font-medium block">Auto-Schedule</label>
              <p className="font-serif text-sm text-muted-foreground">
                Automatically schedule content based on showtimes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <label className="font-serif font-medium block">Emergency Override</label>
              <p className="font-serif text-sm text-muted-foreground">
                Allow emergency content to override schedule
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="p-3 border rounded-lg">
            <ReusableSelect
              label="Default Content"
              name="defaultContent"
              value=""
              onChange={(value) => console.log(value)}
              options={defaultContentOptions}
              defaultOption="Select default content"
            />
          </div>
        </div>
      </div>
    </div>
  );
}