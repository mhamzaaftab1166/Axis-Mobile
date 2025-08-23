import { router, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import DUMMY_IMG from "../../../assets/dummy.jpg";

import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import EmptyState from "../../components/common/EmptyState";
import CompactServiceCard from "../../components/home/services/ServicecCardByCategory";
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
    category: "repairing",
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

export default function ListingByCategoryScreen() {
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const selectedCategory = (params.selectedItem || "").toString().toUpperCase();

  const booking = useBookingStore((s) => s.booking);
  const toggleService = useBookingStore((s) => s.toggleService);
  const selectedServices = booking?.selectedServices || [];
  const isSelected = useBookingStore((state) => state.isSelected);

  const handleToggle = (service) => {
    if (toggleService) toggleService(service);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title={selectedCategory || "Services"}
        onBack={() => router.back()}
      />

      {services.length > 0 ? (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <CompactServiceCard
              item={item}
              isSelected={isSelected(item)}
              onToggle={handleToggle}
            />
          )}
        />
      ) : (
        <EmptyState
          iconName="remove-shopping-cart"
          title="No services available"
          description="Currently there are no services in this category."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  list: { padding: 12, paddingBottom: 28 },
});
