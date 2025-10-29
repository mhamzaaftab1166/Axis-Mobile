import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, StatusBar, StyleSheet, View } from "react-native";
import { Button, ProgressBar, useTheme } from "react-native-paper";
import AppErrorMessage from "../forms/AppErrorMessage";
import LoadingOverlay from "../LoadingOverlay";
import CenteredAppbarHeader from "./CenteredAppBar";

export default function WizardLayout({
  step = 0,
  totalSteps = 1,
  onBack = () => {},
  onNext = () => {},
  onPrevious = () => {},
  children = null,
  isLoading = false,
  isBooking = false,
  showError = false,
  error = "",
  footerDisabledNext = false,
  footerDisabledPrev = false,
  nextLabel = "Next",
  prevLabel = "Previous",
  nextBgColor,
  nextTextColor,
  progressColor,
  statusBarStyle = "light-content",
  headerTitlePrefix = "Step",
  requireFullWidthPrev = false,
}) {
  const { colors, dark } = useTheme();

  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const prevStepRef = useRef(step);

  const progressCol =
    progressColor ?? (dark ? colors.onPrimary : colors.secondary);
  const nextBg = nextBgColor ?? colors.tertiary;
  const nextText = nextTextColor ?? colors.onPrimary;

  const animateOnStepChange = useCallback(
    (nextStep) => {
      const forward = nextStep > prevStepRef.current;
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => {
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
      prevStepRef.current = nextStep;
    },
    [opacity, translateX]
  );

  useEffect(() => {
    animateOnStepChange(step);
  }, [step, animateOnStepChange]);

  const renderContent = () => {
    if (Array.isArray(children)) {
      return children[step] ?? null;
    }
    if (typeof children === "function") {
      return children({ step });
    }
    return children || null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.secondary} />

      <LoadingOverlay visible={isLoading || isBooking} />

      <CenteredAppbarHeader
        title={`${headerTitlePrefix} ${step + 1} of ${totalSteps}`}
        onBack={onBack}
      />

      <ProgressBar
        progress={(step + 1) / totalSteps}
        color={progressCol}
        style={styles.progress}
      />

      <View style={styles.errorWrap}>
        <AppErrorMessage visible={showError} error={error} />
      </View>

      <Animated.View style={{ flex: 1, opacity, transform: [{ translateX }] }}>
        {renderContent()}
      </Animated.View>

      <View style={styles.footer}>
        <Button
          mode={
            requireFullWidthPrev && step === totalSteps - 1
              ? "outlined"
              : "outlined"
          }
          onPress={onPrevious}
          disabled={footerDisabledPrev || step === 0 || isBooking}
          style={[
            step === totalSteps - 1 && requireFullWidthPrev
              ? [styles.fullWidthBtn, { borderColor: colors.tertiary }]
              : [
                  styles.prevBtn,
                  {
                    borderColor:
                      step === 0 ? colors.surfaceDisabled : colors.tertiary,
                  },
                ],
          ]}
          labelStyle={{
            color: step === 0 ? colors.onSurfaceDisabled : colors.tertiary,
          }}
        >
          {prevLabel}
        </Button>

        {step < totalSteps - 1 && (
          <Button
            mode="contained"
            onPress={onNext}
            disabled={footerDisabledNext || isBooking}
            style={[
              styles.nextBtn,
              {
                backgroundColor: footerDisabledNext ? "#ccc" : nextBg,
              },
            ]}
            labelStyle={{ color: footerDisabledNext ? "#666" : nextText }}
          >
            {nextLabel}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progress: { height: 4 },
  errorWrap: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  prevBtn: { flex: 0.45, borderWidth: 1 },
  nextBtn: { flex: 0.45, justifyContent: "center" },
  fullWidthBtn: { flex: 1, borderWidth: 1 },
});
