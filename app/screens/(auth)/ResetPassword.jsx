import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
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
import { ROUTES } from "../../helpers/routePaths";
import { useUpdatePassword } from "../../hooks/useAuthQuery";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ResetPasswordScreen() {
  const { colors } = useTheme();

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { email } = useLocalSearchParams();

  const { mutate: updatePasswordReq, isPending: isUpdating } = useUpdatePassword({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      router.replace(ROUTES.LOGIN);
    }}
  );

  const handleSubmit = (values) => {
    updatePasswordReq({
      email: email,
      password: values.password
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
              Reset Password
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subText, { color: "white" }]}
            >
              Enter your new password below.
            </Text>
          </View>

          <View
            style={[styles.formCard, { backgroundColor: colors.background }]}
          >
            <AppForm
              initialValues={{ password: "", confirmPassword: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <View style={{
                alignSelf: "center"
              }}>
                <AppErrorMessage visible={isError} error={error}/>
              </View>
              <AppFormField
                name="password"
                placeholder="New Password"
                isPassword
                autoCapitalize="none"
                icon="lock-outline"
              />

              <AppFormField
                name="confirmPassword"
                placeholder="Confirm New Password"
                isPassword
                autoCapitalize="none"
                icon="lock-check-outline"
              />

              <SubmitButton isLoading={isUpdating} title="Reset Password" />
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
});
