// screens/Home.js
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import GreetingHeader from "../components/home/GreetingsHeader";
import InfoCard from "../components/home/InfoCard";

export default function Home() {
  const { colors } = useTheme();
  const bg = colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <GreetingHeader name="Hamza" />
        <InfoCard onBookService={() => null} />
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
