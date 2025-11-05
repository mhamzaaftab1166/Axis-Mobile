// File: src/components/inspection/InspectionBookingItem.jsx
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Surface } from "react-native-paper";
import config from "../../../../../config.json";

export default function InspectionBookingItem({
  item,
  width,
  colors,
  dark,
  navigation,
}) {
  const isOnline = (item.inspectionType || "").toLowerCase() === "online";

  // ✅ Define all status options with label + value
  const statusOptions = [
    { label: "Pending", value: "pending", color: "#9c978eff" },
    { label: "Confirmed", value: "confirmed", color: "#3498db" },
    { label: "Ongoing", value: "ongoing", color: "#3498db" },
    { label: "Completed", value: "completed", color: "#95a5a6" },
    { label: "Terminated", value: "terminated", color: "#95a5a6" },
    { label: "Cancelled", value: "cancelled", color: "#e74c3c" },
    { label: "Canceled", value: "canceled", color: "#e74c3c" },
    { label: "Unknown", value: "unknown", color: "#7f8c8d" },
  ];

  // ✅ Find matching option by value
  const getStatusOption = (statusValue) => {
    const match = statusOptions.find(
      (opt) => opt.value.toLowerCase() === (statusValue || "").toLowerCase()
    );
    return match || statusOptions.find((opt) => opt.value === "unknown");
  };

  const Badge = ({ label, color }) => (
    <View
      style={[
        localStyles.badge,
        {
          backgroundColor: color ? `${color}22` : "#00000008",
          borderColor: color || "#ddd",
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[localStyles.badgeText, { color: color || colors.text }]}
      >
        {label}
      </Text>
    </View>
  );

  const getMediaList = (it) => {
    const media = [];
    if (Array.isArray(it.images))
      media.push(...it.images.map((u) => ({ type: "image", uri: u })));
    if (Array.isArray(it.videos))
      media.push(...it.videos.map((u) => ({ type: "video", uri: u })));
    return media;
  };

  const renderMediaPreview = (it) => {
    const media = getMediaList(it);
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={localStyles.mediaScroll}
      >
        {media.map((m, i) => (
          <TouchableOpacity key={i} activeOpacity={0.85} onPress={() => {}}>
            <View
              style={[
                localStyles.mediaThumbWrap,
                { backgroundColor: colors.backdrop || "#f2f2f2" },
              ]}
            >
              {m.type === "image" ? (
                <Image
                  source={{ uri: `${config.pictureUrl}/${m.uri}` }}
                  style={localStyles.mediaThumb}
                  resizeMode="cover"
                />
              ) : (
                <View style={localStyles.videoPlaceholder}>
                  <Image
                    source={{
                      uri: `${config.pictureUrl}/${m.uri}`,
                    }}
                    style={localStyles.mediaThumb}
                    resizeMode="cover"
                  />
                  <View style={localStyles.playOverlay}>
                    <Icon name="play-circle" size={44} color="#fff" />
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const showMediaOnRight = width > 720;
  const statusOption = getStatusOption(item.status);

  return (
    <Surface
      style={[
        localStyles.card,
        {
          backgroundColor: colors.background,
          borderWidth: dark ? 1 : 0,
          borderColor: dark ? "#333" : "transparent",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        style={[
          localStyles.cardInner,
          showMediaOnRight
            ? { flexDirection: "row" }
            : { flexDirection: "column" },
        ]}
        onPress={() => {
          /* open details if needed */
        }}
      >
        <View
          style={[
            localStyles.detailsArea,
            showMediaOnRight
              ? { flex: 1, paddingRight: 12 }
              : { width: "100%" },
          ]}
        >
          <View style={localStyles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={[localStyles.unique, { color: colors.primary }]}>
                {item.uniqueNumber}
              </Text>
              <Text
                style={[localStyles.title, { color: colors.text }]}
                numberOfLines={2}
              >
                {item.serviceName}
              </Text>
              <Text
                style={[localStyles.category, { color: colors.placeholder }]}
              >
                {item.serviceCategory}
              </Text>
            </View>

            {/* ✅ Display Label from statusOptions */}
            <View style={localStyles.badgesColumn}>
              <Badge label={statusOption.label} color={statusOption.color} />
            </View>
          </View>

          <View style={localStyles.metaRow}>
            <View style={localStyles.metaItem}>
              <Icon name="calendar" size={18} color={colors.placeholder} />
              <Text
                style={[localStyles.metaText, { color: colors.placeholder }]}
              >{` ${item.bookingDate || "-"}`}</Text>
            </View>

            <View style={localStyles.metaItem}>
              <Icon name="clock-outline" size={18} color={colors.placeholder} />
              <Text
                style={[localStyles.metaText, { color: colors.placeholder }]}
              >{` ${item.bookingTime || "-"}`}</Text>
            </View>

            <View style={[localStyles.metaItem, { flex: 1 }]}>
              <Icon name="map-marker" size={18} color={colors.placeholder} />
              <Text
                style={[localStyles.metaText, { color: colors.placeholder }]}
                numberOfLines={1}
              >{` ${item.address || "-"}`}</Text>
            </View>
          </View>

          <View style={localStyles.rowBetween}>
            <View style={localStyles.typePill}>
              <Icon
                name={isOnline ? "laptop" : "account"}
                size={16}
                color={colors.text}
              />
              <Text style={[localStyles.typeText, { color: colors.text }]}>{` ${
                item.inspectionType || ""
              }`}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            localStyles.mediaArea,
            showMediaOnRight
              ? { width: 160 }
              : { width: "100%", marginTop: 12 },
          ]}
        >
          {renderMediaPreview(item)}
        </View>
      </TouchableOpacity>
    </Surface>
  );
}

const localStyles = StyleSheet.create({
  card: { borderRadius: 12, padding: 12, elevation: 3 },
  cardInner: { alignItems: "flex-start", justifyContent: "space-between" },
  detailsArea: { justifyContent: "space-between" },
  unique: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  category: { fontSize: 13, marginBottom: 8 },
  badgesColumn: {
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
    minWidth: 88,
    alignItems: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "700", textTransform: "capitalize" },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 6,
  },
  metaText: { fontSize: 13 },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  typeText: { fontSize: 13, fontWeight: "600" },
  mediaArea: { paddingRight: 0 },
  mediaScroll: { alignItems: "center", paddingVertical: 4 },
  mediaThumbWrap: {
    width: 140,
    height: 96,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: "#eee",
  },
  mediaThumb: { width: "100%", height: "100%" },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  playOverlay: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
