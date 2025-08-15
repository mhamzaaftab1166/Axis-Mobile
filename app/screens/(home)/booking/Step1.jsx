import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

import EmptyState from "../../../components/common/EmptyState";
import AppFormServiceTimePicker from "../../../components/forms/BookService/AppFormServiceTimePicker";
import ServiceCardList from "../../../components/home/services/ServiceCardList";
import { ROUTES } from "../../../helpers/routePaths";
import { bookingValidationSchema } from "../../../helpers/validations";
import useBookingStore from "../../../store/useBookingStore";

export default forwardRef(function Step1({ onSubmit }, ref) {
  const { colors } = useTheme();

  const booking = useBookingStore((state) => state.booking); // ✅ get full booking
  const selectedServices = booking.selectedServices;
  const toggleService = useBookingStore((state) => state.toggleService);

  let formikRef;
  useImperativeHandle(ref, () => ({
    submitForm: () => formikRef.handleSubmit(),
  }));

  return (
    <Formik
      innerRef={(f) => (formikRef = f)}
      initialValues={{
        serviceTime: booking.serviceTime || {}, // ✅ pre-fill from store
      }}
      enableReinitialize // ✅ so it refreshes if store changes
      onSubmit={onSubmit}
      validationSchema={bookingValidationSchema}
    >
      {() => (
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {selectedServices.length === 0 ? (
            <View style={styles.emptyWrapper}>
              <EmptyState
                icon={MaterialIcons}
                iconSize={80}
                iconColor={colors.placeholder}
                title="No Services Selected"
                description="You haven’t selected any services yet. Please select a service to continue."
                buttonLabel="Browse Services"
                onButtonPress={() => router.replace(ROUTES.SERVICE_LISTING)}
              />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 8,
                  color: colors.text,
                }}
              >
                Services
              </Text>
              {selectedServices.map((service) => (
                <ServiceCardList
                  key={service.id}
                  service={service}
                  isSelected={true}
                  onToggleSelect={toggleService}
                />
              ))}

              {/* ✅ This will now show stored time */}
              <AppFormServiceTimePicker name="serviceTime" />
            </ScrollView>
          )}
        </View>
      )}
    </Formik>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyWrapper: { flex: 1, padding: 16 },
  scrollContent: { padding: 16, paddingBottom: 32 },
});
