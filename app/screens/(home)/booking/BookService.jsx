import { MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Animated, Easing, StatusBar, StyleSheet, View } from "react-native";
import { Appbar, Button, ProgressBar, useTheme } from "react-native-paper";
import EmptyState from "../../../components/common/EmptyState";
import { ROUTES } from "../../../helpers/routePaths";
import useBookingStore from "../../../store/useBookingStore";
import Step1 from "./Step1";
import Step2 from "./Step2";

export default function AddPropertyWizard() {
  const booking = useBookingStore((state) => state.booking);
  const selectedServices = booking.selectedServices;

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
  const prevBorder = dark ? colors.onPrimary : colors.primary;
  const prevText = dark ? colors.onPrimary : colors.primary;

  const animateStepChange = useCallback(
    (nextStep) => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => {
        setStep(nextStep);
        translateX.setValue(nextStep > step ? 100 : -100);
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
        ]).start();
      });
    },
    [opacity, step, translateX]
  );

  const next = () => formRef.current?.submitForm();
  const back = () => {
    if (step > 0) {
      animateStepChange(step - 1);
    }
  };

  const onStepSubmit = async (values) => {
    if (step === 0) {
      setServiceTime(values.serviceTime);
      animateStepChange(1);
    } else {
      clearBooking();
      navigation.replace(ROUTES.HOME);
    }
  };
  if (selectedServices.length === 0)
    return (
      <View style={styles.emptyWrapper}>
        <EmptyState
          icon={MaterialIcons}
          iconSize={80}
          iconColor={colors.placeholder}
          title="No Services Selected"
          description="You haven’t selected any services yet. Please select a service to continue."
          buttonLabel="Browse Services"
          onButtonPress={() => router.replace(ROUTES.SERVICE_LISTING)}
        />
      </View>
    );
  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={colors.secondary}
      />
      <Appbar.Header style={{ backgroundColor: colors.primary }}>
        {step > 0 && <Appbar.BackAction onPress={back} color={prevText} />}
        <Appbar.Content
          title={`Step ${step + 1} of 2`}
          titleStyle={{ color: colors.onPrimary }}
        />
      </Appbar.Header>

      <ProgressBar
        progress={(step + 1) / 2}
        color={progressColor}
        style={styles.progress}
      />

      <Animated.View
        style={{
          flex: 1,
          opacity,
          transform: [{ translateX }],
        }}
      >
        {step === 0 && <Step1 ref={formRef} onSubmit={onStepSubmit} />}
        {step === 1 && <Step2 ref={formRef} onSubmit={onStepSubmit} />}
      </Animated.View>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={back}
          disabled={step === 0}
          style={[
            styles.prevBtn,
            { borderColor: step === 0 ? colors.surfaceDisabled : prevBorder },
          ]}
          labelStyle={{
            color: step === 0 ? colors.onSurfaceDisabled : prevText,
          }}
        >
          Previous
        </Button>

        <Button
          mode="contained"
          onPress={next}
          style={[styles.nextBtn, { backgroundColor: nextBg }]}
          labelStyle={{ color: nextText }}
        >
          {step === 1 ? "Finish" : "Next"}
        </Button>
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
  nextBtn: {
    flex: 0.45,
    justifyContent: "center",
  },
  emptyWrapper: { flex: 1, padding: 16 },
});
