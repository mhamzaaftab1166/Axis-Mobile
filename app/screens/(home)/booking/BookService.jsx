import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import CenteredAppbarHeader from "../../../components/common/CenteredAppBar";
import EmptyState from "../../../components/common/EmptyState"; // <- import reusable component
import AppForm from "../../../components/forms/AppForm";
import SubmitButton from "../../../components/forms/AppSubmitButton";
import AppFormServiceTimePicker from "../../../components/forms/BookService/AppFormServiceTimePicker";
import { ROUTES } from "../../../helpers/routePaths";
import { bookingValidationSchema } from "../../../helpers/validations";
import useBookingStore from "../../../store/useBookingStore"; // <- Zustand store

export default function BookService() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;
  const selectedServices = useBookingStore((state) => state.selectedServices);

  const handleSubmit = (values) => {
    console.log("values:", values);
  };

  const handleGoToServices = () => {
    navigation.navigate(ROUTES.SERVICE_LISTING);
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Book Service"}
        onBack={() => navigation.goBack()}
        cartDisplay={false}
      />

      <View style={styles.content}>
        {selectedServices.length === 0 ? (
          <EmptyState
            icon={MaterialIcons}
            iconSize={80}
            iconColor={colors.placeholder}
            title="No Services Selected"
            description="You haven’t selected any services yet. Please select a service to continue."
            buttonLabel="Browse Services"
            onButtonPress={handleGoToServices}
          />
        ) : (
          <AppForm
            initialValues={{ serviceTime: {} }}
            onSubmit={handleSubmit}
            validationSchema={bookingValidationSchema}
          >
            <AppFormServiceTimePicker name="serviceTime" />
            <SubmitButton title="Confirm & Pay" />
          </AppForm>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
