import { router, useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import * as Yup from "yup";

import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import SubmitButton from "../../components/forms/AppSubmitButton";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

export default function SetEmailScreen() {
  const navigation = useNavigation();
  const { colors, dark } = useTheme();

  const screenBg = dark ? colors.primary : colors.background;

  const handleSubmit = (values) => {
    console.log("Email values:", values);
    router.replace("screens/(account)/OTPVerification");
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
          title="Set Email"
          titleStyle={{ color: colors.onPrimary }}
        />
      </Appbar.Header>

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

          <SubmitButton title="Update Email" />
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
