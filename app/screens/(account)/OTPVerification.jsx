import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Formik } from "formik";
import { useRef } from "react";
import {
  TextInput as RNTextInput,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Appbar, useTheme } from "react-native-paper";

import SubmitButton from "../../components/forms/AppSubmitButton";

export default function SetEmailScreen() {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();
  const { isMobile } = useLocalSearchParams();

  const screenBg = dark ? colors.primary : colors.background;
  const textColor = dark ? colors.onPrimary : colors.onSurface;

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (text, index, values, setFieldValue) => {
    if (text.length > 1) return;
    const field = `digit${index + 1}`;
    setFieldValue(field, text);

    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index, values) => {
    const currentField = `digit${index + 1}`;
    if (
      e.nativeEvent.key === "Backspace" &&
      values[currentField] === "" &&
      index > 0
    ) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (values) => {
    const code = values.digit1 + values.digit2 + values.digit3 + values.digit4;
    console.log("OTP Code:", code);
    router.dismissTo("screens/(account)/SettingsScreen");
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={colors.secondary}
      />
      <Appbar.Header style={{ backgroundColor: colors.primary }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.onPrimary}
        />
        <Appbar.Content
          title="OTP Verification"
          titleStyle={{ color: colors.onPrimary }}
        />
      </Appbar.Header>

      <View style={styles.content}>
        <Text style={[styles.infoText, { color: textColor }]}>
          Please enter the 4-digit code sent to your{" "}
          {isMobile ? "new number" : "email"}.
        </Text>

        <Formik
          initialValues={{
            digit1: "",
            digit2: "",
            digit3: "",
            digit4: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <>
              <View style={styles.otpContainer}>
                {["digit1", "digit2", "digit3", "digit4"].map(
                  (field, index) => (
                    <RNTextInput
                      key={field}
                      ref={inputRefs[index]}
                      style={[
                        styles.otpInput,
                        {
                          borderColor: colors.outline,
                          color: textColor,
                        },
                      ]}
                      value={values[field]}
                      onChangeText={(text) =>
                        handleChange(text, index, values, setFieldValue)
                      }
                      onKeyPress={(e) => handleKeyPress(e, index, values)}
                      keyboardType="number-pad"
                      maxLength={1}
                      textAlign="center"
                      placeholder="-"
                      placeholderTextColor={colors.outline}
                      autoFocus={index === 0}
                    />
                  )
                )}
              </View>

              <SubmitButton title="Verify" />
            </>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    width: "80%",
  },
  otpInput: {
    borderBottomWidth: 2,
    fontSize: 24,
    width: 50,
    height: 60,
    marginHorizontal: 5,
  },
});
