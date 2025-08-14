import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import * as Yup from "yup";
import { ROUTES } from "../../helpers/routePaths";

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits"),
});

export default function OtpVerificationScreen() {
  const { colors } = useTheme();
  const [otpError, setOtpError] = useState("");
  const inputs = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const blinkAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [blinkAnim]);

  const params = useLocalSearchParams();
  const goToHome = params.goToHome === "true";

  const focusNext = (index, value) => {
    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const focusPrev = (index, key) => {
    if (key === "Backspace" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const setCursorToEnd = (ref, value) => {
    if (!ref) return;
    try {
      setTimeout(() => {
        ref?.setNativeProps?.({
          selection: { start: value.length, end: value.length },
        });
      }, 0);
    } catch {}
  };

  return (
    <LinearGradient
      colors={[colors.secondary, colors.primary]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Text
              variant="headlineSmall"
              style={[styles.heading, { color: colors.onPrimary }]}
            >
              Verify Your Account
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subText, { color: colors.onPrimary }]}
            >
              Enter the 6-digit code sent to your mobile number.
            </Text>
          </View>

          <View
            style={[styles.formCard, { backgroundColor: colors.background }]}
          >
            <Formik
              initialValues={{ otp: "" }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                setOtpError("");
                if (values.otp.length !== 6) {
                  setOtpError("OTP must be exactly 6 digits");
                  return;
                }
                console.log("OTP Verified:", values.otp);
                resetForm();

                goToHome
                  ? router.replace(ROUTES.HOME)
                  : router.replace(ROUTES.RESET_PASS);
              }}
            >
              {({ handleSubmit, setFieldValue, values, errors, touched }) => {
                const otpDigits = values.otp.split("");
                while (otpDigits.length < 6) otpDigits.push("");

                return (
                  <>
                    <View style={styles.otpContainer}>
                      {[0, 1, 2, 3, 4, 5].map((i) => {
                        const isEmpty = otpDigits[i] === "";
                        const showFauxCaret =
                          Platform.OS === "android" &&
                          isEmpty &&
                          focusedIndex === i;
                        return (
                          <View
                            key={i}
                            style={[
                              styles.inputWrapper,
                              { backgroundColor: colors.surface },
                            ]}
                          >
                            <TextInput
                              ref={(el) => (inputs.current[i] = el)}
                              style={[
                                styles.otpInput,
                                {
                                  borderColor: colors.primary,
                                  color: colors.text,
                                },
                              ]}
                              keyboardType={
                                Platform.OS === "android"
                                  ? "numeric"
                                  : "number-pad"
                              }
                              maxLength={1}
                              onChangeText={(text) => {
                                if (/^\d$/.test(text) || text === "") {
                                  const newOtp = otpDigits.slice();
                                  newOtp[i] = text;
                                  setFieldValue("otp", newOtp.join(""));
                                  if (text) {
                                    focusNext(i, text);
                                  }
                                  // keep native selection synced
                                  setCursorToEnd(inputs.current[i], text);
                                }
                              }}
                              onKeyPress={({ nativeEvent }) =>
                                focusPrev(i, nativeEvent.key)
                              }
                              onFocus={() => {
                                setFocusedIndex(i);
                                setCursorToEnd(
                                  inputs.current[i],
                                  otpDigits[i] || ""
                                );
                              }}
                              onBlur={() => setFocusedIndex(-1)}
                              value={otpDigits[i]}
                              returnKeyType="done"
                              textAlign="center"
                              autoFocus={i === 0}
                              selectionColor={colors.primary}
                              placeholder="•"
                              placeholderTextColor={colors.onSurfaceVariant}
                              allowFontScaling={false}
                              importantForAutofill="no"
                              // Hide native caret on Android only when empty (we render faux caret)
                              caretHidden={Platform.OS === "android" && isEmpty}
                              // remove possible interfering props:
                              // don't pass `selection` prop - we use setNativeProps instead
                            />

                            {showFauxCaret ? (
                              <Animated.View
                                pointerEvents="none"
                                style={[
                                  styles.fauxCaret,
                                  {
                                    opacity: blinkAnim,
                                    backgroundColor: colors.primary,
                                  },
                                ]}
                              />
                            ) : null}
                          </View>
                        );
                      })}
                    </View>

                    {(touched.otp && errors.otp) || otpError ? (
                      <RNText
                        style={[styles.errorText, { color: colors.error }]}
                      >
                        {errors.otp || otpError}
                      </RNText>
                    ) : null}

                    <Button
                      mode="contained"
                      onPress={handleSubmit}
                      style={[
                        styles.submitButton,
                        { backgroundColor: colors.primary },
                      ]}
                      labelStyle={{ color: colors.onPrimary }}
                    >
                      Verify OTP
                    </Button>
                  </>
                );
              }}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  heading: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subText: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.85,
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  // wrapper so we can overlay faux caret centered
  inputWrapper: {
    width: 50,
    height: 55,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  otpInput: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    paddingVertical: 0,
    paddingHorizontal: 0,
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },
  fauxCaret: {
    position: "absolute",
    width: 2,
    height: 22,
    borderRadius: 1,
    left: "50%",
    top: "50%",
    transform: [{ translateX: -1 }, { translateY: -11 }],
  },
  errorText: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 13,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
    paddingVertical: 6,
  },
});
