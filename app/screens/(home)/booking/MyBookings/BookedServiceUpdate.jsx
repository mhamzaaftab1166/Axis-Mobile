import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import {
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
import AppFormServiceTimePicker from "../../../../components/forms/BookService/AppFormServiceTimePicker";
import ResetServiceTimeOnSelectedServicesChange from "../../../../components/forms/BookService/AppFormServiceTimePicker/ResetServiceTimeOnSelectedServiceChange";
import SelectedServiceCard from "../../../../components/home/services/SelectedServiceCard";
import LoadingOverlay from "../../../../components/LoadingOverlay";
import { buildServiceOptions } from "../../../../helpers/general";
import { ROUTES } from "../../../../helpers/routePaths";
import { useGetAllServices } from "../../../../hooks/useServiceQuery";
import useBookingUpdateStore from "../../../../store/useBookingStoreUpdate";

export default function SetEmailScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const serviceData = JSON.parse(params.bookedService);

  const screenBg = colors.background;

  const { allServices: services, isLoading } = useGetAllServices();
  let serviceOptions = buildServiceOptions(services ? services : []);

  const removeService = useBookingUpdateStore((state) => state.removeService);
  const addService = useBookingUpdateStore((state) => state.addService);
  const clearBooking = useBookingUpdateStore((state) => state.clearBooking);
  const booking = useBookingUpdateStore((state) => state.booking);
  const selectedServices = booking.selectedServices;

  const selectedAddress = { unitId: { unitCapacity: 2 } };

  const handleCategoryPress = (category) => {
    router.push({
      pathname: ROUTES.SERVICE_LISTING_BY_CATEGORY_UPDATE,
      params: { selectedItem: category.value },
    });
  };

  useEffect(() => {
    if (serviceData?.services?.length > 0) {
      serviceData.services.forEach((s) => addService(s));
    }

    return () => {
      if (serviceData?.services?.length > 0) {
        serviceData.services.forEach((s) => removeService(s));
      }
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <LoadingOverlay visible={isLoading} />
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Update Service"}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <AppForm
            initialValues={{ serviceTime: serviceData?.serviceTime }}
            onSubmit={() => null}
            validationSchema={null}
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
          </AppForm>
        </ScrollView>
      </View>
    </View>
  );
}

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
});
