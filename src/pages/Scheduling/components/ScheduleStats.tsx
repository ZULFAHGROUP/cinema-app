/* eslint-disable @typescript-eslint/no-explicit-any */
import { Users, Calendar, Clock } from "lucide-react";
import { Tag } from "antd";

interface ScheduleStatsProps {
  staff: any[];
  shifts: any[];
}

export default function ScheduleStats({ staff, shifts }: ScheduleStatsProps) {
  const totalHours = shifts.reduce((total, shift) => {
    const start = new Date(`2024-01-01 ${shift.startTime}`);
    const end = new Date(`2024-01-01 ${shift.endTime}`);
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0);

  const scheduledShifts = shifts.filter((s) => s.status === "Scheduled").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-serif text-sm text-muted-foreground">
              Staff Scheduled
            </p>
            <p className="font-sans text-2xl font-bold">{staff.length}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-accent/10">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="font-serif text-sm text-muted-foreground">
              Total Shifts
            </p>
            <p className="font-sans text-2xl font-bold">{shifts.length}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-secondary/10">
            <Clock className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="font-serif text-sm text-muted-foreground">
              Total Hours
            </p>
            <p className="font-sans text-2xl font-bold">{totalHours}h</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted">
            <Tag className="w-6 h-6 flex items-center justify-center p-0">
              {scheduledShifts}
            </Tag>
          </div>
          <div>
            <p className="font-serif text-sm text-muted-foreground">Coverage</p>
            <p className="font-sans text-2xl font-bold">100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
