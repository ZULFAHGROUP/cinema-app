interface StepIndicatorProps {
  currentStep: string;
}

const steps = [
  { key: "movie-selection", label: "Choose Movie" },
  { key: "showtime-selection", label: "Pick Showtime" },
  { key: "purchase-selection", label: "Seats & Snacks" },
  { key: "payment-summary", label: "Checkout" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="bg-white rounded-2xl border border-[#c77e3b]/15 p-4 shadow-2xs mb-6">
      <div className="flex items-center justify-between gap-2 text-sm overflow-x-auto">
        {steps.map((step, index) => {
          const isCurrent = currentStep === step.key;
          const isDone = index < currentIndex;
          return (
            <div key={step.key} className="flex items-center gap-3 flex-1 min-w-fit">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all duration-300 shrink-0 ${
                    isCurrent
                      ? "bg-[#c77e3b] text-white ring-4 ring-[#c77e3b]/20 shadow-md"
                      : isDone
                      ? "bg-[#754f2c] text-white"
                      : "bg-[#fff8ea] text-stone-500 border border-[#c77e3b]/20"
                  }`}
                >
                  {isDone ? "✓" : index + 1}
                </div>
                <span
                  className={`whitespace-nowrap text-xs md:text-sm transition-colors duration-300 ${
                    isCurrent
                      ? "text-[#c77e3b] font-extrabold"
                      : isDone
                      ? "text-stone-800 font-semibold"
                      : "text-stone-400 font-medium"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 min-w-8 h-1 rounded-full transition-colors duration-300 ${
                    isDone ? "bg-[#c77e3b]" : "bg-stone-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
