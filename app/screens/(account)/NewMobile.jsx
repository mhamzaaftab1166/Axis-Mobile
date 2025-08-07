import { router, useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import * as Yup from "yup";

import AppForm from "../../components/forms/AppForm";
import AppPhoneFormField from "../../components/forms/AppPhoneFormField";
import SubmitButton from "../../components/forms/AppSubmitButton";

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
  const { colors, dark } = useTheme();

  const screenBg = dark ? colors.primary : colors.background;

  const handleSubmit = (values) => {
    console.log("Phone values:", values);
    router.replace({
      pathname: "screens/(account)/OTPVerification",
      params: { isMobile: true },
    });
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
          title="Set Mobile Number"
          titleStyle={{ color: colors.onPrimary }}
        />
      </Appbar.Header>

      <View style={styles.content}>
        <AppForm
          initialValues={{ phone: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppPhoneFormField name="phone" />
          <SubmitButton title="Update Mobile Number" />
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
