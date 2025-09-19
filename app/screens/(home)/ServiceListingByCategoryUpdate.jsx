import { router, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import EmptyState from "../../components/common/EmptyState";
import CompactServiceCard from "../../components/home/services/ServicecCardByCategory";
import LoadingOverlay from "../../components/LoadingOverlay";
import { filterServices } from "../../helpers/general";
import { useGetAllServices } from "../../hooks/useServiceQuery";
import useAddressStore from "../../store/useAddressStore";
import useBookingUpdateStore from "../../store/useBookingStoreUpdate";

export default function ListingByCategoryScreen() {
  const params = useLocalSearchParams();
  const { colors } = useTheme();

  const selectedCategory = (params.selectedItem || "").toString().toUpperCase();

  const booking = useBookingUpdateStore((s) => s.booking);
  const toggleService = useBookingUpdateStore((s) => s.toggleService);
  const selectedServices = booking?.selectedServices || [];
  const isSelected = useBookingUpdateStore((state) => state.isSelected);

  const handleToggle = (service) => {
    if (toggleService) toggleService(service);
  };

  const { allServices: services, isLoading } = useGetAllServices();
  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const filteredServices = filterServices([params.selectedItem], services);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title={selectedCategory || "Services"}
        onBack={() => router.back()}
      />

      <LoadingOverlay visible={isLoading} />

      {filteredServices.length > 0 ? (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <CompactServiceCard
              item={item}
              capacity={selectedAddress?.unitId?.unitCapacity}
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
