import { formatCurrency, getHumanTime } from "../../../utils";

interface BookingSummaryProps {
  selectedMovie: any;
  selectedShowtime: any;
  ticketQuantity: number;
  selectedProducts: any[];
  totalPrice: number;
}

export default function BookingSummary({
  selectedMovie,
  selectedShowtime,
  ticketQuantity,
  selectedProducts,
  totalPrice,
}: BookingSummaryProps) {
  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm sticky top-6">
      <h3 className="font-sans font-bold text-lg mb-6 border-b pb-4">Booking Summary</h3>
      <div className="space-y-6">
        {selectedMovie && (
          <div className="flex gap-4">
            <img 
              src={selectedMovie.poster || "/placeholder.svg"} 
              alt={selectedMovie.title}
              className="w-16 h-20 object-cover rounded-lg shadow-sm"
            />
            <div>
              <p className="font-serif text-xs text-muted-foreground uppercase tracking-wider">Movie</p>
              <p className="font-sans font-bold text-sm leading-tight">{selectedMovie.title}</p>
              <p className="text-xs text-muted-foreground font-serif mt-1">{selectedMovie.duration} min • {selectedMovie.rating}</p>
            </div>
          </div>
        )}

        {selectedShowtime && (
          <div className="bg-muted/30 p-4 rounded-xl space-y-3">
            <div>
              <p className="font-serif text-xs text-muted-foreground uppercase tracking-wider">Showtime</p>
              <p className="font-sans font-bold text-sm">{getHumanTime(selectedShowtime.show_time)}</p>
            </div>
            <div>
              <p className="font-serif text-xs text-muted-foreground uppercase tracking-wider">Theater & Screen</p>
              <p className="font-serif text-xs font-medium">
                {selectedShowtime.screen?.cinema?.name} • {selectedShowtime.screen?.name}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
           {ticketQuantity > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-sans font-medium text-sm">Tickets</p>
                <p className="text-xs text-muted-foreground font-serif">{ticketQuantity} x ${selectedShowtime?.price || 0}</p>
              </div>
              <p className="font-sans font-bold text-sm">{formatCurrency(ticketQuantity * (selectedShowtime?.price || 0))}</p>
            </div>
          )}

          {selectedProducts.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-dashed">
              <p className="font-serif text-xs text-muted-foreground uppercase tracking-wider">Concessions</p>
              {selectedProducts.map((p, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-sans text-muted-foreground">{p.quantity}x {p.name}</span>
                  <span className="font-sans font-medium">{formatCurrency(p.quantity * p.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-muted">
          <div className="flex items-center justify-between">
            <p className="font-sans font-bold text-lg text-primary">Total Amount</p>
            <p className="font-sans font-extrabold text-xl text-primary">
              {formatCurrency(totalPrice > 0 ? totalPrice : (ticketQuantity * (selectedShowtime?.price || 0)) + selectedProducts.reduce((acc, p) => acc + (p.quantity * p.price), 0))}
            </p>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-4 font-serif">
            Taxes and fees (VAT) will be calculated at checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
