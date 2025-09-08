// screens/Home.js
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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
import CustomDataTable from "../components/common/DataTable";
import SearchWithDropdown from "../components/common/SeaarchBar";
import AddressBottomSheet from "../components/home/AddressBottomSheet";
import CategoryListing from "../components/home/CategoriesListing";
import GreetingHeader from "../components/home/GreetingsHeader";
import HomeServiceSection from "../components/home/HomePageServices";
import InfoCard from "../components/home/InfoCard";
import { serviceTableColumns, staticServiceData } from "../helpers/contantData";
import { ROUTES } from "../helpers/routePaths";
import { useGetAllAddress } from "../hooks/useAddressQuery";
import { useUserDetailQuery } from "../hooks/useAuthQuery";
import { useFetchUnreadCount } from "../hooks/useNotificationQuery";
import { useGetAllServices, useGetTopServices } from "../hooks/useServiceQuery";
import HomeSkeleton from "../skeltons/HomeLoadingSkelton";
import useAddressStore from "../store/useAddressStore";
import useAuthStore from "../store/useAuthStore";

export default function Home() {
  const [showSheet, setShowSheet] = useState(false);
  const { colors, dark } = useTheme();

  const { userData, isLoading: fetchingUserData } = useUserDetailQuery();
  const { topServices, isLoading: fetchingTopServices } = useGetTopServices();
  const { allServices, isLoading: fetchingAllServices } = useGetAllServices();
  const { allAddresses, isLoading: loadingAddress } = useGetAllAddress();

  const { count, isLoading: gettingCount } = useFetchUnreadCount(
    userData?.data?.user?._id
  );

  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const setAddress = useAddressStore((s) => s.setAddress);
  const ensureDefault = useAddressStore((s) => s.ensureDefault);
  const role = useAuthStore((s) => s.role);

  useFocusEffect(
    useCallback(() => {
      ensureDefault(allAddresses ? allAddresses[0] : undefined);
    }, [allAddresses])
  );

  if (
    fetchingAllServices ||
    gettingCount ||
    fetchingUserData ||
    fetchingTopServices ||
    loadingAddress
  )
    return <HomeSkeleton />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={[styles.safe, { backgroundColor: colors.background }]}
      >
        {role === "tenant" ? (
          <>
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
                        style={[
                          styles.addressText,
                          { color: colors.onSurface },
                        ]}
                      >
                        {selectedAddress
                          ? `${selectedAddress?.towerId?.towerName || ""}, ${
                              selectedAddress?.blockId?.blockName || ""
                            }, ${selectedAddress?.floorId?.floorName || ""}, ${
                              selectedAddress?.unitId?.unitName || ""
                            }`
                          : "Address not available"}
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
                suggestions={allServices ? allServices : []}
                notificationCount={count ? count : ""}
                onNotificationPress={() => router.push(ROUTES.NOTIFICATIONS)}
              />
              <GreetingHeader name={userData?.data?.user?.name} />
              <InfoCard
                onBookService={() => router.push(ROUTES.BOOK_SERVICE)}
              />
              <CategoryListing />
              <HomeServiceSection
                title="Popular Services"
                addressCapacity={selectedAddress?.unitId?.unitCapacity}
                homePageServices={topServices?.data}
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
              addresses={allAddresses}
              visible={showSheet}
              selectedId={selectedAddress?.id}
              onClose={() => setShowSheet(false)}
              onSelect={(addr) => {
                setAddress(addr);
                setShowSheet(false);
              }}
              onAdd={() => router.push(ROUTES.ADD_ADDRESS)}
            />
          </>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <GreetingHeader name={userData?.data?.user?.name} />
          </ScrollView>
        )}
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
