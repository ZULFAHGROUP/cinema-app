/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertTriangle, CheckCircle, Download, Loader2, Printer, Share2, Ticket } from "lucide-react";
import Button from "../../components/shared/Button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { allRoutes } from "../../routes/allRoutes";
import Purchase from "../../services/network/purchase";

type CompletionState = "completing" | "completed" | "failed";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    // Paystack sends `reference`/`trxref`; Nomba sends `orderReference`.
    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      searchParams.get("orderReference") ||
      "";
    const navigate = useNavigate();
    const [state, setState] = useState<CompletionState>(reference ? "completing" : "failed");
    const [errorMessage, setErrorMessage] = useState(reference ? "" : "No payment reference was returned.");

    // The webhook usually completes the order first; this call is safe to repeat
    // and covers environments the webhook can't reach (e.g. local development).
    useEffect(() => {
      if (!reference) return;
      Purchase.complete(reference)
        .then(() => setState("completed"))
        .catch((error: any) => {
          setState("failed");
          setErrorMessage(
            error?.response?.status === 409
              ? "Payment was received, but the held seats were resold after the hold ended. Staff will refund this order."
              : error?.message || "We couldn't confirm this payment yet."
          );
        });
    }, [reference]);

    if (state !== "completed") {
      return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 text-center">
          {state === "completing" ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-sans font-bold">Confirming your payment...</h1>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-sans font-bold mb-2">Payment not confirmed</h1>
              <p className="text-muted-foreground font-serif mb-2">{errorMessage}</p>
              {reference && <p className="text-sm break-all">Reference: {reference}</p>}
              <Button
                variant="primary"
                className="rounded-xl mt-6"
                onClick={() => navigate(allRoutes.tickets)}
                title="Back to Ticket Sales"
              />
            </>
          )}
        </div>
      );
    }

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
          Your payment has been processed successfully.
        </p>
      </div>

      {/* Ticket Card */}
      <div className="relative bg-primary border-2 border-dashed border-muted rounded-2xl overflow-hidden shadow-xl mb-8 animate-in slide-in-from-bottom duration-700">
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
                Booking Reference
              </div>
              <h2 className="text-2xl font-sans font-bold mb-2 break-all">
                {reference}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground font-serif">
                <span>Check your email for details</span>
              </div>
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
          icon={<Printer className="w-5 h-5 mb-1 text-" />}
          title="Print"
        />
        <Button
          variant="outline"
          className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 transition-transform hover:scale-105"
          icon={<Download className="w-5 h-5 mb-1 text-" />}
          title="Download"
        />
        <Button
          variant="outline"
          className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 transition-transform hover:scale-105"
          icon={<Share2 className="w-5 h-5 mb-1 text-" />}
          title="Share"
        />
        <Button
          variant="primary"
          className="rounded-xl flex flex-col items-center gap-1 h-auto py-3 transition-transform hover:scale-105 bg-black hover:bg-black/90"
          onClick={() => navigate(allRoutes.tickets)}
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
