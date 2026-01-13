/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "../../../components/shared/Button";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { formatCurrency } from "../../../utils";

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
  if (!initiateData) return null;


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
          <div className="flex gap-3 items-start p-4 bg-background rounded-lg border border-primary/20">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
            <div className="text-xs font-serif text-muted-foreground">
              Your payment is secured by Paystack. You will be redirected to their secure checkout page to complete the transaction.
            </div>
          </div>

          <Button
            onClick={onPay}
            loading={loading}
            className="w-full rounded-xl py-6 h-auto text-lg font-bold flex gap-2 items-center justify-center bg-black hover:bg-black/90"
            icon={<ExternalLink className="w-5 h-5" />}
            title={loading ? "Initiating..." : "Pay with Paystack"}
          />
        </div>
      </div>
      
      <p className="text-center text-xs text-muted-foreground font-serif">
        Order ID: {initiateData.order_id}
      </p>
    </div>
  );
}
