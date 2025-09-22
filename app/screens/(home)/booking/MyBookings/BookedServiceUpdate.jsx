import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";

import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";
import AppForm from "../../../../components/forms/AppForm";
import SubmitButton from "../../../../components/forms/AppSubmitButton";
import AppFormServiceTimePicker from "../../../../components/forms/BookService/AppFormServiceTimePicker";
import ResetServiceTimeOnSelectedServicesChange from "../../../../components/forms/BookService/AppFormServiceTimePicker/ResetServiceTimeOnSelectedServiceChange";
import SelectedServiceCard from "../../../../components/home/services/SelectedServiceCard";
import LoadingOverlay from "../../../../components/LoadingOverlay";
import { buildServiceOptions, buildUpdatePayload } from "../../../../helpers/general";
import { ROUTES } from "../../../../helpers/routePaths";
import { bookingValidationSchema } from "../../../../helpers/validations";
import { useUpdateBooking } from "../../../../hooks/useBookingQuery";
import { useGetAllServices } from "../../../../hooks/useServiceQuery";
import useAddressStore from "../../../../store/useAddressStore";
import useBookingUpdateStore from "../../../../store/useBookingStoreUpdate";

export default function UpdateBooking() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const serviceData = JSON.parse(params.bookedService);

  const { allServices: services, isLoading } = useGetAllServices();
  const serviceOptions = buildServiceOptions(services || []);

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { mutate: updateService, isPending: updatingService } = useUpdateBooking({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      router.push(ROUTES.HOME);
    },
    onRequirePayment: (data)=>{
      router.push({
        pathname: ROUTES.MAKE_PAYMENT,
        params: { amount: data, serviceId: serviceData?.id },
      });
    }
  });

  const removeService = useBookingUpdateStore((state) => state.removeService);
  const addService = useBookingUpdateStore((state) => state.addService);
  const booking = useBookingUpdateStore((state) => state.booking);
  const selectedServices = booking.selectedServices;

  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const handleCategoryPress = (category) => {
    router.push({
      pathname: ROUTES.SERVICE_LISTING_BY_CATEGORY_UPDATE,
      params: { selectedItem: category.value },
    });
  };

  useEffect(() => {
    if (serviceData?.services?.length > 0) {
      serviceData.services.forEach(addService);
    }
    return () => {
      if (serviceData?.services?.length > 0) {
        serviceData.services.forEach(removeService);
      }
    };
  }, []);

  const handleSubmit = (values) => {
    const updatedPayload = buildUpdatePayload(values,selectedServices,serviceData?.id,selectedAddress);
    updateService(updatedPayload);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LoadingOverlay visible={isLoading} />
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title="Update Service"
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AppForm
            initialValues={{ serviceTime: serviceData?.serviceTime }}
            onSubmit={handleSubmit}
            validationSchema={bookingValidationSchema}
          >
            <ResetServiceTimeOnSelectedServicesChange />

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
                        capacity={selectedAddress?.unitId?.unitCapacity}
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

            <View style={styles.submitButtonContainer}>
              <SubmitButton
                isLoading={updatingService}
                title="Confirm & Next"
                btnStyles={{ marginTop: 0 }}
              />
            </View>
          </AppForm>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 80 },
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
  submitButtonContainer: { marginTop: 16, marginBottom: 32 },
});
