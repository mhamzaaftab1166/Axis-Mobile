import { Formik } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

import AppFormServiceTimePicker from "../../../components/forms/BookService/AppFormServiceTimePicker";
import ServiceCardList from "../../../components/home/services/ServiceCardList";
import { bookingValidationSchema } from "../../../helpers/validations";
import useBookingStore from "../../../store/useBookingStore";

export default forwardRef(function Step1({ onSubmit }, ref) {
  const { colors } = useTheme();

  const booking = useBookingStore((state) => state.booking);
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
        serviceTime: booking.serviceTime || {},
      }}
      enableReinitialize
      onSubmit={onSubmit}
      validationSchema={bookingValidationSchema}
    >
      {() => (
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
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
              Selected Services
            </Text>
            {selectedServices.map((service) => (
              <ServiceCardList
                key={service.id}
                service={service}
                isSelected={true}
                onToggleSelect={toggleService}
              />
            ))}

            <AppFormServiceTimePicker name="serviceTime" />
          </ScrollView>
        </View>
      )}
    </Formik>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  scrollContent: { padding: 16, paddingBottom: 32 },
});
