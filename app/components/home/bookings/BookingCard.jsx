import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { IconButton, Surface, useTheme } from "react-native-paper";
import {
  getAddressText,
  getScheduleText,
  getStatusColor,
} from "../../../helpers/general";
import { ROUTES } from "../../../helpers/routePaths";

const BookedServiceCard = ({ item, colors, fonts }) => {
  const { dark } = useTheme();
  const statusColor = getStatusColor(item.status);

  const navigateToDetails = () => {
    router.push({
      pathname: ROUTES.BOOKED_SERVIICE_DETAIL,
      params: { bookedService: JSON.stringify(item) },
    });
  };

  const scheduleText = getScheduleText(item);
  const addressText = getAddressText(item);

  return (
    <Pressable
      onPress={navigateToDetails}
      style={({ pressed }) => [
        styles.touchWrapper,
        pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
      ]}
    >
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            borderWidth: dark ? 1 : 0,
            borderColor: dark ? "#333" : "transparent",
          },
        ]}
        elevation={2}
      >
        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text
              style={[
                styles.property,
                { fontFamily: fonts.bold?.fontFamily, color: colors.text },
              ]}
              numberOfLines={2}
            >
              {addressText}
            </Text>
            <IconButton
              icon="chevron-right"
              size={22}
              iconColor={colors.primary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.servicesWrapper}>
            {item.services.map((srv, index) => (
              <View
                key={srv.id}
                style={[
                  styles.serviceItem,
                  index === 0 && { marginTop: 4 },
                  index === item.services.length - 1 && { marginBottom: 4 },
                ]}
              >
                {srv.image ? (
                  <Image source={srv.image} style={styles.serviceImage} />
                ) : (
                  <View
                    style={[styles.serviceImage, styles.placeholderImage]}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.serviceName,
                      {
                        color: colors.text,
                        fontFamily: fonts.medium?.fontFamily,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {srv.name}
                  </Text>
                  {srv.badge && (
                    <Text style={[styles.badge, { color: colors.primary }]}>
                      {srv.badge}
                    </Text>
                  )}
                  <Text
                    style={[styles.servicePrice, { color: colors.placeholder }]}
                  >
                    AED {srv.price}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.scheduleBox}>
              <Text style={[styles.icon, { color: colors.primary }]}>📅</Text>
              <Text
                style={[styles.detailText, { color: colors.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {scheduleText}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusColor.bg,
                  borderColor: statusColor.text, // border same as text color
                },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
};

export default BookedServiceCard;

const styles = StyleSheet.create({
  touchWrapper: { borderRadius: 12, marginBottom: 18 },
  card: {
    marginVertical: 5,
    borderRadius: 12,
    elevation: 3,
  },
  cardContent: { flex: 1, padding: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  property: { fontSize: 16, fontWeight: "700", flex: 1 },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginVertical: 8,
  },
  servicesWrapper: { marginVertical: 4 },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  serviceImage: {
    width: 42,
    height: 42,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  placeholderImage: { justifyContent: "center", alignItems: "center" },
  serviceName: { fontSize: 15, fontWeight: "600" },
  badge: { fontSize: 12, marginTop: 2 },
  servicePrice: { fontSize: 13, marginTop: 2, fontWeight: "500" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  scheduleBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 12,
    marginRight: 10,
  },
  icon: { fontSize: 16, marginRight: 6 },
  detailText: { fontSize: 14, flexShrink: 1 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 90,
    alignItems: "center",
  },
  statusText: { fontWeight: "600", fontSize: 13, textTransform: "capitalize" },
});
