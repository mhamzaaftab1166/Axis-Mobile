import { router, useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";

import { useState } from "react";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import AppErrorMessage from "../../components/forms/AppErrorMessage";
import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { ROUTES } from "../../helpers/routePaths";
import { useUpdateMyPassword } from "../../hooks/useProfileQuery";

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

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { mutate: updateMyPassword, isPending: isUpdating } = useUpdateMyPassword({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      router.dismissTo(ROUTES.SETTINGS);
    },
  });

  const handleSubmit = (values) => {
    updateMyPassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword
    });
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
          <View style={{ alignSelf: "center" }}>
            <AppErrorMessage error={error} visible={isError} />
          </View>
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

          <SubmitButton  isLoading={isUpdating} title="Change Password" />
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
