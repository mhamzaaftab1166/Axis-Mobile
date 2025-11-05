/* InspectionBookingListing.jsx - uses InspectionBookingItem for renderItem */
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import { useTheme } from "react-native-paper";

import ButtonSegmented from "../../../../components/common/ButtonSegmented";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";
import EmptyComponent from "../../../../components/common/EmptyState";
import LoadingOverlay from "../../../../components/LoadingOverlay";
import { filterBookings } from "../../../../helpers/general";
import { useGetMyInspectionBookings } from "../../../../hooks/useInspectionServices";
import InspectionBookingItem from "./InspectionBookingItem";

const segmentedOptions = [
  { value: "upcoming", label: "Upcoming" },
  { value: "previous", label: "Previous" },
];

export default function InspectionBookingListing() {
  const [mode, setMode] = useState("upcoming");
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // fetch the bookings
  const { services: servicesRecords, isLoading: fetchingServices } = useGetMyInspectionBookings();

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

      <LoadingOverlay visible={fetchingServices}/>

      <View style={styles.content}>
        <FlatList
          data={filterBookings(servicesRecords,mode)}
          keyExtractor={(i) => `${i.id}`}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={EmptyComponent}
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
