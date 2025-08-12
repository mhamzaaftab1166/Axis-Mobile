// screens/Home.js
import { router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryListing from "../components/home/CategoriesListing";
import GreetingHeader from "../components/home/GreetingsHeader";
import InfoCard from "../components/home/InfoCard";
import { ROUTES } from "../helpers/routePaths";

export default function Home() {
  const { colors } = useTheme();
  const bg = colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <GreetingHeader name="Hamza" />
        <InfoCard onBookService={() => router.push(ROUTES.SERVICE_LISTING)} />
        <CategoryListing />
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
});
