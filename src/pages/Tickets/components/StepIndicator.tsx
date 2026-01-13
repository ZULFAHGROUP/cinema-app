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
          <div key={step.key} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-serif flex-shrink-0 ${
                currentStep === step.key
                  ? "bg-primary text-primary-foreground"
                  : index < currentIndex
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`font-serif whitespace-nowrap ${
                currentStep === step.key
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-border flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
