import { router, useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";

import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { ROUTES } from "../../helpers/routePaths";

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &)"
    ),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Please confirm your new password"),
});

export default function SetPasswordScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const handleSubmit = (values) => {
    console.log("Password values:", values);
    router.dismissTo(ROUTES.SETTINGS);
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Change Password"}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppForm
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField
            name="currentPassword"
            placeholder="Current Password"
            isPassword
            autoCapitalize="none"
          />

          <AppFormField
            name="newPassword"
            placeholder="New Password"
            isPassword
            autoCapitalize="none"
          />

          <AppFormField
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            isPassword
            autoCapitalize="none"
          />

          <SubmitButton title="Change Password" />
        </AppForm>
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
  },
});
