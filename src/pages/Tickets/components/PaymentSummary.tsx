/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import { ExternalLink, ShieldCheck, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../../utils";

/** Seconds left on the seat hold; after it the seats may be sold to someone else. */
const useSecondsLeft = (until?: string) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [until]);
  return until ? Math.max(0, Math.floor((new Date(until).getTime() - now) / 1000)) : null;
};

const gatewayName = (gateway?: string) =>
  gateway ? gateway.charAt(0).toUpperCase() + gateway.slice(1) : "our payment provider";

interface PaymentSummaryProps {
  initiateData: any;
  loading: boolean;
  onPay: () => void;
  onBack: () => void;
}

export default function PaymentSummary({
  initiateData,
  loading,
  onPay,
  onBack,
}: PaymentSummaryProps) {
  const secondsLeft = useSecondsLeft(initiateData?.seats_held_until);
  if (!initiateData) return null;

  const holdExpired = secondsLeft === 0;
  const gateway = gatewayName(initiateData.payment_gateway);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          title="← Back"
          className="rounded-md"
          disabled={loading}
        />
        <h2 className="text-xl font-sans font-semibold text-foreground">Payment Summary</h2>
      </div>

      <div className="bg-card border-t-4 border-t-primary rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground uppercase tracking-widest font-sans font-bold">
            <span>Description</span>
            <span>Amount</span>
          </div>
          
          <div className="space-y-3 pt-2">
            {initiateData.seats?.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-sans">Seats</span>
                <span className="font-sans font-medium">{initiateData.seats.join(", ")}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-sans">Total</span>
              <span className="font-sans font-medium">{formatCurrency(initiateData.amount || 0)}</span>
            </div>
            {/* <div className="flex justify-between items-center">
              <span className="font-sans text-muted-foreground">VAT (7.5%)</span>
              <span className="font-sans text-muted-foreground">{formatCurrency(breakdown.vat_amount || 0)}</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-xl font-sans font-bold">Total to Pay</span>
              <span className="text-2xl font-sans font-extrabold text-primary">
                {formatCurrency(breakdown.grand_total || 0)}
              </span>
            </div> */}
          </div>
        </div>

        <div className="bg-muted/50 p-6 space-y-4">
          {secondsLeft !== null && (
            <div
              className={`flex gap-2 items-center p-3 rounded-lg text-sm ${
                holdExpired ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"
              }`}
            >
              <Timer className="w-4 h-4 shrink-0" />
              {holdExpired
                ? "The seat hold has ended and these seats may be resold. Go back and start again."
                : `Seats held for ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}. Complete payment before then.`}
            </div>
          )}
          <div className="flex gap-3 items-start p-4 bg-background rounded-lg border border-primary/20">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div className="text-xs font-serif text-muted-foreground">
              Your payment is secured by {gateway}. You will be redirected to their secure checkout page to complete the transaction.
            </div>
          </div>

          <Button
            onClick={onPay}
            loading={loading}
            disabled={holdExpired || !initiateData.authorization_url}
            className="w-full rounded-xl py-6 h-auto text-lg font-bold flex gap-2 items-center justify-center bg-black hover:bg-black/90"
            icon={<ExternalLink className="w-5 h-5" />}
            title={loading ? "Initiating..." : `Pay with ${gateway}`}
          />
        </div>
      </div>
    </div>
  );
}
