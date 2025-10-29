import { useState } from "react";
import WizardLayout from "../../../../components/common/WizardLayout";
import InspectionStep1 from "./InspectionStep1";

export default function AddPropertyWizard() {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, 1));
  };

  const handlePrev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <WizardLayout
      step={step}
      totalSteps={2}
      onBack={() => {}}
      onNext={handleNext}
      onPrevious={handlePrev}
      isLoading={false}
      isBooking={false}
      showError={false}
      error=""
      nextLabel="Next"
      prevLabel="Previous"
    >
      {[<InspectionStep1 key="s1" />]}
    </WizardLayout>
  );
}
