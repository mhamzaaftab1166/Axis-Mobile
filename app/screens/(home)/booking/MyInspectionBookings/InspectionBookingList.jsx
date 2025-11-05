/* InspectionBookingListing.jsx - uses InspectionBookingItem for renderItem */
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { useTheme } from "react-native-paper";

import ButtonSegmented from "../../../../components/common/ButtonSegmented";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";
import InspectionBookingItem from "./InspectionBookingItem";

const data = [
  {
    id: 1,
    uniqueNumber: "ASD1234",
    serviceName: "Home Cleaning",
    serviceCategory: "Cleaning",
    bookingDate: "15 March, 2020",
    bookingTime: "10:00 AM",
    inspectionType: "Physical",
    images: null,
    videos: null,
    address: "Al Barsha, Dubai, UAE",
    paymentStatus: "success",
    serviceStatus: "terminated",
  },
  {
    id: 2,
    uniqueNumber: "ASD5678",
    serviceName: "AC Maintenance",
    serviceCategory: "Maintenance",
    bookingDate: "20 November, 2025",
    bookingTime: "2:30 PM",
    inspectionType: "Online",
    images: [
      "https://picsum.photos/seed/1/800/600",
      "https://picsum.photos/seed/2/800/600",
      "https://picsum.photos/seed/3/800/600",
    ],
    videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    address: "Business Bay, Dubai, UAE",
    paymentStatus: "paymentCancelled",
    serviceStatus: "confirmed",
  },
];

const segmentedOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "previous", label: "Previous" },
];

export default function InspectionBookingListing() {
  const [mode, setMode] = useState("upcoming");
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const onSegmentChange = useCallback(
    (value) => {
      setMode(value);
    },
    [setMode]
  );

  // Use the extracted component for rendering each item.
  const renderItem = ({ item }) => (
    <InspectionBookingItem
      item={item}
      width={width}
      colors={colors}
      dark={dark}
      navigation={navigation}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Inspection Bookings"
        onBack={() => navigation.goBack()}
        cartDisplay={false}
      />

      <View style={styles.content}>
        <FlatList
          data={data}
          keyExtractor={(i) => `${i.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.segmentWrap}>
              <ButtonSegmented
                options={segmentedOptions}
                selected={mode}
                onChange={onSegmentChange}
                cardStyle={{}}
                colors={colors}
                dark={dark}
              />
            </View>
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  list: { padding: 16, paddingBottom: 32 },

  // kept some shared styles for layout consistency, most UI lives inside the item component
  segmentWrap: { marginBottom: 12 },
});
