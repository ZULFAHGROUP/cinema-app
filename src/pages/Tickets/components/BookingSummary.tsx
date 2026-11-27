/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatCurrency, getHumanTime, getImageUrl } from "../../../utils";
import { Ticket } from "lucide-react";

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
  const computedTotal =
    totalPrice > 0
      ? totalPrice
      : ticketQuantity * (selectedShowtime?.price || 0) +
        selectedProducts.reduce((acc, p) => acc + p.quantity * p.price, 0);

  return (
    <div className="bg-white border border-[#c77e3b]/20 rounded-2xl overflow-hidden shadow-[0_8px_30px_-6px_rgba(117,79,44,0.12)] sticky top-6">
      <div className="bg-gradient-to-r from-[#c77e3b] to-[#754f2c] px-6 py-4 text-white flex items-center gap-2.5">
        <Ticket className="w-5 h-5 text-[#fff8ea]" />
        <h3 className="font-bold text-base text-[#fff8ea]">Booking Summary</h3>
      </div>

      <div className="p-6 space-y-5">
        {selectedMovie && (
          <div className="flex gap-3.5">
            <img
              src={getImageUrl(selectedMovie.poster_url || selectedMovie.poster)}
              alt={selectedMovie.title}
              className="w-16 h-22 object-cover rounded-xl shadow-sm shrink-0 bg-stone-200"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#c77e3b] uppercase tracking-wider">
                Movie
              </p>
              <p className="font-bold text-sm text-stone-900 leading-snug mt-0.5">
                {selectedMovie.title}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                {selectedMovie.duration} min · ★ {selectedMovie.rating}
              </p>
            </div>
          </div>
        )}

        {selectedShowtime && selectedShowtime.show_time && (
          <div className="bg-[#fff8ea]/70 border border-[#c77e3b]/15 p-3.5 rounded-xl space-y-2">
            <div>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Showtime
              </p>
              <p className="font-extrabold text-sm text-[#754f2c]">
                {getHumanTime(selectedShowtime.show_time)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Theater & Screen
              </p>
              <p className="text-xs font-semibold text-stone-700">
                {selectedShowtime.screen?.cinema?.name} ·{" "}
                {selectedShowtime.screen?.name}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {ticketQuantity > 0 && (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm text-stone-800">Tickets</p>
                <p className="text-xs text-stone-500">
                  {ticketQuantity} × {formatCurrency(selectedShowtime?.price || 0)}
                </p>
              </div>
              <p className="font-bold text-sm text-stone-900">
                {formatCurrency(ticketQuantity * (selectedShowtime?.price || 0))}
              </p>
            </div>
          )}

          {selectedProducts.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-dashed border-stone-200">
              <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Concessions
              </p>
              {selectedProducts.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-stone-600">
                    {p.quantity}× {p.name}
                  </span>
                  <span className="font-semibold text-stone-900">
                    {formatCurrency(p.quantity * p.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t-2 border-dashed border-[#c77e3b]/25">
          <div className="flex items-center justify-between">
            <p className="font-bold text-base text-stone-900">Subtotal</p>
            <p className="font-extrabold text-xl text-[#c77e3b]">
              {formatCurrency(computedTotal)}
            </p>
          </div>
          <p className="text-[11px] text-center text-stone-400 mt-3">
            Applicable VAT is added at final checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
