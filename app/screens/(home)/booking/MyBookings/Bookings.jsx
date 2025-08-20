import { useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import ButtonSegmented from "../../../../components/common/ButtonSegmented";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";

export default function ServiceListing() {
  const [mode, setMode] = useState("upcoming"); // default selected
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="My Bookings"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ButtonSegmented
          options={[
            { value: "upcoming", label: "Upcoming Booking" },
            { value: "previous", label: "Previous Booking" },
          ]}
          selected={mode}
          onChange={(val) => setMode(val)}
        />

        {/* Add your booking list content here */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
});
