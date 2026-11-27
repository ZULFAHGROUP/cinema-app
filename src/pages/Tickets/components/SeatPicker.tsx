/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2 } from "lucide-react";

interface SeatPickerProps {
  seats: any[];
  loading?: boolean;
  selectedSeatIds: string[];
  onChange: (seatIds: string[]) => void;
}

const seatClass = (status: string, selected: boolean) => {
  if (selected)
    return "bg-[#c77e3b] text-white border border-[#c77e3b] shadow-sm ring-2 ring-[#c77e3b]/25 scale-105";
  if (status === "available")
    return "bg-white border border-[#c77e3b]/50 text-[#754f2c] hover:bg-[#fff8ea] hover:border-[#c77e3b] cursor-pointer";
  return "bg-stone-200 text-stone-400 border border-stone-200 cursor-not-allowed"; // held or sold
};

/** Seats come from the API in layout order; this groups them into rows. */
export default function SeatPicker({
  seats,
  loading,
  selectedSeatIds,
  onChange,
}: SeatPickerProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-6 h-6 animate-spin text-[#c77e3b]" />
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
      <div className="overflow-x-auto border border-[#c77e3b]/20 rounded-2xl p-4 bg-[#fff8ea]/40">
        {/* Realistic Cinema Screen Arc */}
        <div className="mb-5 text-center">
          <div className="h-1.5 w-3/4 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#c77e3b] to-transparent shadow-[0_4px_12px_rgba(199,126,59,0.45)]" />
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#754f2c] mt-1.5">
            SCREEN
          </p>
        </div>

        <div className="space-y-1.5 w-max mx-auto">
          {[...rows].map(([rowLabel, rowSeats]) => (
            <div key={rowLabel} className="flex items-center gap-1.5">
              <span className="w-6 text-xs font-bold text-[#754f2c] text-right pr-1">
                {rowLabel}
              </span>
              {rowSeats.map((seat) => {
                const selected = selectedSeatIds.includes(seat.seat_id);
                return (
                  <button
                    key={seat.seat_id}
                    type="button"
                    title={`${seat.label} · ${seat.seat_type}${
                      seat.status !== "available" ? ` (${seat.status})` : ""
                    }`}
                    disabled={seat.status !== "available"}
                    onClick={() => toggle(seat)}
                    className={`w-7 h-7 rounded-t-lg text-[10px] font-bold transition-all ${seatClass(
                      seat.status,
                      selected
                    )}`}
                  >
                    {seat.seat_number}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-stone-600 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-t border border-[#c77e3b]/60 bg-white inline-block" />{" "}
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-t bg-[#c77e3b] inline-block" />{" "}
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-t bg-stone-200 inline-block" />{" "}
          Held / Sold
        </span>
      </div>
    </div>
  );
}
