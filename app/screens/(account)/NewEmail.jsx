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
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export default function SetEmailScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const handleSubmit = (values) => {
    console.log("Email values:", values);
    router.replace(ROUTES.OTP_SCREEN);
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
          <AppFormField
            name="email"
            placeholder="Enter New Email"
            icon="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <SubmitButton title="Change Email" />
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
