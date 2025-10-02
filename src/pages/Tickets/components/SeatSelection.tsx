import { useState } from "react";
import Button from "../../../components/shared/Button";

interface SeatSelectionProps {
  totalTickets: number;
  theater: string;
  onConfirm: (seats: string[]) => void;
  onBack: () => void;
}

export default function SeatSelection({
  totalTickets,
  //   theater,
  onConfirm,
  onBack,
}: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 10;

  const toggleSeat = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length < totalTickets) {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const isSeatOccupied = (seat: string) => {
    // Simulate some occupied seats
    const occupied = ["A5", "B3", "B4", "C6", "D7", "E2"];
    return occupied.includes(seat);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          title="← Back"
          className="rounded-md"
        />
        <h2 className="text-xl font-sans font-semibold">Select Seats</h2>
      </div>

      <div className="border rounded-lg p-6">
        {/* Screen */}
        <div className="mb-8">
          <div className="h-2 bg-gray-300 rounded-full mb-2" />
          <p className="text-center text-sm text-muted-foreground font-serif">
            Screen
          </p>
        </div>

        {/* Seat Map */}
        <div className="space-y-2 mb-6">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-6 text-center font-serif text-sm">{row}</span>
              <div className="flex gap-2 flex-1 justify-center">
                {Array.from({ length: seatsPerRow }, (_, i) => {
                  const seatNumber = `${row}${i + 1}`;
                  const isOccupied = isSeatOccupied(seatNumber);
                  const isSelected = selectedSeats.includes(seatNumber);

                  return (
                    <button
                      key={seatNumber}
                      onClick={() => !isOccupied && toggleSeat(seatNumber)}
                      disabled={isOccupied}
                      className={`w-8 h-8 rounded text-xs font-serif ${
                        isOccupied
                          ? "bg-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200 border"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 border rounded" />
            <span className="font-serif">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded" />
            <span className="font-serif">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-300 rounded" />
            <span className="font-serif">Occupied</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-serif mb-4">
            Selected: {selectedSeats.length} of {totalTickets} seats
            {selectedSeats.length > 0 && ` (${selectedSeats.join(", ")})`}
          </p>
          <Button
            onClick={() => onConfirm(selectedSeats)}
            disabled={selectedSeats.length !== totalTickets}
            className="w-full rounded-md"
            title="Continue to Customer Info"
          />
        </div>
      </div>
    </div>
  );
}
