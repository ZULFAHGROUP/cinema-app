interface StepIndicatorProps {
  currentStep: string;
}

const steps = [
  { key: "movie-selection", label: "Movie" },
  { key: "showtime-selection", label: "Showtime" },
  { key: "purchase-selection", label: "Purchase" },
  { key: "payment-summary", label: "Payment" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  currentStep === step.key
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg"
                    : index < currentIndex
                    ? "bg-primary text-primary-foreground opacity-80"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {index < currentIndex ? "✓" : index + 1}
              </div>
              <span
                className={`font-sans whitespace-nowrap transition-colors duration-300 ${
                  currentStep === step.key
                    ? "text- font-bold text-base"
                    : index < currentIndex
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 rounded-full transition-colors duration-300 ${
                index < currentIndex ? "bg-primary" : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
