import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import AppFormServiceTimePicker from "../../../components/forms/BookService/AppFormServiceTimePicker";
import SelectedServiceCard from "../../../components/home/services/SelectedServiceCard";
import { serviceOptions } from "../../../helpers/contantData";
import { ROUTES } from "../../../helpers/routePaths";
import { bookingValidationSchema } from "../../../helpers/validations";
import useBookingStore from "../../../store/useBookingStore";

export default forwardRef(function Step1({ onSubmit }, ref) {
  const { colors } = useTheme();
  const router = useRouter();
  const removeService = useBookingStore((state) => state.removeService);
  const booking = useBookingStore((state) => state.booking);
  const selectedServices = booking.selectedServices;

  let formikRef;
  useImperativeHandle(ref, () => ({
    submitForm: () => formikRef.handleSubmit(),
  }));

  const handleCategoryPress = (category) => {
    router.push({
      pathname: ROUTES.SERVICE_LISTING_BY_CATEGORY,
      params: { selectedItem: category.value },
    });
  };

  return (
    <Formik
      innerRef={(f) => (formikRef = f)}
      initialValues={{ serviceTime: booking.serviceTime || {} }}
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
            <Text style={[styles.heading, { color: colors.text }]}>
              Available Categories
            </Text>
            {serviceOptions.map((category) => {
              const servicesInCategory = selectedServices.filter(
                (s) => s.category === category.value
              );
              return (
                <View key={category.value} style={{ marginBottom: 12 }}>
                  <TouchableOpacity
                    style={[
                      styles.categoryCard,
                      { backgroundColor: colors.surface },
                    ]}
                    onPress={() => handleCategoryPress(category)}
                  >
                    <View>
                      <Text
                        style={[styles.categoryName, { color: colors.text }]}
                      >
                        {category.label}
                      </Text>
                      <Text
                        style={[
                          styles.categorySubtitle,
                          { color: colors.placeholder },
                        ]}
                      >
                        {category.serviceCount} services available
                      </Text>
                    </View>
                    <MaterialIcons
                      name="arrow-forward-ios"
                      size={16}
                      color={colors.placeholder}
                    />
                  </TouchableOpacity>

                  {servicesInCategory.length > 0 &&
                    servicesInCategory.map((service) => (
                      <SelectedServiceCard
                        key={service.id}
                        service={service}
                        onRemove={removeService}
                      />
                    ))}
                </View>
              );
            })}

            {selectedServices.length > 0 && (
              <>
                <Text style={[styles.heading, { color: colors.text }]}>
                  Selected Services
                </Text>
                <AppFormServiceTimePicker name="serviceTime" />
              </>
            )}
          </ScrollView>
        </View>
      )}
    </Formik>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  heading: { fontSize: 20, marginBottom: 12, fontWeight: "600" },

  categoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
    elevation: 2,
  },
  categoryName: { fontSize: 16, fontWeight: "600" },
  categorySubtitle: { fontSize: 12, marginTop: 2 },

  serviceCardContainer: {
    marginLeft: 8,
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  serviceName: { fontSize: 14, fontWeight: "600" },
  servicePrice: { fontSize: 12, marginTop: 2, color: "#28a745" },
});
