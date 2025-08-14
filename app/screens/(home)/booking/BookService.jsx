import { useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";

import CenteredAppbarHeader from "../../../components/common/CenteredAppBar";
import AppForm from "../../../components/forms/AppForm";
import SubmitButton from "../../../components/forms/AppSubmitButton";
import AppFormServiceTimePicker from "../../../components/forms/BookService/AppFormServiceTimePicker";

const validationSchema = Yup.object().shape({});

export default function SetEmailScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const handleSubmit = (values) => {
    console.log("values:", values);
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Book Service"}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppForm
          initialValues={{ serviceTime: {} }}
          onSubmit={handleSubmit}
          validationSchema={null}
        >
          <AppFormServiceTimePicker name="serviceTime" />
          <SubmitButton title="Confirm & Pay" />
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
