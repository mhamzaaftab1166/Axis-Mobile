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
import { useUpdateEmail } from "../../hooks/useProfileQuery";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export default function SetEmailScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { mutate: updateEmail, isPending: requestingUpdate } = useUpdateEmail({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: (email) => {
      setError("");
      setIsError(false);
      router.push({
        pathname: ROUTES.OTP_SCREEN,
        params: { email: email }, 
      });
    },
  });

  const handleSubmit = (values) => {
    updateEmail({
      newEmail: values.email
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Change Email"}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppForm
          initialValues={{
            email: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
         <View style={{
            alignSelf: "center",
          }}>
            <AppErrorMessage visible={isError} error={error} />
          </View>
          <AppFormField
            name="email"
            placeholder="Enter New Email"
            icon="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <SubmitButton isLoading={requestingUpdate} title="Change Email" />
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
