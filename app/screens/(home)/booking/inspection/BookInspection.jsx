// AddPropertyWizard.jsx
import { useRef, useState } from "react";
import WizardLayout from "../../../../components/common/WizardLayout";
import InspectionStep1 from "./InspectionStep1";
import InspectionStep2 from "./InspectionStep2";

export default function AddPropertyWizard() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [inspectionType, setInspectionType] = useState(null);
  const stepRef = useRef(null);

  const handleNext = () => {
    stepRef.current?.submitForm();
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = (values) => {
    console.log(`Step ${step + 1} submitted:`, values);

    if (step === 0) {
      // Step 1 data (booking details)
      setFormData(values);
      setInspectionType(values.inspectionType);
      setStep(1);
    } else if (step === 1) {
      // Combine Step 1 + Step 2 data
      const finalPayload = { ...formData, ...values };
      console.log("Final submission payload:", finalPayload);
      // You can send finalPayload to API here
    }
  };

  const showNextButton =
    step === 0 || (step === 1 && inspectionType === "online");

  return (
    <WizardLayout
      step={step}
      totalSteps={2}
      onNext={handleNext}
      onPrevious={handlePrev}
      isLoading={false}
      isBooking={false}
      showError={false}
      error=""
      nextLabel={step === 1 ? "Submit" : "Next"}
      prevLabel="Previous"
      showNext={showNextButton}
    >
      {step === 0 ? (
        <InspectionStep1 ref={stepRef} onSubmit={handleSubmit} />
      ) : (
        <InspectionStep2
          ref={stepRef}
          onSubmit={handleSubmit}
          inspectionType={inspectionType}
          bookingData={formData}
        />
      )}
    </WizardLayout>
  );
}
