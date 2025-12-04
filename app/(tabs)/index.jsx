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
import { useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { MaterialIcons } from "@expo/vector-icons";
import registerNNPushToken from "native-notify";
import config from "../../config.json";
import SearchWithDropdown from "../components/common/SeaarchBar";
import AddressBottomSheet from "../components/home/AddressBottomSheet";
import CategoryListing from "../components/home/CategoriesListing";
import Greetings from "../components/home/Greetings";
import HomeServiceSection from "../components/home/HomePageServices";
import InfoCard from "../components/home/InfoCard";
import CustomSubServiceTenantList from "../components/home/SubServiceTenant";
import { ROUTES } from "../helpers/routePaths";
import { useGetAllAddress } from "../hooks/useAddressQuery";
import { useUserDetailQuery } from "../hooks/useAuthQuery";
import { useGetInspectionServices } from "../hooks/useInspectionServices";
import { useFetchUnreadCount } from "../hooks/useNotificationQuery";
import {
  useGetAllServices,
  useGetTopServices,
  useGetUpcomingSubServices,
} from "../hooks/useServiceQuery";
import SupervisorHomePage from "../screens/(home)/SupervisorHomePage";
import HomeSkeleton from "../skeltons/HomeLoadingSkelton";
import useAddressStore from "../store/useAddressStore";
import useAuthStore from "../store/useAuthStore";
import notificationData from "../utils/notificationData";

export default function Home() {
  registerNNPushToken(notificationData.appId, notificationData.appToken);

  const [showSheet, setShowSheet] = useState(false);
  const { colors } = useTheme();

  const { userData, isLoading: fetchingUserData } = useUserDetailQuery();
  const { topServices, isLoading: fetchingTopServices } = useGetTopServices(
    userData?.data?.user?.role
  );
  const { allServices, isLoading: fetchingAllServices } = useGetAllServices(
    userData?.data?.user?.role
  );
  const { allAddresses, isLoading: loadingAddress } = useGetAllAddress(
    userData?.data?.user?.role
  );

  const { count, isLoading: gettingCount } = useFetchUnreadCount(
    userData?.data?.user?._id
  );

  const { allSubs, isLoading: fetchingSubs } = useGetUpcomingSubServices(
    userData?.data?.user?.role
  );

  const { data: inspectionServices, isLoading: fetchingIspectionServices } =
    useGetInspectionServices(userData?.data?.user?.role);

  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const setAddress = useAddressStore((s) => s.setAddress);
  const role = useAuthStore((s) => s.role);

  useFocusEffect(
    useCallback(() => {
      const store = useAddressStore.getState();
      if (Array.isArray(allAddresses) && allAddresses.length > 0) {
        store.setAddresses(allAddresses);
      } else {
        store.clearAddresses();
      }
      store.validateSelectedAddress();
    }, [allAddresses])
  );

  if (
    (fetchingAllServices ||
      gettingCount ||
      fetchingUserData ||
      fetchingTopServices ||
      loadingAddress ||
      fetchingIspectionServices ||
      fetchingSubs) &&
    role === "tenant"
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
                <View
                  style={[
                    styles.addressCard,
                    {
                      backgroundColor: colors.surface,
                      elevation: 0,
                      borderWidth: 1,
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
                </View>
              </TouchableOpacity>
              <View style={{ height: 5 }} />
              <SearchWithDropdown
                suggestions={allServices ? allServices : []}
                notificationCount={count ? count : ""}
                onNotificationPress={() => router.push(ROUTES.NOTIFICATIONS)}
              />
              <View style={{ height: 5 }} />
              <Greetings
                name={userData?.data?.user?.name}
                profilePic={`${config.pictureUrl}/${userData?.data?.user?.profileImage}`}
              />
              <View style={{ height: 18 }} />

              <InfoCard
                onBookService={() => router.push(ROUTES.BOOK_SERVICE)}
              />
              <CategoryListing />
              <HomeServiceSection
                title="Popular Services"
                addressCapacity={selectedAddress?.unitId?.unitCapacity}
                homePageServices={topServices?.data}
                inspectionServices={inspectionServices}
                onViewAll={() => router.push(ROUTES.SERVICE_LISTING)}
              />
              {allSubs?.length > 0 && (
                <CustomSubServiceTenantList
                  data={allSubs || []}
                  itemsPerPage={5}
                  showPagination={true}
                />
              )}
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
            <SupervisorHomePage userData={userData} />
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
