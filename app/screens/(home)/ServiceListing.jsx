import { MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import ButtonSegmented from "../../components/common/ButtonSegmented";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import EmptyState from "../../components/common/EmptyState";
import SearchBarWithToggle from "../../components/common/SearchBarWithToggle";
import SelectableChips from "../../components/common/SelectableChips";
import ServiceCardGrid from "../../components/home/services/ServiceCardGrid";
import ServiceCardList from "../../components/home/services/ServiceCardList";
import LoadingOverlay from "../../components/LoadingOverlay";
import { buildServiceOptions, filterServices } from "../../helpers/general";
import { ROUTES } from "../../helpers/routePaths";
import { useUserDetailQuery } from "../../hooks/useAuthQuery";
import { useGetAllInspectionServices } from "../../hooks/useInspectionServices";
import { useGetAllServices } from "../../hooks/useServiceQuery";
import useAddressStore from "../../store/useAddressStore";
import useBookingStore from "../../store/useBookingStore";

export default function ServiceListing() {

  const { userData, isLoading: fetchingUserData } = useUserDetailQuery();

  const { allServices: services, isLoading } = useGetAllServices(
    userData?.data?.user?.role
  );
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mode, setMode] = useState("direct_booking");

  const toggleService = useBookingStore((state) => state.toggleService);
  const isSelected = useBookingStore((state) => state.isSelected);

  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const { services: inspectionServices, isLoading: fetchingIspectionServices} = useGetAllInspectionServices(
    userData?.data?.user?.role
  );

  const filteredServices = filterServices(
    selectedCategories,
    mode === "direct_booking" ? services : inspectionServices,
    searchText
  );

  const handleBookInspection = (service) => {
    router.push({
      pathname: ROUTES.BOOK_SERVICE_INSPECTION,
      params: {
        service: JSON.stringify(service),
      },
    });
  };

  const handleToggle = (service) => {
    if (mode === "inspection_services") {
      handleBookInspection(service);
      return;
    }
    toggleService(service);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Service Listing"
        onBack={() => navigation.goBack()}
      />
      <View style={{ paddingHorizontal: 14 }}>
        <ButtonSegmented
          options={[
            { value: "direct_booking", label: "Direct Booking" },
            { value: "inspection_services", label: "Inspection First" },
          ]}
          selected={mode}
          onChange={(val) => setMode(val)}
        />
      </View>

      {(services?.length !== 0 && inspectionServices?.length !== 0) && (
        <View style={styles.controlsContainer}>
          <SelectableChips
            options={buildServiceOptions(mode === "direct_booking" ? services : inspectionServices)}
            selectedOptions={selectedCategories}
            onChange={setSelectedCategories}
          />
          <SearchBarWithToggle
            searchValue={searchText}
            onSearchChange={setSearchText}
            viewMode={viewMode}
            onToggleView={setViewMode}
          />
        </View>
      )}
      <LoadingOverlay visible={isLoading || fetchingUserData || fetchingIspectionServices} />
      <ScrollView contentContainerStyle={styles.content}>
        {filteredServices?.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <EmptyState
              icon={MaterialIcons}
              iconSize={80}
              iconColor={colors.placeholder}
              title="No Services Available"
              description="Currently, there are no services available. Please check back later."
            />
          </View>
        ) : viewMode === "grid" ? (
          <View style={styles.grid}>
            {filteredServices.map((service) => (
              <ServiceCardGrid
                key={service.id}
                service={service}
                isSelected={isSelected(service)}
                onToggleSelect={handleToggle}
                capacity={selectedAddress?.unitId?.unitCapacity}
                onBookInspection={handleBookInspection}
              />
            ))}
          </View>
        ) : (
          filteredServices.map((service) => (
            <ServiceCardList
              key={service.id}
              service={service}
              isSelected={isSelected(service)}
              onToggleSelect={handleToggle}
              capacity={selectedAddress?.unitId?.unitCapacity}
              onBookInspection={handleBookInspection}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controlsContainer: { paddingVertical: 8 },
  content: { paddingVertical: 8, paddingHorizontal: 16, flexGrow: 1 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
