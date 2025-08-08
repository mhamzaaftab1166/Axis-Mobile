import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Formik } from "formik";
import { useRef } from "react";
import {
  Platform,
  TextInput as RNTextInput,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { ROUTES } from "../../helpers/routePaths";

const INPUT_HEIGHT = 56;

export default function SetEmailScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { isMobile } = useLocalSearchParams();
  const screenBg = colors.background;
  const textColor = colors.text;

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const otpSchema = Yup.object()
    .shape({
      digit1: Yup.string()
        .required("Input Required")
        .matches(/^\d$/, "Must be a single digit"),
      digit2: Yup.string()
        .required("Input Required")
        .matches(/^\d$/, "Must be a single digit"),
      digit3: Yup.string()
        .required("Input Required")
        .matches(/^\d$/, "Must be a single digit"),
      digit4: Yup.string()
        .required("Input Required")
        .matches(/^\d$/, "Must be a single digit"),
    })
    .test(
      "all-digits",
      "Enter all 4 digits",
      (vals) =>
        vals &&
        ["digit1", "digit2", "digit3", "digit4"].every(
          (k) => typeof vals[k] === "string" && /^\d$/.test(vals[k])
        )
    );

  const focusNext = (index) => {
    if (index < 3) {
      inputRefs[index + 1].current?.focus();
    } else {
      inputRefs[index].current?.blur();
    }
  };

  const setCursorToEnd = (ref, value) => {
    if (!ref?.current) return;
    try {
      setTimeout(() => {
        ref.current?.setNativeProps?.({
          selection: { start: (value || "").length, end: (value || "").length },
        });
      }, 0);
    } catch (e) {}
  };

  const handleChange = (text, index, setFieldValue) => {
    if (text.length > 1) text = text.slice(-1);
    const value = text.replace(/[^0-9]/g, "");
    const field = `digit${index + 1}`;
    setFieldValue(field, value);
    if (value) focusNext(index);
    setCursorToEnd(inputRefs[index], value);
  };

  const handleKeyPress = (e, index, values) => {
    const currentField = `digit${index + 1}`;
    if (
      e.nativeEvent.key === "Backspace" &&
      values[currentField] === "" &&
      index > 0
    ) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (values) => {
    const code = values.digit1 + values.digit2 + values.digit3 + values.digit4;
    console.log("OTP Code:", code);
    router.dismissTo(ROUTES.SETTINGS);
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"OTP Verification"}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={[styles.infoText, { color: textColor }]}>
          Please enter the 4-digit code sent to your{" "}
          {isMobile ? "new number" : "email"}.
        </Text>

        <Formik
          initialValues={{ digit1: "", digit2: "", digit3: "", digit4: "" }}
          validationSchema={otpSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            setFieldValue,
            handleSubmit: formikSubmit,
            isSubmitting,
            submitCount,
            errors,
          }) => (
            <>
              <View style={styles.otpContainer}>
                {["digit1", "digit2", "digit3", "digit4"].map(
                  (field, index) => {
                    const val = values[field] || "";
                    return (
                      <View
                        key={field}
                        style={[
                          styles.inputWrap,
                          { borderBottomColor: colors.outlineVariant },
                        ]}
                      >
                        {val === "" && (
                          <Text
                            pointerEvents="none"
                            style={[
                              styles.emptyDash,
                              { color: colors.outlineVariant },
                            ]}
                          >
                            -
                          </Text>
                        )}

                        <RNTextInput
                          ref={inputRefs[index]}
                          value={val}
                          onChangeText={(text) =>
                            handleChange(text, index, setFieldValue)
                          }
                          onKeyPress={(e) => handleKeyPress(e, index, values)}
                          keyboardType={
                            Platform.OS === "android" ? "numeric" : "number-pad"
                          }
                          maxLength={1}
                          autoCorrect={false}
                          allowFontScaling={false}
                          autoComplete={
                            Platform.OS === "android" ? "off" : "off"
                          }
                          textContentType={
                            Platform.OS === "ios" ? "oneTimeCode" : "none"
                          }
                          style={[
                            styles.otpInput,
                            { color: textColor },
                            Platform.OS === "android"
                              ? styles.androidInputFix
                              : styles.iosInputFix,
                          ]}
                          placeholder=""
                          selectionColor={colors.primary}
                          onFocus={() => setCursorToEnd(inputRefs[index], val)}
                        />
                        <TouchableOpacity
                          activeOpacity={1}
                          style={StyleSheet.absoluteFill}
                          onPress={() => inputRefs[index].current?.focus()}
                        />
                      </View>
                    );
                  }
                )}
              </View>

              {submitCount > 0 && Object.keys(errors).length > 0 && (
                <Text style={{ color: "red", marginBottom: 10 }}>
                  {errors.digit1 ||
                    errors.digit2 ||
                    errors.digit3 ||
                    errors.digit4 ||
                    "Please enter 4 digits"}
                </Text>
              )}

              <SubmitButton
                title="Verify OTP"
                onPress={formikSubmit}
                disabled={isSubmitting}
              />
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, alignItems: "center" },
  infoText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    width: "80%",
  },
  inputWrap: {
    width: 50,
    height: INPUT_HEIGHT,
    marginHorizontal: 5,
    justifyContent: "center",
    borderBottomWidth: 2,
  },
  otpInput: {
    width: "100%",
    height: INPUT_HEIGHT,
    fontSize: 24,
    padding: 0,
    textAlign: "center",
    backgroundColor: "transparent",
  },
  emptyDash: {
    position: "absolute",
    alignSelf: "center",
    top: (INPUT_HEIGHT - 24) / 2,
    fontSize: 24,
  },
  androidInputFix: {
    textAlignVertical: "center",
    paddingVertical: 0,
    includeFontPadding: false,
    lineHeight: 24,
    paddingBottom: 6,
  },
  iosInputFix: {
    paddingTop: 0,
    paddingBottom: 8,
    lineHeight: 24,
  },
});
