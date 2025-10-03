/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Button from "../../components/shared/Button";
import { Plus } from "lucide-react";
import WeeklySchedule from "./components/WeeklySchedule";
import StaffOverview from "./components/StaffOverview";
import ScheduleStats from "./components/ScheduleStats";
import AddShiftForm from "./components/AddShiftForm";
import DisplayModal from "../../components/shared/Modal/DisplayModal";

function SchedulingPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);

  const [staff] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Manager",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Cashier",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Usher",
      avatar: "/placeholder.svg",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Projectionist",
      avatar: "/placeholder.svg",
    },
  ]);

  const [shifts, setShifts] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: "Sarah Johnson",
      role: "Manager",
      date: "2024-01-15",
      startTime: "09:00",
      endTime: "17:00",
      department: "Operations",
      status: "Scheduled",
    },
    {
      id: 2,
      staffId: 2,
      staffName: "Mike Chen",
      role: "Cashier",
      date: "2024-01-15",
      startTime: "14:00",
      endTime: "22:00",
      department: "Box Office",
      status: "Scheduled",
    },
    {
      id: 3,
      staffId: 3,
      staffName: "Emily Rodriguez",
      role: "Usher",
      date: "2024-01-15",
      startTime: "18:00",
      endTime: "23:00",
      department: "Theater",
      status: "Scheduled",
    },
  ]);

  const handleAddShift = (shiftData: any) => {
    const staffMember = staff.find((s) => s.id === parseInt(shiftData.staffId));
    const newShift = {
      id: shifts.length + 1,
      staffId: parseInt(shiftData.staffId),
      staffName: staffMember?.name || "",
      role: staffMember?.role || "",
      date: shiftData.date,
      startTime: shiftData.startTime,
      endTime: shiftData.endTime,
      department: shiftData.department,
      status: "Scheduled",
    };
    setShifts([...shifts, newShift]);
    setIsAddShiftModalOpen(false);
  };

  const handleDeleteShift = (shiftId: number) => {
    setShifts(shifts.filter((shift) => shift.id !== shiftId));
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-sans font-bold text-foreground">
              Staff Scheduling
            </h1>
            <p className="text-sm text-muted-foreground font-serif">
              Manage work schedules and shifts
            </p>
          </div>
          <Button
            onClick={() => setIsAddShiftModalOpen(true)}
            className="gap-2 rounded-md"
            icon={<Plus className="w-4 h-4" />}
            title="Add Shift"
          />
        </div>

        {/* Weekly Schedule */}
        <div className="space-y-6">
          <WeeklySchedule
            currentWeek={currentWeek}
            shifts={shifts}
            onNavigateWeek={navigateWeek}
            onGoToToday={goToToday}
            onDeleteShift={handleDeleteShift}
          />

          {/* Staff Overview */}
          <StaffOverview staff={staff} shifts={shifts} />

          {/* Quick Stats */}
          <ScheduleStats staff={staff} shifts={shifts} />
        </div>
      </div>

      {/* Add Shift Modal */}
      <DisplayModal
        open={isAddShiftModalOpen}
        onClose={() => setIsAddShiftModalOpen(false)}
        title="Schedule New Shift"
      >
        <AddShiftForm
          staff={staff}
          onSubmit={handleAddShift}
          onCancel={() => setIsAddShiftModalOpen(false)}
        />
      </DisplayModal>
    </div>
  );
}

export default SchedulingPage;
