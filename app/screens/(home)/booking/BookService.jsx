import { useNavigation } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Animated, Easing, StatusBar, StyleSheet, View } from "react-native";
import { Button, ProgressBar, useTheme } from "react-native-paper";
import config from "../../../../config.json";
import CenteredAppbarHeader from "../../../components/common/CenteredAppBar";
import AppErrorMessage from "../../../components/forms/AppErrorMessage";
import { formatPayload } from "../../../helpers/general";
import { ROUTES } from "../../../helpers/routePaths";
import { useCreateBooking } from "../../../hooks/useBookingQuery";
import useAddressStore from "../../../store/useAddressStore";
import useBookingStore from "../../../store/useBookingStore";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

export default function AddPropertyWizard() {
  const booking = useBookingStore((state) => state.booking);
  const selectedServices = Array.isArray(booking?.selectedServices)
    ? booking.selectedServices
    : [];

  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const [step, setStep] = useState(0);
  const formRef = useRef();
  const setServiceTime = useBookingStore((state) => state.setServiceTime);
  const clearBooking = useBookingStore((state) => state.clearBooking);

  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const bg = colors.background;
  const progressColor = dark ? colors.onPrimary : colors.secondary;
  const nextBg = colors.tertiary;
  const nextText = colors.onPrimary;

  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const TOTAL_STEPS = 3;

  const animateStepChange = useCallback(
    (nextStep) => {
      const forward = nextStep > step;
      Animated.timing(opacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => {
        setStep(nextStep);
        translateX.setValue(forward ? 100 : -100);
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 260,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
        ]).start();
      });
    },
    [opacity, step, translateX]
  );

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [showOtpStep, setShowOtpStep] = useState(false);

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);

  const { mutate: bookMyService, isPending: isBooking } = useCreateBooking({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      clearBooking();
      navigation.replace(ROUTES.HOME);
    },
    onRequireAction: (clientSecret, methodId)=>{
      setShowOtpStep(true);
      setClientSecret(clientSecret);
      setPaymentMethodId(methodId);
    }
  });

  const next = () => formRef.current?.submitForm();
  const back = () => {
    if (step > 0) animateStepChange(step - 1);
  };

  const onStepSubmit = async (values) => {
    if (step === 0) {
      if (values?.serviceTime) setServiceTime(values.serviceTime);
      animateStepChange(1);
      return;
    }
    if (step === 1) {
      animateStepChange(2);
      return;
    }
    if (step === 2) {
      const formatted = formatPayload(values,selectedAddress,config.secretKeyForEncryption);
      bookMyService(formatted);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={colors.secondary}
      />

      <CenteredAppbarHeader
        title={`Step ${step + 1} of ${TOTAL_STEPS}`}
        onBack={() => navigation.goBack()}
      />

      <ProgressBar
        progress={(step + 1) / TOTAL_STEPS}
        color={progressColor}
        style={styles.progress}
      />

      <View style={{
        alignSelf: "center",
      }}>
        <AppErrorMessage visible={isError} error={error} />
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity,
          transform: [{ translateX }],
        }}
      >
        {step === 0 && <Step1 ref={formRef} onSubmit={onStepSubmit} />}
        {step === 1 && <Step2 ref={formRef} onSubmit={onStepSubmit} />}
        {step === 2 && <Step3  
          isBooking={isBooking}
          ref={formRef} onSubmit={onStepSubmit} 
          requireAction={showOtpStep}
        />}
      </Animated.View>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={back}
          disabled={step === 0}
          style={[
            step === TOTAL_STEPS - 1
              ? [styles.fullWidthBtn, { borderColor: colors.tertiary }]
              : [
                  styles.prevBtn,
                  {
                    borderColor:
                      step === 0 ? colors.surfaceDisabled : colors.tertiary,
                  },
                ],
          ]}
          theme={{
            colors: {
              outline: step === 0 ? colors.surfaceDisabled : colors.tertiary,
            },
          }}
          labelStyle={{
            color: step === 0 ? colors.onSurfaceDisabled : colors.tertiary,
          }}
        >
          Previous
        </Button>

        {step < TOTAL_STEPS - 1 && (
          <Button
            mode="contained"
            onPress={next}
            disabled={selectedServices.length === 0}
            style={[
              styles.nextBtn,
              {
                backgroundColor:
                  selectedServices.length === 0 ? "#ccc" : nextBg,
              },
            ]}
            labelStyle={{
              color: selectedServices.length === 0 ? "#666" : nextText,
            }}
          >
            Next
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progress: { height: 4 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  prevBtn: { flex: 0.45, borderWidth: 1 },
  nextBtn: { flex: 0.45, justifyContent: "center" },
  fullWidthBtn: { flex: 1, borderWidth: 1 },
  emptyWrapper: { flex: 1 },
});
