import { useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";
import AppForm from "../../../../components/forms/AppForm";
import SubmitButton from "../../../../components/forms/AppSubmitButton";

export default function SetEmailScreen() {
  const params = useLocalSearchParams();
  const serviceData = JSON.parse(params.bookedService);

  console.log(serviceData);

  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const handleSubmit = (values) => {};

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Update Service"}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppForm
          initialValues={{}}
          onSubmit={handleSubmit}
          validationSchema={null}
        >
          <SubmitButton title="Confirm & Next" />
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
