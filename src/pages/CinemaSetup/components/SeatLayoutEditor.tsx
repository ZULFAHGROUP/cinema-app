/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Plus, Trash2, Armchair, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../../components/shared/Button";
import Input from "../../../components/shared/Input";
import Loader from "../../../components/shared/Loader";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { getScreenSeats, saveScreenSeats } from "../../../store/slices/seat";
import { getAllScreen } from "../../../store/slices/screen";
import { SeatLayoutRow } from "../../../services/network/seat";

interface SeatLayoutEditorProps {
  screen: any;
  onCancel: () => void;
}

/** Rebuilds the editable rows from the saved seats (inactive seats are "disabled"). */
const rowsFromSeats = (seats: any[]): SeatLayoutRow[] => {
  const rows = new Map<string, SeatLayoutRow>();
  for (const seat of seats) {
    const row: SeatLayoutRow = rows.get(seat.row_label) || {
      row: seat.row_label,
      seats: 0,
      seat_type: seat.seat_type,
      disabled: [] as number[],
    };
    row.seats = Math.max(row.seats, seat.seat_number);
    if (!seat.is_active) row.disabled!.push(seat.seat_number);
    rows.set(seat.row_label, row);
  }
  return [...rows.values()];
};

/** The next row label after the last one: A, B, ... Z, AA, AB ... */
const nextRowLabel = (rows: SeatLayoutRow[]) => {
  const last = rows[rows.length - 1]?.row;
  if (!last) return "A";
  const chars = last.split("");
  let i = chars.length - 1;
  while (i >= 0 && chars[i] === "Z") {
    chars[i] = "A";
    i--;
  }
  if (i < 0) return "A" + chars.join("");
  chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
  return chars.join("");
};

const SEAT_TYPE_PRESETS = ["Standard", "VIP", "Recliner", "Couple"];

