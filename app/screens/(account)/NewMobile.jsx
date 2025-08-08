import { router, useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";

import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import AppForm from "../../components/forms/AppForm";
import AppPhoneFormField from "../../components/forms/AppPhoneFormField";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { ROUTES } from "../../helpers/routePaths";

const validationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Mobile number is required")
    .matches(
      /^\+9715[0-9]{8}$/,
      "Enter a valid UAE mobile number (+9715XXXXXXXX)"
    ),
});

export default function SetPasswordScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const handleSubmit = (values) => {
    console.log("Phone values:", values);
    router.replace({
      pathname: ROUTES.OTP_SCREEN,
      params: { isMobile: true },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Change Mobile"}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppForm
          initialValues={{ phone: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppPhoneFormField name="phone" />
          <SubmitButton title="Update Mobile" />
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
