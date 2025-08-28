import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import * as Yup from "yup";

import { useState } from "react";
import AppErrorMessage from "../../components/forms/AppErrorMessage";
import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { useResetPasswordRequest } from "../../hooks/useAuthQuery";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
});

export default function ForgotByEmailScreen() {
  const { colors } = useTheme();

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { mutate: resetPasswordRequest, isPending: isResetting } = useResetPasswordRequest({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
    }}
  );

  const handleSubmit = (values) => {
    resetPasswordRequest({
      email: values.email
    });
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
            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text
              variant="headlineSmall"
              style={[styles.heading, { color: "white" }]}
            >
              Email Verification
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subText, { color: "white" }]}
            >
              Enter your email to receive an OTP for verification.
            </Text>
          </View>

          <View
            style={[styles.formCard, { backgroundColor: colors.background }]}
          >
            <AppForm
              initialValues={{ email: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={{
                alignSelf: "center"
              }}>
                <AppErrorMessage visible={isError} error={error}/>
              </View>     
              <AppFormField
                name="email"
                placeholder="Email Your Email"
                keyboardType="email-address"
                autoCapitalize="none"
                icon={"email-outline"}
              />

              <SubmitButton isLoading={isResetting} title="Next" />
            </AppForm>
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
  logo: {
    width: 110,
    height: 110,
    marginBottom: 12,
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
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  forgotText: {
    textAlign: "right",
    marginTop: 7,
    fontWeight: "600",
  },
  signupText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
