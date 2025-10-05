import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { unregisterIndieDevice } from "native-notify";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Divider,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import config from "../../config.json";
import { ROUTES } from "../helpers/routePaths";
import { useUserDetailQuery } from "../hooks/useAuthQuery";
import { useFetchUnreadCount } from "../hooks/useNotificationQuery";
import AccountSkeleton from "../skeltons/AccountSkelton";
import useAddressStore from "../store/useAddressStore";
import useAuthStore from "../store/useAuthStore";
import notificationData from "../utils/notificationData";

export default function AccountScreen() {
  const { colors, fonts } = useTheme();
  const router = useRouter();

  const screenBg = colors.background;
  const textColor = colors.text;
  const iconColor = colors.text;

  const { userData, isLoading: fetchingUserData } = useUserDetailQuery();
  const { indieId, clearAuth } = useAuthStore();

  const { count, isLoading: gettingCount } = useFetchUnreadCount(
    userData?.data?.user?._id
  );

  const resetStore = useAddressStore((s) => s.resetStore);

  const role = useAuthStore((s) => s.role);

  const options = [
    {
      key: "profile",
      label: "My Profile",
      icon: "account-outline",
      onPress: () => router.push(ROUTES.MY_PROFILE),
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: "bell-outline",
      count: count ? count : "",
      onPress: () => router.push(ROUTES.NOTIFICATIONS),
    },
    {
      key: "addresses",
      label: "My Addresses",
      icon: "map-marker-outline",
      onPress: () => router.push(ROUTES.MY_ADDRESSES),
    },
    {
      key: "settings",
      label: "Settings",
      icon: "cog-outline",
      onPress: () => router.push(ROUTES.SETTINGS),
    },
    {
      key: "payment",
      label: "Add Payment Method",
      icon: "credit-card-plus-outline",
      onPress: () => router.push(ROUTES.PAYMENT_METHODS),
    },
    {
      key: "paymentHistory",
      label: "Payment History",
      icon: "history",
      onPress: () => router.push(ROUTES.PAYMENT_HISTORY),
    },
    {
      key: "loyalty",
      label: "Loyalty Points",
      icon: "star-outline",
      onPress: () => router.push(ROUTES.LOYALTY_POINTS),
    },
    {
      key: "faq",
      label: "Frequently Asked Questions",
      icon: "help-circle-outline",
      onPress: () => router.push(ROUTES.FAQ),
    },
    {
      key: "theme",
      label: "Theme",
      icon: "theme-light-dark",
      onPress: () => router.push(ROUTES.THEME_TOGGLE),
    },
    {
      key: "logout",
      label: "Logout",
      icon: "logout",
      onPress: () => {
        clearAuth();
        unregisterIndieDevice(
          String(indieId),
          notificationData.appId,
          notificationData.appToken
        );
        resetStore();
        router.replace(ROUTES.LOGIN);
      },
    },
  ];

  const isVisible = (opt) =>
    role === "tenant"
      ? true
      : role === "supervisor"
      ? !["addresses", "faq", "payment", "loyalty", "paymentHistory"].includes(
          opt.key
        )
      : true;

  const groupsDefinition = [
    {
      key: "account",
      title: "Account",
      keys: ["profile", "notifications", "addresses", "settings"],
    },
    {
      key: "payments",
      title: "Payments",
      keys: ["payment", "paymentHistory", "loyalty"],
    },
    { key: "support", title: "Support", keys: ["faq"] },
    { key: "preferences", title: "Preferences", keys: ["theme"] },
    { key: "danger", title: "", keys: ["logout"] },
  ];

  const grouped = groupsDefinition
    .map((g) => {
      const items = g.keys
        .map((k) => options.find((o) => o.key === k))
        .filter(Boolean)
        .filter(isVisible);
      return { ...g, items };
    })
    .filter((g) => g.items.length > 0);

  if (gettingCount || fetchingUserData) return <AccountSkeleton />;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: screenBg }]}>
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Avatar.Image
            size={64}
            source={{
              uri: `${config.pictureUrl}/${userData?.data?.user?.profileImage}`,
            }}
          />
          <View style={styles.profileInfo}>
            <Text
              variant="titleMedium"
              style={{ color: textColor, fontFamily: fonts.medium }}
            >
              Hello, {userData?.data?.user?.name}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: colors.placeholder, marginTop: 4 }}
            >
              {userData?.data?.user?.email}
            </Text>
          </View>
        </View>

        <Divider
          style={{ height: 0.5, backgroundColor: colors.outlineVariant }}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 88 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.options}>
            {grouped.map((group, gi) => (
              <View key={group.key} style={[gi > 0 && styles.groupGap]}>
                {group.title ? (
                  <Text
                    variant="bodySmall"
                    style={[
                      styles.sectionHeader,
                      { color: colors.placeholder, fontFamily: fonts.medium },
                    ]}
                  >
                    {group.title}
                  </Text>
                ) : null}

                {group.items.map((opt, idx) => {
                  const isLastItem =
                    gi === grouped.length - 1 && idx === group.items.length - 1;

                  return (
                    <React.Fragment key={opt.key}>
                      <TouchableRipple onPress={opt.onPress}>
                        <View style={styles.optionRow}>
                          <MaterialCommunityIcons
                            name={opt.icon}
                            size={24}
                            color={iconColor}
                            style={styles.optionIcon}
                          />
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              variant="bodyMedium"
                              style={[
                                styles.optionLabel,
                                { color: textColor, fontFamily: fonts.regular },
                              ]}
                            >
                              {opt.label}
                            </Text>
                            {Number(opt.count) > 0 && (
                              <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                  {opt.count}
                                </Text>
                              </View>
                            )}
                          </View>

                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={24}
                            color={colors.placeholder}
                          />
                        </View>
                      </TouchableRipple>

                      {!isLastItem && (
                        <Divider
                          style={{
                            height: 0.5,
                            backgroundColor: colors.outlineVariant,
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={[styles.footer, { backgroundColor: screenBg }]}>
        <Text variant="bodySmall" style={{ color: colors.placeholder }}>
          Axis v1.1
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  profileInfo: { flex: 1, marginHorizontal: 16 },
  scroll: { flex: 1 },
  options: { marginTop: 8 },
  sectionHeader: { fontSize: 12, marginBottom: 8, marginLeft: 8 },
  groupGap: { marginTop: 16 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  optionIcon: { width: 24, textAlign: "center" },
  optionLabel: { fontSize: 16, marginLeft: 16 },
  badge: {
    backgroundColor: "red",
    borderRadius: 6,
    paddingHorizontal: 6,
    marginLeft: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "white", fontSize: 10, fontWeight: "bold" },
  footer: {
    alignItems: "center",
    paddingVertical: 12,
  },
});
