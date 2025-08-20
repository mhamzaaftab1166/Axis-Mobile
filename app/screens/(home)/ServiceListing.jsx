import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import DummyImg from "../../../assets/dummy.jpg";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import SearchBarWithToggle from "../../components/common/SearchBarWithToggle";
import SelectableChips from "../../components/common/SelectableChips";
import ServiceCardGrid from "../../components/home/services/ServiceCardGrid";
import ServiceCardList from "../../components/home/services/ServiceCardList";
import useBookingStore from "../../store/useBookingStore";

const categories = [
  "Cleaning",
  "Repairing",
  "Plumbing",
  "Electrical",
  "Painting",
  "Gardening",
];

const services = [
  {
    id: "1",
    name: "Home Cleaning",
    image: DummyImg,
    rating: 4.5,
    price: 150,
    badge: "Popular",
    description:
      "Thorough cleaning for your entire home, including living areas, kitchen, and bathrooms.",
  },
  {
    id: "2",
    name: "Electrical Work",
    image: DummyImg,
    rating: 4.8,
    price: 200,
    badge: "Top Rated",
    description:
      "Professional electrical services for repairs, installations, and maintenance work.",
  },
  {
    id: "3",
    name: "Gardening Service",
    image: DummyImg,
    rating: 2.4,
    price: 120,
    badge: "Popular",
    description:
      "Lawn mowing, plant care, and garden maintenance to keep your outdoors looking great.",
  },
];

export default function ServiceListing() {
  const { selectedItem } = useLocalSearchParams();
  console.log("Selected item:", selectedItem);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleService = useBookingStore((state) => state.toggleService);
  const isSelected = useBookingStore((state) => state.isSelected);
  const booking = useBookingStore((state) => state.booking);
  const selectedServices = booking.selectedServices;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Service Listing"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.controlsContainer}>
        <SelectableChips
          options={categories}
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

      <ScrollView contentContainerStyle={styles.content}>
        {services.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: colors.onBackground }}>
              No services available
            </Text>
          </View>
        ) : viewMode === "grid" ? (
          <View style={styles.grid}>
            {services.map((service) => (
              <ServiceCardGrid
                key={service.id}
                service={service}
                isSelected={isSelected(service)}
                onToggleSelect={toggleService}
              />
            ))}
          </View>
        ) : (
          services.map((service) => (
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