const SeatLayoutEditor = ({ screen, onCancel }: SeatLayoutEditorProps) => {
  const dispatch = useAppDispatch();
  const { screenSeats, screenSeatsLoading } = useAppSelector(
    (state) => state.seat
  );
  const [rows, setRows] = useState<SeatLayoutRow[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getScreenSeats(screen.screen_id));
  }, [dispatch, screen.screen_id]);

  useEffect(() => {
    setRows(rowsFromSeats(screenSeats));
  }, [screenSeats]);

  const updateRow = (index: number, changes: Partial<SeatLayoutRow>) => {
    setRows((current) =>
      current.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, ...changes };
        updated.disabled = (updated.disabled || []).filter(
          (n) => n <= updated.seats
        );
        return updated;
      })
    );
  };

  const toggleSeat = (index: number, seatNumber: number) => {
    const disabled = rows[index].disabled || [];
    updateRow(index, {
      disabled: disabled.includes(seatNumber)
        ? disabled.filter((n) => n !== seatNumber)
        : [...disabled, seatNumber],
    });
  };

  const addRow = () => {
    const previous = rows[rows.length - 1];
    setRows([
      ...rows,
      {
        row: nextRowLabel(rows),
        seats: previous?.seats || 10,
        seat_type: previous?.seat_type || "Standard",
        disabled: [],
      },
    ]);
  };

  const removeRow = (index: number) =>
    setRows(rows.filter((_, i) => i !== index));

  const totalSeats = rows.reduce((sum, row) => sum + row.seats, 0);
  const disabledSeatCount = rows.reduce(
    (sum, row) => sum + (row.disabled?.length || 0),
    0
  );
  const activeSeatCount = totalSeats - disabledSeatCount;

  const handleSave = async () => {
    const labels = rows.map((row) => row.row.trim().toUpperCase());
    if (labels.some((label) => !/^[A-Z]{1,3}$/.test(label))) {
      toast.error('Row labels must be 1-3 letters, e.g. "A" or "AA"');
      return;
    }
    if (new Set(labels).size !== labels.length) {
      toast.error("Each row label can only be used once");
      return;
    }

    setSaving(true);
    try {
      const response = await dispatch(
        saveScreenSeats({
          screenId: screen.screen_id,
          rows: rows.map((row, i) => ({
            row: labels[i],
            seats: Number(row.seats),
            seat_type: row.seat_type?.trim() || undefined,
            disabled: row.disabled?.length ? row.disabled : undefined,
          })),
        })
      ).unwrap();
      toast.success(response.message);
      dispatch(
        getAllScreen({
          screensPage: 1,
          screensLimit: 10,
          cinema_id: screen.cinema_id,
        })
      );
      onCancel();
    } catch (error: any) {
      toast.error(error?.message || "Could not save the seat layout");
    } finally {
      setSaving(false);
    }
  };

  if (screenSeatsLoading) return <Loader rows={4} />;

  return (
    <div className="space-y-5">
      {/* Summary Header Bar */}
      <div className="rounded-xl bg-[#fff8ea]/80 border border-[#c77e3b]/20 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#c77e3b]/15 text-[#754f2c] flex items-center justify-center shrink-0">
            <Armchair size={18} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#754f2c]">
              Auditorium Seat Map Designer
            </p>
            <p className="text-xs text-stone-500">
              Add rows below, then click any seat in the live preview to mark it
              as disabled or an aisle gap.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700">
            {rows.length} {rows.length === 1 ? "Row" : "Rows"}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
            {activeSeatCount} Sellable
          </span>
          {disabledSeatCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-stone-500">
              {disabledSeatCount} Disabled
            </span>
          )}
        </div>
      </div>

      {/* Row Builder List */}
      <div className="space-y-2.5 max-h-[34vh] overflow-y-auto pr-1">
        {rows.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/60 py-8 px-4 text-center space-y-2">
            <Sparkles className="w-7 h-7 text-[#c77e3b] mx-auto" />
            <p className="text-sm font-semibold text-stone-700">
              No seat map configured yet
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Without a seat map, this screen sells tickets by general admission
              count. Click <strong>Add Row</strong> below to design an
              interactive seat layout.
            </p>
          </div>
        ) : (
          rows.map((row, index) => (
            <div
              key={index}
              className="flex flex-wrap md:flex-nowrap items-end gap-2.5 p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-[#c77e3b]/30 transition-colors"
            >
              <Input
                label={index === 0 ? "Row Label" : undefined}
                value={row.row}
                maxLength={3}
                onChange={(e) =>
                  updateRow(index, { row: e.target.value.toUpperCase() })
                }
                conClassName="w-20"
                className="text-center font-bold"
              />
              <Input
                label={index === 0 ? "Seats" : undefined}
                type="number"
                min={1}
                max={100}
                value={row.seats}
                onChange={(e) =>
                  updateRow(index, {
                    seats: Math.min(
                      100,
                      Math.max(1, Number(e.target.value) || 1)
                    ),
                  })
                }
                conClassName="w-24"
              />
              <div className="flex-1 min-w-[160px]">
                <Input
                  label={index === 0 ? "Seat Category" : undefined}
                  value={row.seat_type || ""}
                  maxLength={30}
                  placeholder="Standard"
                  onChange={(e) =>
                    updateRow(index, { seat_type: e.target.value })
                  }
                />
                {index === rows.length - 1 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {SEAT_TYPE_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => updateRow(index, { seat_type: preset })}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                          row.seat_type === preset
                            ? "bg-[#c77e3b]/15 border-[#c77e3b] text-[#754f2c] font-semibold"
                            : "bg-white border-stone-200 text-stone-500 hover:border-[#c77e3b]/40"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                className="text-red-500! hover:bg-red-50! border-stone-200! h-[38px]"
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => removeRow(index)}
              />
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          icon={<Plus className="w-4 h-4" />}
          title="Add Row"
          onClick={addRow}
          disabled={rows.length >= 60}
        />
        {rows.length > 0 && (
          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-t bg-[#c77e3b] inline-block" />
              Active Seat
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-t bg-stone-200 inline-block" />
              Disabled / Aisle (Click to toggle)
            </span>
          </div>
        )}
      </div>

      {/* Live Auditorium Preview */}
      {rows.length > 0 && (
        <div className="border border-[#2a231c] rounded-2xl p-5 bg-[#161310] text-white overflow-x-auto">
          <div className="max-w-md mx-auto mb-5 text-center">
            <div className="h-1.5 w-3/4 mx-auto rounded-full bg-[#c77e3b]" />
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#fff8ea]/50 mt-2">
              Auditorium Screen
            </p>
          </div>

          <div className="space-y-1.5 w-max mx-auto pb-1">
            {rows.map((row, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-7 text-xs font-bold text-stone-400 text-right pr-1">
                  {row.row}
                </span>
                {Array.from({ length: row.seats }, (_, i) => i + 1).map(
                  (seatNumber) => {
                    const isDisabled = row.disabled?.includes(seatNumber);
                    return (
                      <button
                        key={seatNumber}
                        type="button"
                        title={`${row.row}${seatNumber} (${
                          row.seat_type || "Standard"
                        })${
                          isDisabled
                            ? " — Disabled (click to enable)"
                            : " — Active (click to disable)"
                        }`}
                        onClick={() => toggleSeat(index, seatNumber)}
                        className={`w-6 h-6 rounded-t-md text-[10px] font-semibold transition-all cursor-pointer ${
                          isDisabled
                            ? "bg-stone-700/60 text-stone-500 line-through border border-stone-600/50"
                            : "bg-[#c77e3b] hover:bg-[#b06a2b] text-white shadow-sm"
                        }`}
                      >
                        {seatNumber}
                      </button>
                    );
                  }
                )}
                <span className="text-[10px] text-stone-400 pl-1.5">
                  {row.seat_type || "Standard"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-stone-200/80">
        <span className="text-xs font-semibold text-stone-500">
          Total active capacity:{" "}
          <strong className="text-stone-900">{activeSeatCount} seats</strong>
        </span>
        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="outline"
            title="Cancel"
            onClick={onCancel}
            disabled={saving}
          />
          <Button
            type="button"
            title="Save Seat Layout"
            loading={saving}
            onClick={handleSave}
            disabled={saving || rows.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatLayoutEditor;
