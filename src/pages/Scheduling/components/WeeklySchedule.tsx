/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tag, Popconfirm } from "antd";
import Button from "../../../components/shared/Button";
import { ChevronLeft, ChevronRight, Clock, Trash2 } from "lucide-react";

interface WeeklyScheduleProps {
  currentWeek: Date;
  shifts: any[];
  onNavigateWeek: (direction: "prev" | "next") => void;
  onGoToToday: () => void;
  onDeleteShift: (shiftId: number) => void;
}

export default function WeeklySchedule({
  currentWeek,
  shifts,
  onNavigateWeek,
  onGoToToday,
  onDeleteShift,
}: WeeklyScheduleProps) {
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getShiftsForDay = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return shifts.filter((shift) => shift.date === dateString);
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sans text-lg font-semibold">Weekly Schedule</h2>
          <p className="text-sm text-muted-foreground font-serif">
            Week of {weekDays[0].toLocaleDateString()} -{" "}
            {weekDays[6].toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onNavigateWeek("prev")}
            icon={<ChevronLeft className="w-4 h-4" />}
            className="rounded-md px-3 py-1"
          />
          <Button
            variant="outline"
            onClick={onGoToToday}
            title="Today"
            className="rounded-md px-3 py-1"
          />
          <Button
            variant="outline"
            onClick={() => onNavigateWeek("next")}
            icon={<ChevronRight className="w-4 h-4" />}
            className="rounded-md px-3 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayShifts = getShiftsForDay(day);
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div key={index} className="space-y-2">
              <div className="text-center">
                <p className="font-serif text-sm text-muted-foreground">
                  {dayNames[index]}
                </p>
                <p
                  className={`font-sans font-semibold ${
                    isToday ? "text-primary" : "text-foreground"
                  }`}
                >
                  {day.getDate()}
                </p>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {dayShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="border rounded-lg p-2 hover:shadow-sm transition-shadow cursor-pointer group relative"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-sans">
                          {shift.staffName
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <p className="font-serif text-xs font-medium truncate flex-1">
                          {shift.staffName}
                        </p>
                        <Popconfirm
                          title="Delete Shift"
                          description="Are you sure you want to delete this shift?"
                          onConfirm={() => onDeleteShift(shift.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded">
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </Popconfirm>
                      </div>
                      <p className="font-serif text-xs text-muted-foreground">
                        {shift.role}
                      </p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <p className="font-serif text-xs">
                          {shift.startTime} - {shift.endTime}
                        </p>
                      </div>
                      <Tag className="text-xs">{shift.department}</Tag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
