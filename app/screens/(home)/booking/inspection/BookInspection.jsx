// AddPropertyWizard.jsx
import { useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import config from "../../../../../config.json";
import WizardLayout from "../../../../components/common/WizardLayout";
import { buildInspectionFormData } from "../../../../helpers/general";
import { ROUTES } from "../../../../helpers/routePaths";
import { useBookInspectionService } from "../../../../hooks/useInspectionServices";
import { useStripeCancelledIntent, useStripeConfirmPayment } from "../../../../hooks/useStripeQuery";
import useAddressStore from "../../../../store/useAddressStore";
import InspectionStep1 from "./InspectionStep1";
import InspectionStep2 from "./InspectionStep2";

export default function AddPropertyWizard() {
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [inspectionType, setInspectionType] = useState(null);

  // submission
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [intentId, setIntentId] = useState(null);
  const [isWorkingOnStripe, setIsWorkingOnStripe] = useState(false);
  const [serviceId, setServiceId] = useState(null);

  const stepRef = useRef(null);

  useEffect(() => {
    // Cleanup when the user navigates away (unmount)
    return () => {
      setFormData({});
      setInspectionType(null);
      setStep(0);
    };
  }, []);

  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const { mutate: bookInspection, isPending: bookingInspectionServicerReq } = useBookInspectionService({
    onErrorCallback: (errMsg, serviceId) => {
      setError(errMsg);
      setIsError(true);
      if(serviceId){
        setServiceId(serviceId);
      }else{
        setServiceId(null);
      }
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      navigation.replace(ROUTES.HOME);
    },
    onRequireAction: (clientSecret, methodId, intentId)=>{
      console.log(clientSecret, methodId, intentId);
      setShowOtpStep(true);
      setClientSecret(clientSecret);
      setPaymentMethodId(methodId);
      setIntentId(intentId);
      setIsError(false);
      setError("");
    }
  });

  // stripe options
  const { mutate: cancelIntent, isPending: cancellingIntent } = useStripeCancelledIntent({
    onSuccessCallback: () => {
      navigation.replace(ROUTES.HOME);
    },
    onErrorCallback: (msg) => {
      setIsError(true);
      setError(msg);
    },
  });

  const { mutate: confirmPayment, isPending: isLoading  } = useStripeConfirmPayment({
    onSuccessCallback: (intentId) => {
      setIsWorkingOnStripe(false);
      if(intentId){
        cancelIntent({intentId});
      }else{
        navigation.replace(ROUTES.HOME);
      }
    },
    onErrorCallback: (msg) => {
      setIsError(true);
      setError(msg);
      setIsWorkingOnStripe(false);
    },
  });
  
  const handleNext = () => {
    stepRef.current?.submitForm();
  };

  const handlePrev = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = (values) => {
    if (step === 0) {
      setFormData(values);
      setInspectionType(values.inspectionType);
      setStep(1);
    } else if (step === 1) {
      const formattedPayload = buildInspectionFormData(formData,values,selectedAddress,config.secretKeyForEncryption,serviceId);
      bookInspection(formattedPayload);
    }
  };

  const initiateStripe = ()=>{
    setIsWorkingOnStripe(true);
    confirmPayment({clientSecret,pmtMethodId: paymentMethodId, intentId});
  }

  const showNextButton =
    step === 0 || (step === 1 && inspectionType === "online");

  return (
    <WizardLayout
      step={step}
      totalSteps={2}
      onNext={handleNext}
      onPrevious={handlePrev}
      isLoading={false}
      isBooking={bookingInspectionServicerReq}
      showError={isError}
      error={error}
      nextLabel={step === 1 ? "Submit" : "Next"}
      prevLabel="Previous"
      showNext={showNextButton}
    > 
      {step === 0 ? (
        <InspectionStep1
          ref={stepRef}
          onSubmit={handleSubmit}
          initialData={formData}
        />
      ) : (
        <InspectionStep2
          ref={stepRef}
          onSubmit={handleSubmit}
          inspectionType={inspectionType}
          bookingData={formData}
          isBooking={bookingInspectionServicerReq || isLoading || cancellingIntent}
          requireAction={showOtpStep}
          isWorkingOnStripe={isWorkingOnStripe}
          onConfirmPayment={initiateStripe}
        />
      )}
    </WizardLayout>
  );
}
