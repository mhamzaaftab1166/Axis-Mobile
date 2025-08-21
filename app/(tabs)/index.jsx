// screens/Home.js
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryListing from "../components/home/CategoriesListing";
import GreetingHeader from "../components/home/GreetingsHeader";
import HomeServiceSection from "../components/home/HomePageServices";
import InfoCard from "../components/home/InfoCard";
import { ROUTES } from "../helpers/routePaths";

import DummyImg from "../../assets/dummy.jpg";
import CustomDataTable from "../components/common/DataTable";
import SearchWithDropdown from "../components/common/SeaarchBar";
import { serviceTableColumns, staticServiceData } from "../helpers/contantData";

export default function Home() {
  const { colors } = useTheme();
  const bg = colors.background;

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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
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
              {
                color: colors.text,
                fontSize: 18,
                fontWeight: "600",
              },
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  sectionHeaderRow: {
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});
