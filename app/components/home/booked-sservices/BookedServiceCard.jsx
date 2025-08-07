import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton, Surface } from "react-native-paper";
import { getStatusColor } from "../../../helpers/general";

const BookedServiceCard = ({ item, colors, fonts, dark }) => {
  const statusColor = getStatusColor(item.status);

  const navigateToDetails = () => {
    router.push({
      pathname: "screens/(home)/book-service/listing/BookedServiceDetail",
      params: { bookedService: JSON.stringify(item) },
    });
  };

  const scheduleText =
    item.serviceTime.mode === "oneTime"
      ? `${item.serviceTime.oneTimeDate} @ ${item.serviceTime.oneTimeTime}`
      : `${
          item.serviceTime.regular.type === "all"
            ? "Daily"
            : item.serviceTime.regular.selectedDays
                .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
                .join(", ")
        } from ${item.serviceTime.regular.startDate} ${
          item.serviceTime.regular.startTime
        }`;

  return (
    <TouchableOpacity onPress={navigateToDetails} style={styles.touchWrapper}>
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: dark ? colors.secondary : "#f9f9fb",
            borderColor: dark ? "#444" : "#ddd",
          },
        ]}
      >
        {/* Left vertical border */}
        <View
          style={[
            styles.leftBorder,
            { backgroundColor: dark ? colors.onPrimary : colors.primary },
          ]}
        />

        <View style={styles.cardContent}>
          <View style={styles.row}>
            <Text
              style={[
                styles.property,
                { fontFamily: fonts.bold?.fontFamily, color: colors.text },
              ]}
              numberOfLines={2}
            >
              {item.propertyForService.map((p) => p.name).join(", ")}
            </Text>

            <IconButton
              icon="chevron-right"
              size={24}
              iconColor={colors.primary}
            />
          </View>

          <View style={styles.detailRow}>
            <View style={styles.scheduleBox}>
              <Text style={[styles.icon, { color: colors.primary }]}>📅</Text>
              <Text
                style={[styles.detailText, { color: colors.text }]}
                numberOfLines={2}
              >
                {scheduleText}
              </Text>
            </View>

            <View
              style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}
            >
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

export default BookedServiceCard;

const styles = StyleSheet.create({
  touchWrapper: { borderRadius: 12 },
  card: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
  },
  leftBorder: {
    width: 5,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  property: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scheduleBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
    marginRight: 10,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    minWidth: 90,
    alignItems: "center",
  },
  statusText: {
    fontWeight: "600",
    fontSize: 13,
    textTransform: "capitalize",
  },
});
