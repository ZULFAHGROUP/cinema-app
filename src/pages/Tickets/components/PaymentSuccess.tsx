/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, Download, Printer, Share2, Ticket } from "lucide-react";
import Button from "../../../components/shared/Button";
import { formatCurrency } from "../../../utils";

interface PaymentSuccessProps {
  bookingData: {
    bookingNumber: string;
    movieTitle: string;
    theater: string;
    screen: string;
    showtime: string;
    seats: string[];
    amountPaid: number;
    customerEmail: string;
    bookingDate: string;
  };
  onNewBooking: () => void;
}

const PaymentSuccess = ({ bookingData, onNewBooking }: PaymentSuccessProps) => {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Success Header */}
      <div className="text-center mb-8 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 shadow-sm">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-sans font-bold text-foreground mb-2">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground font-serif">
          Your tickets have been booked and sent to{" "}
          <span className="text-foreground font-medium">
            {bookingData.customerEmail}
          </span>
        </p>
      </div>

      {/* Ticket Card */}
      <div className="relative bg-card border-2 border-dashed border-muted rounded-2xl overflow-hidden shadow-xl mb-8 animate-in slide-in-from-bottom duration-700">
        {/* Decorative Circles for Ticket Cutouts */}
        <div className="absolute top-1/2 -left-4 w-8 h-8 bg-background border-r-2 border-muted rounded-full -translate-y-1/2 z-10" />
        <div className="absolute top-1/2 -right-4 w-8 h-8 bg-background border-l-2 border-muted rounded-full -translate-y-1/2 z-10" />

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* QR Code Placeholder */}
            <div className="w-32 h-32 bg-white p-2 rounded-lg border flex items-center justify-center shrink-0 mx-auto md:mx-0">
              <div className="grid grid-cols-4 gap-1 w-full h-full opacity-20">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="bg-black" />
                ))}
              </div>
              <Ticket className="absolute w-8 h-8 text-muted-foreground opacity-50" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="text-sm font-sans font-semibold text-primary uppercase tracking-wider mb-1">
                Booking ID: {bookingData.bookingNumber}
              </div>
              <h2 className="text-2xl font-sans font-bold mb-2">
                {bookingData.movieTitle}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-serif">
                <span>{bookingData.theater}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span>{bookingData.screen}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-muted">
            <div>
              <p className="text-xs font-serif text-muted-foreground uppercase mb-1">
                Date & Time
              </p>
              <p className="text-sm font-sans font-bold">
                {bookingData.showtime}
              </p>
            </div>
            <div>
              <p className="text-xs font-serif text-muted-foreground uppercase mb-1">
                Seats
              </p>
              <p className="text-sm font-sans font-bold">
                {bookingData.seats.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-xs font-serif text-muted-foreground uppercase mb-1">
                Amount
              </p>
              <p className="text-sm font-sans font-bold">
                {formatCurrency(bookingData.amountPaid)}
              </p>
            </div>
            <div>
              <p className="text-xs font-serif text-muted-foreground uppercase mb-1">
                Status
              </p>
              <p className="text-sm font-sans font-bold text-green-600">
                Paid
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-dashed border-muted text-center italic text-sm text-muted-foreground font-serif">
            Thank you for choosing Cinema App. Enjoy your movie!
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 transition-transform hover:scale-105"
          icon={<Printer className="w-5 h-5 mb-1 text-primary" />}
          title="Print"
        />
        <Button
          variant="outline"
          className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 transition-transform hover:scale-105"
          icon={<Download className="w-5 h-5 mb-1 text-primary" />}
          title="Download"
        />
        <Button
          variant="outline"
          className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 transition-transform hover:scale-105"
          icon={<Share2 className="w-5 h-5 mb-1 text-primary" />}
          title="Share"
        />
        <Button
          variant="primary"
          className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 transition-transform hover:scale-105 bg-black hover:bg-black/90"
          onClick={onNewBooking}
          title="New Sale"
        />
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={() => window.print()}
          className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
        >
          Need a VAT invoice? Click here to download.
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
