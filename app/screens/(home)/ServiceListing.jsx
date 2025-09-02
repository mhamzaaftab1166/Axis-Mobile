import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import EmptyState from "../../components/common/EmptyState";
import SearchBarWithToggle from "../../components/common/SearchBarWithToggle";
import SelectableChips from "../../components/common/SelectableChips";
import ServiceCardGrid from "../../components/home/services/ServiceCardGrid";
import ServiceCardList from "../../components/home/services/ServiceCardList";
import LoadingOverlay from "../../components/LoadingOverlay";
import { buildServiceOptions, filterServicesByCategories } from "../../helpers/general";
import { useGetAllServices } from "../../hooks/useServiceQuery";
import useBookingStore from "../../store/useBookingStore";

export default function ServiceListing() {
  const { selectedItem } = useLocalSearchParams();
  
  console.log("Selected item:", selectedItem);

  const { allServices: services, isLoading } = useGetAllServices();
  
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleService = useBookingStore((state) => state.toggleService);
  const isSelected = useBookingStore((state) => state.isSelected);
  const booking = useBookingStore((state) => state.booking);
  const selectedServices = booking.selectedServices;

  const filteredServices = filterServicesByCategories(selectedCategories, services, searchText);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Service Listing"
        onBack={() => navigation.goBack()}
      />
      {services?.length !== 0 && (
        <View style={styles.controlsContainer}>
          <SelectableChips
            options={buildServiceOptions(services ? services : [])}
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

      <LoadingOverlay visible={isLoading} />

      <ScrollView contentContainerStyle={styles.content}>
        {filteredServices?.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                onToggleSelect={toggleService}
              />
            ))}
          </View>
        ) : (
          filteredServices.map((service) => (
            <ServiceCardList
              key={service.id}
              service={service} 
              isSelected={isSelected(service)}
              onToggleSelect={toggleService}
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
