/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";

interface StaffOverviewProps {
  staff: any[];
  shifts: any[];
}

export default function StaffOverview({ staff, shifts }: StaffOverviewProps) {
  const calculateStaffHours = (staffId: number) => {
    const memberShifts = shifts.filter((shift) => shift.staffId === staffId);
    return memberShifts.reduce((total, shift) => {
      const start = new Date(`2024-01-01 ${shift.startTime}`);
      const end = new Date(`2024-01-01 ${shift.endTime}`);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {staff.map((member) => {
        const memberShifts = shifts.filter(
          (shift) => shift.staffId === member.id
        );
        const totalHours = calculateStaffHours(member.id);

        return (
          <div key={member.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-sans font-semibold">
                {member.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </div>
              <div>
                <h3 className="font-sans text-base font-semibold">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground font-serif">
                  {member.role}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm text-muted-foreground">
                  This Week
                </span>
                <span className="font-sans font-medium">{totalHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm text-muted-foreground">
                  Shifts
                </span>
                <span className="font-sans font-medium">
                  {memberShifts.length}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full mt-3 rounded-md"
                title="View Schedule"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
