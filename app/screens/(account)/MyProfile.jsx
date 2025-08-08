import { router, useNavigation } from "expo-router";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import * as Yup from "yup";

import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import AppImagePickerField from "../../components/forms/AppImagePickerFeild";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { getGreeting } from "../../helpers/general";
import { ROUTES } from "../../helpers/routePaths";

const validationSchema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  profile_image: Yup.string().required("Profile image is required"),
});

export default function MyProfile() {
  const navigation = useNavigation();
  const { colors, fonts } = useTheme();

  const screenBg = colors.background;
  const textColor = colors.text;
  const disabledBg = colors.surfaceDisabled;
  const disabledText = colors.onSurfaceDisabled;

  const disabledTheme = {
    colors: {
      text: disabledText,
      disabled: disabledText,
      placeholder: disabledText,
      background: disabledBg,
      primary: disabledText,
    },
  };
  const user = {
    full_name: "Jane Doe",
    email: "jane@example.com",
    phone: "501234567",
  };

  const handleSubmit = ({ full_name, profile_image }) => {
    router.dismissTo(ROUTES.ACCOUNT_TAB);
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"My Profile"}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppForm
          initialValues={{ full_name: user.full_name, profile_image: "" }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppImagePickerField name="profile_image" />
          <Text
            style={[
              styles.greeting,
              { color: textColor, fontFamily: fonts.medium },
            ]}
          >
            👋 {getGreeting()}, {user.full_name.split(" ")[0]}
          </Text>
          <AppFormField
            name="full_name"
            label="Full Name"
            placeholder="Full Name"
            icon="account"
            parentStyles={styles.input}
            style={styles.inputInner}
          />
          <TextInput
            label="Email"
            mode="flat"
            value={user.email}
            disabled
            left={<TextInput.Icon icon="email" color={disabledText} />}
            style={[
              styles.input,
              { backgroundColor: disabledBg, marginTop: 10 },
            ]}
            theme={disabledTheme}
          />
          <TextInput
            label="Phone"
            mode="flat"
            value={user.phone}
            disabled
            left={<TextInput.Icon icon="phone" color={disabledText} />}
            style={[styles.input, { backgroundColor: disabledBg }]}
            theme={disabledTheme}
          />
          <SubmitButton title="Save Changes" style={styles.input} />
        </AppForm>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 16,
    alignItems: "center",
  },
  greeting: {
    fontSize: 22,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
  },
  input: {
    width: "100%",
    marginBottom: 16,
    height: 56,
  },
  inputInner: {},
});
