/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import { Printer, Mail, CheckCircle } from "lucide-react";

interface ConfirmationProps {
  movie: any;
  showtime: any;
  seats: string[];
  customer: any;
  totalPrice: number;
  onNewSale: () => void;
}

export default function Confirmation({
  movie,
  showtime,
  seats,
  customer,
  totalPrice,
  onNewSale,
}: ConfirmationProps) {
  const bookingNumber = `BK${Math.random()
    .toString(36)
    .substr(2, 9)
    .toUpperCase()}`;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-sans font-bold mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-muted-foreground font-serif">
          Booking Number:{" "}
          <span className="font-sans font-semibold">{bookingNumber}</span>
        </p>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        {/* Ticket Preview */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-sans font-bold text-xl">{movie?.title}</h3>
              <p className="text-sm text-muted-foreground font-serif">
                {movie?.genre} • {movie?.rating}
              </p>
            </div>
            <img
              src={movie?.poster || "/placeholder.svg"}
              alt={movie?.title}
              className="w-16 h-20 object-cover rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground font-serif">Date & Time</p>
              <p className="font-sans font-medium">{showtime?.time}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-serif">Theater</p>
              <p className="font-sans font-medium">
                {showtime?.theater} • {showtime?.screen}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-serif">Seats</p>
              <p className="font-sans font-medium">{seats.join(", ")}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-serif">Tickets</p>
              <p className="font-sans font-medium">{seats.length} tickets</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-sans font-semibold">Total Paid</span>
              <span className="font-sans font-bold text-2xl">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {customer && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground font-serif mb-2">
              Customer Details
            </p>
            <p className="font-sans">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-sm font-serif text-muted-foreground">
              {customer.email}
            </p>
            <p className="text-sm font-serif text-muted-foreground">
              {customer.phone}
            </p>
          </div>
        )}

        {/* Booking Details */}
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground font-serif">
            Booked on: {currentDate}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          className="gap-2 rounded-md"
          icon={<Printer className="w-4 h-4" />}
          title="Print Tickets"
        />
        <Button
          variant="outline"
          className="gap-2 rounded-md"
          icon={<Mail className="w-4 h-4" />}
          title="Email Tickets"
        />
        <Button
          variant="outline"
          onClick={onNewSale}
          className="gap-2 rounded-md"
          title="New Sale"
        />
      </div>
    </div>
  );
}
