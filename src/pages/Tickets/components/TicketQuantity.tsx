/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import { Plus, Minus } from "lucide-react";

interface TicketQuantityProps {
  basePrice: number;
  ticketQuantity: any;
  setTicketQuantity: (quantity: any) => void;
  totalTickets: number;
  totalPrice: number;
  onConfirm: () => void;
  onBack: () => void;
}

export default function TicketQuantity({
  basePrice,
  ticketQuantity,
  setTicketQuantity,
  totalTickets,
  totalPrice,
  onConfirm,
  onBack,
}: TicketQuantityProps) {
  const ticketTypes = [
    {
      key: "adult",
      label: "Adult",
      price: basePrice,
      description: "Ages 13+",
    },
    {
      key: "child",
      label: "Child",
      price: basePrice * 0.7,
      description: "Ages 3-12",
    },
    {
      key: "senior",
      label: "Senior",
      price: basePrice * 0.8,
      description: "Ages 65+",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          title="← Back"
          className="rounded-md"
        />
        <h2 className="text-xl font-sans font-semibold">Select Tickets</h2>
      </div>
      <div className="border rounded-lg p-6">
        <div className="space-y-6">
          {ticketTypes.map((ticketType) => (
            <div
              key={ticketType.key}
              className="flex items-center justify-between"
            >
              <div>
                <p className="font-sans font-medium">{ticketType.label}</p>
                <p className="text-sm font-serif text-muted-foreground">
                  {ticketType.description}
                </p>
                <p className="text-sm font-serif font-medium">
                  ${ticketType.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setTicketQuantity((prev: any) => ({
                      ...prev,
                      [ticketType.key]: Math.max(0, prev[ticketType.key] - 1),
                    }))
                  }
                  disabled={ticketQuantity[ticketType.key] === 0}
                  className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-serif">
                  {ticketQuantity[ticketType.key]}
                </span>
                <button
                  onClick={() =>
                    setTicketQuantity((prev: any) => ({
                      ...prev,
                      [ticketType.key]: prev[ticketType.key] + 1,
                    }))
                  }
                  className="p-2 border rounded hover:bg-gray-100"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          <div className="border-t pt-4" />
          <div className="flex items-center justify-between">
            <p className="font-sans font-semibold">
              Total: {totalTickets} tickets
            </p>
            <p className="font-sans font-semibold text-lg">
              ${totalPrice.toFixed(2)}
            </p>
          </div>
          <Button
            onClick={onConfirm}
            disabled={totalTickets === 0}
            className="w-full rounded-md"
            title="Continue to Seat Selection"
          />
        </div>
      </div>
    </div>
  );
}
