/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2 } from "lucide-react";

interface SeatPickerProps {
  seats: any[];
  loading?: boolean;
  selectedSeatIds: string[];
  onChange: (seatIds: string[]) => void;
}

const seatClass = (status: string, selected: boolean) => {
  if (selected) return "bg-black text-white";
  if (status === "available") return "bg-white border border-[#c77e3b] hover:bg-[#fff8ea]";
  return "bg-gray-200 text-gray-400 cursor-not-allowed"; // held or sold
};

/** Seats come from the API in layout order; this groups them into rows. */
export default function SeatPicker({ seats, loading, selectedSeatIds, onChange }: SeatPickerProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const rows = new Map<string, any[]>();
  for (const seat of seats) {
    rows.set(seat.row_label, [...(rows.get(seat.row_label) || []), seat]);
  }

  const toggle = (seat: any) => {
    if (seat.status !== "available") return;
    onChange(
      selectedSeatIds.includes(seat.seat_id)
        ? selectedSeatIds.filter((id) => id !== seat.seat_id)
        : [...selectedSeatIds, seat.seat_id]
    );
  };

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border rounded-lg p-3 bg-muted/20">
        <div className="text-center text-[10px] tracking-widest text-muted-foreground border-b mb-3 pb-1">
          SCREEN
        </div>
        <div className="space-y-1 w-max mx-auto">
          {[...rows].map(([rowLabel, rowSeats]) => (
            <div key={rowLabel} className="flex items-center gap-1">
              <span className="w-6 text-xs font-medium text-right pr-1">{rowLabel}</span>
              {rowSeats.map((seat) => {
                const selected = selectedSeatIds.includes(seat.seat_id);
                return (
                  <button
                    key={seat.seat_id}
                    type="button"
                    title={`${seat.label} · ${seat.seat_type}${seat.status !== "available" ? ` (${seat.status})` : ""}`}
                    disabled={seat.status !== "available"}
                    onClick={() => toggle(seat)}
                    className={`w-6 h-6 rounded-t text-[9px] ${seatClass(seat.status, selected)}`}
                  >
                    {seat.seat_number}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border border-[#c77e3b] bg-white inline-block" /> Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-black inline-block" /> Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-200 inline-block" /> Held / sold
        </span>
      </div>
    </div>
  );
}
