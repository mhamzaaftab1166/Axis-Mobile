import { MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { formatAddressLabel } from "../../../../helpers/general";
import useAddressStore from "../../../../store/useAddressStore";

export default function BookingSummary({ bookingData, onChangeAddress }) {
  const { colors, fonts, dark } = useTheme();
  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const addr = formatAddressLabel(selectedAddress);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    let [hourStr, minute] = timeString.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const renderMedia = () => {
    const images = bookingData?.images || [];
    const videos = bookingData?.videos || [];
    if (!images.length && !videos.length) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        {images.map((uri, idx) => (
          <Image
            key={idx}
            source={{ uri }}
            style={styles.mediaItem}
            resizeMode="cover"
          />
        ))}
        {videos.map((uri, idx) => (
          <View key={idx} style={[styles.mediaItem, styles.videoItem]}>
            <MaterialIcons name="videocam" size={22} color="white" />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View>
      {/* Booking Summary Label */}
      <Text
        style={[
          styles.summaryLabel,
          { color: colors.onSurface, fontFamily: fonts?.medium?.fontFamily },
        ]}
      >
        Booking Summary
      </Text>

      {/* Address */}
      <Surface
        style={[
          styles.surface,
          {
            backgroundColor: colors.background,
            borderWidth: dark ? 1 : 0,
            borderColor: colors.outline,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChangeAddress?.()}
          style={styles.rowInner}
        >
          <View style={styles.left}>
            <MaterialIcons
              name="home"
              size={22}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.mainText,
                  {
                    color: colors.onSurface,
                    fontFamily: fonts?.medium?.fontFamily,
                  },
                ]}
              >
                {selectedAddress ? addr.main : "No address selected"}
              </Text>
              <Text
                style={[
                  styles.metaText,
                  {
                    color: colors.placeholder,
                    fontFamily: fonts?.regular?.fontFamily,
                  },
                ]}
              >
                {selectedAddress ? addr.meta : "Choose an address"}
              </Text>
            </View>
          </View>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={26}
            color={colors.primary}
          />
        </TouchableOpacity>
      </Surface>

      {/* Service Info */}
      <Surface
        style={[
          styles.surface,
          {
            backgroundColor: colors.background,
            borderWidth: dark ? 1 : 0,
            borderColor: colors.outline,
          },
        ]}
      >
        <View style={styles.serviceHeader}>
          <Text
            style={[
              styles.mainText,
              {
                color: colors.onSurface,
                fontFamily: fonts?.medium?.fontFamily,
                fontSize: 17,
              },
            ]}
          >
            {bookingData?.selectedService?.name || "Service not selected"}
          </Text>
          {bookingData?.inspectionType && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    bookingData.inspectionType === "physical"
                      ? "#4CAF50"
                      : "#2196F3",
                },
              ]}
            >
              <Text style={styles.badgeText}>
                {bookingData.inspectionType.toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        {bookingData?.selectedService?.description ? (
          <Text
            style={[
              styles.metaText,
              {
                color: colors.placeholder,
                fontFamily: fonts?.regular?.fontFamily,
                marginBottom: 8,
              },
            ]}
          >
            {bookingData.selectedService.description}
          </Text>
        ) : null}

        {/* Booking Details */}
        <View style={styles.detailsWrapper}>
          <View style={styles.row}>
            <View style={styles.detailItem}>
              <MaterialIcons name="event" size={20} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.onSurface }]}>
                {formatDate(bookingData?.bookingDate)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="schedule" size={20} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.onSurface }]}>
                {formatTime(bookingData?.time)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons
                name="attach-money"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.priceText, { color: colors.onSurface }]}>
                AED 25
              </Text>
            </View>
          </View>
        </View>

        {renderMedia()}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryLabel: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
  surface: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 15,
  },
  rowInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  mainText: { fontSize: 16, fontWeight: "600" },
  metaText: { fontSize: 13, marginTop: 2 },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  detailsWrapper: { marginTop: 8 },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginTop: 4,
  },
  detailText: { fontSize: 14, marginLeft: 4 },
  priceText: { fontSize: 15, marginLeft: 0 },
  mediaItem: { width: 90, height: 90, borderRadius: 12, marginRight: 8 },
  videoItem: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
