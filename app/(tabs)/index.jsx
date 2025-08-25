// screens/Home.js
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Surface, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import DummyImg from "../../assets/dummy.jpg";
import CustomDataTable from "../components/common/DataTable";
import SearchWithDropdown from "../components/common/SeaarchBar";
import AddressBottomSheet from "../components/home/AddressBottomSheet";
import CategoryListing from "../components/home/CategoriesListing";
import GreetingHeader from "../components/home/GreetingsHeader";
import HomeServiceSection from "../components/home/HomePageServices";
import InfoCard from "../components/home/InfoCard";
import { serviceTableColumns, staticServiceData } from "../helpers/contantData";
import { ROUTES } from "../helpers/routePaths";

export default function Home() {
  const [showSheet, setShowSheet] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { colors, dark } = useTheme();

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

  const addresses = [
    {
      id: "1",
      property: { id: "1", name: "Tower A" },
      block: { id: "2", name: "Block 2" },
      floor: { id: "5", name: "5th" },
      unit: { id: "102", name: "102" },
    },
    {
      id: "2",
      property: { id: "2", name: "Tower B" },
      block: { id: "1", name: "Block 1" },
      floor: { id: "2", name: "2nd" },
      unit: { id: "201", name: "201" },
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={() => setShowSheet(true)}
            activeOpacity={0.8}
          >
            <Surface
              style={[
                styles.addressCard,
                {
                  backgroundColor: colors.surface,
                  elevation: 0,
                  borderWidth: dark ? 1 : 0,
                  borderColor: colors.outline,
                },
              ]}
            >
              <View style={styles.addressRow}>
                <View style={styles.iconRow}>
                  <MaterialIcons
                    name="home"
                    size={20}
                    color={colors.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[styles.addressText, { color: colors.onSurface }]}
                  >
                    {selectedAddress
                      ? `${selectedAddress.property.name}, ${selectedAddress.block.name}, ${selectedAddress.floor.name}, ${selectedAddress.unit.name}`
                      : `${addresses[0].property.name}, ${addresses[0].block.name}, ${addresses[0].floor.name}, ${addresses[0].unit.name}`}
                  </Text>
                </View>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={colors.primary}
                />
              </View>
            </Surface>
          </TouchableOpacity>
          <SearchWithDropdown
            onNotificationPress={() => router.push(ROUTES.NOTIFICATIONS)}
          />
          <GreetingHeader name="Hamza" />
          <InfoCard onBookService={() => router.push(ROUTES.BOOK_SERVICE)} />
          <CategoryListing />
          <HomeServiceSection
            title="Popular Services"
            homePageServices={services}
            onViewAll={() => router.push(ROUTES.SERVICE_LISTING)}
          />
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: 18, fontWeight: "600" },
              ]}
            >
              Upcoming Services
            </Text>
          </View>
          <CustomDataTable
            data={staticServiceData}
            columns={serviceTableColumns}
            showPagination={true}
          />
        </ScrollView>

        <AddressBottomSheet
          addresses={addresses}
          visible={showSheet}
          onClose={() => setShowSheet(false)}
          onSelect={(addr) => {
            setSelectedAddress(addr);
            setShowSheet(false);
          }}
          onAdd={() => console.log("Add More")}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flexGrow: 1, padding: 16 },
  sectionHeaderRow: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  addressCard: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  addressText: {
    fontSize: 15,
    fontWeight: "500",
    flexShrink: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600" },
});
