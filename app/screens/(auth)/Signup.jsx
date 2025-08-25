import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text as RNText,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import * as Yup from "yup";

import AppErrorMessage from "../../components/forms/AppErrorMessage";
import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import AppPhoneFormField from "../../components/forms/AppPhoneFormField";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { ROUTES } from "../../helpers/routePaths";
import { useRegisterQuery } from "../../hooks/useAuthQuery";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  name: Yup.string().required("Full name is required").min(2, "Too short"),
  phone: Yup.string()
    .required("Mobile number is required")
    .matches(
      /^\+9715[0-9]{8}$/,
      "Enter a valid UAE mobile number (+9715XXXXXXXX)"
    ),
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
});

export default function SignupScreen() {
  const { colors } = useTheme();

  const { mutateAsync: registerUser, isError: registerFailed, 
    error: errorObject, isPending: isSaving } = useRegisterQuery();

  const handleSubmit = async (values) => {
    registerUser(values);
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
              Create your Account
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subText, { color: "white" }]}
            >
              Please fill the form to get started.
            </Text>
          </View>

          <View
            style={[styles.formCard, { backgroundColor: colors.background }]}
          >
            <AppForm
              initialValues={{
                email: "",
                name: "",
                phone: "",
                password: ""
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppErrorMessage visible={registerFailed} error={errorObject?.response?.data?.error} />
              <AppFormField
                name="name"
                placeholder="Full Name"
                autoCapitalize="words"
                icon="account-outline"
              />

              <AppFormField
                name="email"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                icon="email-outline"
              />

              <AppFormField
                name="password"
                placeholder="Password"
                isPassword
                autoCapitalize="none"
                icon="lock-outline"
              />

              <AppPhoneFormField name="phone" />

              <SubmitButton isLoading={isSaving}  title="Sign Up" />

              <RNText style={[styles.loginText, { color: colors.text }]}>
                Already have an account?{" "}
                <Text
                  style={{ color: colors.primary, fontWeight: "600" }}
                  onPress={() => router.replace(ROUTES.LOGIN)}
                >
                  Login
                </Text>
              </RNText>
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
  loginText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
