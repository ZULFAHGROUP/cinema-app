/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertTriangle,
  CheckCircle,
  Download,
  Loader2,
  Printer,
  Share2,
  Ticket,
} from "lucide-react";
import Button from "../../components/shared/Button";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { allRoutes } from "../../routes/allRoutes";
import Purchase from "../../services/network/purchase";

type CompletionState = "completing" | "completed" | "failed";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference =
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    searchParams.get("orderReference") ||
    "";
  const navigate = useNavigate();
  const [state, setState] = useState<CompletionState>(
    reference ? "completing" : "failed"
  );
  const [errorMessage, setErrorMessage] = useState(
    reference ? "" : "No payment reference was returned."
  );

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
      <div className="min-h-screen bg-[#fff8ea] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-[#c77e3b]/20 p-8 text-center shadow-lg">
          {state === "completing" ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#c77e3b]" />
              <h1 className="text-2xl font-extrabold text-stone-900">
                Confirming your payment...
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Please wait while we verify your transaction reference.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 border border-red-200 rounded-2xl mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-extrabold text-stone-900 mb-2">
                Payment Not Confirmed
              </h1>
              <p className="text-sm text-stone-600 mb-3">{errorMessage}</p>
              {reference && (
                <p className="text-xs font-mono bg-stone-100 px-3 py-1.5 rounded-lg break-all text-stone-700">
                  Reference: {reference}
                </p>
              )}
              <Button
                variant="primary"
                className="mt-6 w-full"
                onClick={() => navigate(allRoutes.tickets)}
                title="Back to Ticket Sales"
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8ea] py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-18 h-18 bg-emerald-50 border border-emerald-200 rounded-2xl mb-4 shadow-sm">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 mb-1">
            Payment Successful!
          </h1>
          <p className="text-sm text-stone-500">
            Your booking has been confirmed and tickets are ready.
          </p>
        </div>

        {/* Modern Ticket Stub Card */}
        <div className="relative bg-white border-2 border-[#c77e3b]/30 rounded-3xl overflow-hidden shadow-xl mb-8">
          <div className="h-2 bg-gradient-to-r from-[#c77e3b] via-[#754f2c] to-[#5480c7]" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
              {/* QR Code Placeholder */}
              <div className="w-28 h-28 bg-[#fff8ea] p-3 rounded-2xl border border-[#c77e3b]/25 flex items-center justify-center shrink-0 relative">
                <div className="grid grid-cols-4 gap-1 w-full h-full opacity-20">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="bg-[#754f2c] rounded-xs" />
                  ))}
                </div>
                <Ticket className="absolute w-8 h-8 text-[#c77e3b]" />
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="text-xs font-bold text-[#c77e3b] uppercase tracking-wider mb-1">
                  Booking Reference
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 mb-2 break-all">
                  {reference}
                </h2>
                <p className="text-xs text-stone-500">
                  Present this reference at the cinema entrance or box office.
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-dashed border-[#c77e3b]/30 text-center text-xs text-stone-500">
              Thank you for choosing CinemaOS. Enjoy your movie experience!
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
            title="Print"
          />
          <Button
            variant="outline"
            onClick={() => window.print()}
            icon={<Download className="w-4 h-4" />}
            title="Download"
          />
          <Button
            variant="outline"
            icon={<Share2 className="w-4 h-4" />}
            title="Share"
          />
          <Button
            variant="primary"
            onClick={() => navigate(allRoutes.tickets)}
            title="New Sale"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
