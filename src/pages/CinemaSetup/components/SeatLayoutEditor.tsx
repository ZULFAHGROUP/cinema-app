/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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

const SeatLayoutEditor = ({ screen, onCancel }: SeatLayoutEditorProps) => {
  const dispatch = useAppDispatch();
  const { screenSeats, screenSeatsLoading } = useAppSelector((state) => state.seat);
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
        // Seats beyond the new row length no longer exist.
        updated.disabled = (updated.disabled || []).filter((n) => n <= updated.seats);
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

  const removeRow = (index: number) => setRows(rows.filter((_, i) => i !== index));

  const activeSeatCount = rows.reduce(
    (sum, row) => sum + row.seats - (row.disabled?.length || 0),
    0
  );

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
      // seat_count follows the number of active seats.
      dispatch(getAllScreen({ screensPage: 1, screensLimit: 10, cinema_id: screen.cinema_id }));
      onCancel();
    } catch (error: any) {
      toast.error(error?.message || "Could not save the seat layout");
    } finally {
      setSaving(false);
    }
  };

  if (screenSeatsLoading) return <Loader rows={4} />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Rows are numbered from seat 1. Click a seat in the preview to disable it (broken,
        removed or an aisle). Saving again updates the layout in place; seats already sold
        keep their tickets.
      </p>

      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
        {rows.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No seat map yet. Without one, this screen sells by ticket count only.
          </p>
        )}
        {rows.map((row, index) => (
          <div key={index} className="flex items-end gap-2">
            <Input
              label={index === 0 ? "Row" : undefined}
              value={row.row}
              maxLength={3}
              onChange={(e) => updateRow(index, { row: e.target.value.toUpperCase() })}
              conClassName="w-20"
            />
            <Input
              label={index === 0 ? "Seats" : undefined}
              type="number"
              min={1}
              max={100}
              value={row.seats}
              onChange={(e) =>
                updateRow(index, { seats: Math.min(100, Math.max(1, Number(e.target.value) || 1)) })
              }
              conClassName="w-24"
            />
            <Input
              label={index === 0 ? "Seat type" : undefined}
              value={row.seat_type || ""}
              maxLength={30}
              placeholder="Standard"
              onChange={(e) => updateRow(index, { seat_type: e.target.value })}
              conClassName="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-md mb-1"
              icon={<Trash2 className="w-4 h-4" />}
              onClick={() => removeRow(index)}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="rounded-md"
        icon={<Plus className="w-4 h-4" />}
        title="Add row"
        onClick={addRow}
        disabled={rows.length >= 60}
      />

      {rows.length > 0 && (
        <div className="border rounded-lg p-3 bg-gray-50 overflow-x-auto">
          <div className="text-center text-xs text-muted-foreground mb-3 border-b pb-1">
            SCREEN
          </div>
          <div className="space-y-1 w-max mx-auto">
            {rows.map((row, index) => (
              <div key={index} className="flex items-center gap-1">
                <span className="w-7 text-xs font-medium text-right pr-1">{row.row}</span>
                {Array.from({ length: row.seats }, (_, i) => i + 1).map((seatNumber) => {
                  const isDisabled = row.disabled?.includes(seatNumber);
                  return (
                    <button
                      key={seatNumber}
                      type="button"
                      title={`${row.row}${seatNumber}${isDisabled ? " (disabled)" : ""}`}
                      onClick={() => toggleSeat(index, seatNumber)}
                      className={`w-5 h-5 rounded-t text-[9px] leading-5 ${
                        isDisabled
                          ? "bg-gray-200 text-gray-400 line-through"
                          : "bg-[#c77e3b] text-white"
                      }`}
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-muted-foreground">{activeSeatCount} sellable seats</span>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-md"
            title="Cancel"
            onClick={onCancel}
            disabled={saving}
          />
          <Button
            type="button"
            className="rounded-md"
            title="Save layout"
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
