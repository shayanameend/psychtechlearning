import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export function Steps({
  steps,
  currentStep,
}: {
  steps: number[];
  currentStep: number;
}) {
  const [animatedStep, setAnimatedStep] = useState(currentStep);

  useEffect(() => {
    if (currentStep > animatedStep) {
      const timeout = setTimeout(() => {
        setAnimatedStep(currentStep);
      }, 300); // Adjust the duration as needed
      return () => clearTimeout(timeout);
    }

    setAnimatedStep(currentStep);
  }, [currentStep, animatedStep]);

  return (
    <>
      <div
        className={cn(
          "lg:-m-0.5 h-full w-full flex lg:flex-col items-center justify-center",
        )}
      >
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex lg:flex-col items-center",
              index < steps.length - 1 ? "flex-1" : "flex-none",
            )}
          >
            <div
              className={cn(
                "size-8 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                animatedStep >= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {step}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 size-1 transition-all duration-300",
                  animatedStep > step ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
