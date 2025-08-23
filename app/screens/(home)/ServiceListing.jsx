import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import DUMMY_IMG from "../../../assets/dummy.jpg";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import EmptyState from "../../components/common/EmptyState";
import SearchBarWithToggle from "../../components/common/SearchBarWithToggle";
import SelectableChips from "../../components/common/SelectableChips";
import ServiceCardGrid from "../../components/home/services/ServiceCardGrid";
import ServiceCardList from "../../components/home/services/ServiceCardList";
import { serviceOptions } from "../../helpers/contantData";
import useBookingStore from "../../store/useBookingStore";

const services = [
  {
    id: "1",
    category: "cleaning",
    name: "Home Cleaning",
    image: DUMMY_IMG,
    rating: 4.5,
    price: 150,
    badge: "Popular",
    description:
      "Thorough cleaning for your entire home, including living areas, kitchen, and bathrooms.",
  },
  {
    id: "2",
    category: "cleaning",
    name: "Electrical Work",
    image: DUMMY_IMG,
    rating: 4.8,
    price: 200,
    badge: "Top Rated",
    description:
      "Professional electrical services for repairs, installations, and maintenance work.",
  },
  {
    id: "3",
    category: "cleaning",
    name: "Gardening Service",
    image: DUMMY_IMG,
    rating: 4.2,
    price: 120,
    badge: "Popular",
    description:
      "Lawn mowing, plant care, and garden maintenance to keep your outdoors looking great.",
  },
  {
    id: "4",
    category: "cleaning",
    name: "Sofa Upholstery",
    image: DUMMY_IMG,
    rating: 4.3,
    price: 95,
    badge: "",
    description: "Deep sofa and upholstery cleaning, removes stains and odors.",
  },
  {
    id: "5",
    category: "cleaning",
    name: "Carpet Cleaning",
    image: DUMMY_IMG,
    rating: 4.1,
    price: 110,
    badge: "",
    description:
      "Steam clean carpets; designed to remove deep dirt and allergens.",
  },
  {
    id: "6",
    category: "cleaning",
    name: "Local Moving",
    image: DUMMY_IMG,
    rating: 4.0,
    price: 350,
    badge: "",
    description: "Local house moving service with packing & transport options.",
  },

  {
    id: "9",
    category: "cleaning",
    name: "Home Pest Control",
    image: DUMMY_IMG,
    rating: 4.2,
    price: 240,
    badge: "",
    description: "Safe and effective pest removal and preventive treatment.",
  },
];

export default function ServiceListing() {
  const { selectedItem } = useLocalSearchParams();
  console.log("Selected item:", selectedItem);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategories, setSelectedCategories] = useState([]);
  console.log(selectedCategories);
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
      {services.length !== 0 && (
        <View style={styles.controlsContainer}>
          <SelectableChips
            options={serviceOptions}
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

      <ScrollView contentContainerStyle={styles.content}>
        {services.length === 0 ? (
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
