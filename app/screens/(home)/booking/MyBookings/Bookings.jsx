import { useNavigation } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import ButtonSegmented from "../../../../components/common/ButtonSegmented";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";
import BookedServiceCard from "../../../../components/home/bookings/BookingCard";
import { bookedServices } from "../../../../helpers/contantData";

export default function BookingListing() {
  const [mode, setMode] = useState("upcoming");
  const navigation = useNavigation();
  const { colors, fonts, dark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="My Bookings"
        onBack={() => navigation.goBack()}
      />

      <FlatList
        data={bookedServices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookedServiceCard
            item={item}
            colors={colors}
            fonts={fonts}
            dark={dark}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <ButtonSegmented
              options={[
                { value: "upcoming", label: "Upcoming Booking" },
                { value: "previous", label: "Previous Booking" },
              ]}
              selected={mode}
              onChange={(val) => setMode(val)}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  header: { marginBottom: 16 },
});
