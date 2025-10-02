/* eslint-disable @typescript-eslint/no-explicit-any */

interface BookingSummaryProps {
  selectedMovie: any;
  selectedShowtime: any;
  ticketQuantity: any;
  selectedSeats: string[];
  totalTickets: number;
  totalPrice: number;
}

export default function BookingSummary({
  selectedMovie,
  selectedShowtime,
  ticketQuantity,
  selectedSeats,
  totalTickets,
  totalPrice,
}: BookingSummaryProps) {
  return (
    <div className="w-80 bg-card border-l border-border p-6">
      <h3 className="font-sans font-semibold mb-4">Booking Summary</h3>
      <div className="space-y-4">
        {selectedMovie && (
          <div>
            <p className="font-serif text-sm text-muted-foreground">Movie</p>
            <p className="font-sans font-medium">{selectedMovie.title}</p>
          </div>
        )}

        {selectedShowtime && (
          <div>
            <p className="font-serif text-sm text-muted-foreground">Showtime</p>
            <p className="font-sans font-medium">{selectedShowtime.time}</p>
            <p className="font-serif text-sm">
              {selectedShowtime.theater} • {selectedShowtime.screen}
            </p>
          </div>
        )}

        {totalTickets > 0 && (
          <div>
            <p className="font-serif text-sm text-muted-foreground">Tickets</p>
            <div className="space-y-1">
              {ticketQuantity.adult > 0 && (
                <p className="font-serif text-sm">
                  {ticketQuantity.adult} Adult
                </p>
              )}
              {ticketQuantity.child > 0 && (
                <p className="font-serif text-sm">
                  {ticketQuantity.child} Child
                </p>
              )}
              {ticketQuantity.senior > 0 && (
                <p className="font-serif text-sm">
                  {ticketQuantity.senior} Senior
                </p>
              )}
            </div>
          </div>
        )}

        {selectedSeats.length > 0 && (
          <div>
            <p className="font-serif text-sm text-muted-foreground">Seats</p>
            <p className="font-sans font-medium">{selectedSeats.join(", ")}</p>
          </div>
        )}

        <div className="border-t pt-4" />

        <div className="flex items-center justify-between">
          <p className="font-sans font-semibold">Total</p>
          <p className="font-sans font-semibold text-lg">
            ${totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
