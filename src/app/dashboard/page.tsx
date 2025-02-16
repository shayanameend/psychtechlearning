"use client";

import { useState } from "react";

import { Button } from "~/components/ui/button";
import { Steps } from "~/components/ui/steps";
import { cn } from "~/lib/utils";

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [1, 2, 3, 4];

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
      <section
        className={cn(
          "py-2 px-6 lg:px-10 lg:pb-6 min-h-[calc(100svh_-_4.5rem)] lg:min-h-[calc(100svh_-_6.5rem)] flex flex-col lg:flex-row",
        )}
      >
        <aside>
          <Steps steps={steps} currentStep={currentStep} />
        </aside>
        <main className={cn("flex-1 py-2 lg:py-0 lg:px-2 flex flex-col")}>
          <section className={cn("flex-1 text-center")}>
            Step {currentStep}
          </section>
          <footer>
            <div className="space-x-4 flex justify-end">
              <Button onClick={handlePrev} disabled={currentStep === 1}>
                Prev
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length ? "Finish" : "Next"}
              </Button>
            </div>
          </footer>
        </main>
      </section>
    </>
  );
}
