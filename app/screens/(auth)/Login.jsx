import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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

import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { ROUTES } from "../../helpers/routePaths";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export default function LoginScreen() {
  const { colors } = useTheme();

  const handleSubmit = (values) => {
    console.log("Login values:", values);
    router.push(ROUTES.HOME);
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
              Sign in to Continue
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subText, { color: "white" }]}
            >
              Enter your email and password to access your account.
            </Text>
          </View>

          <View
            style={[styles.formCard, { backgroundColor: colors.background }]}
          >
            <AppForm
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <AppFormField
                name="email"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                icon={"email-outline"}
              />

              <AppFormField
                name="password"
                placeholder="Password"
                isPassword
                autoCapitalize="none"
                icon="lock-outline"
              />

              <SubmitButton title="Login" />

              <Text
                style={[styles.forgotText, { color: colors.primary }]}
                onPress={() => router.push(ROUTES.FORGOT_PASSWORD)}
              >
                Forgot Password?
              </Text>

              <Text style={[styles.signupText, { color: colors.text }]}>
                Don’t have an account?{" "}
                <Text
                  style={{ color: colors.primary, fontWeight: "600" }}
                  onPress={() => router.replace(ROUTES.REGISTER)}
                >
                  Sign up
                </Text>
              </Text>
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
