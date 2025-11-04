/* InspectionBookingListing.jsx - refactored per request */
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import ButtonSegmented from "../../../../components/common/ButtonSegmented";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";

const data = [
  {
    id: 1,
    uniqueNumber: "ASD1234",
    serviceName: "Home Cleaning & Deep Sanitization",
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
    serviceName: "AC Maintenance & Filter Service",
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

  const renderMediaPreview = (item) => {
    if (item.inspectionType?.toLowerCase() !== "online") return null;

    const media = [];
    if (Array.isArray(item.images))
      media.push(...item.images.map((u) => ({ type: "image", uri: u })));
    if (Array.isArray(item.videos))
      media.push(...item.videos.map((u) => ({ type: "video", uri: u })));

    if (media.length === 0) {
      return (
        <View style={styles.emptyMedia}>
          <Icon name="image-off-outline" size={28} color={colors.placeholder} />
          <Text style={[styles.emptyMediaText, { color: colors.placeholder }]}>
            No media
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mediaScroll}
      >
        {media.map((m, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.85}
            accessibilityLabel={`media-${i}`}
          >
            <View
              style={[
                styles.mediaThumbWrap,
                { backgroundColor: colors.backdrop || "#f2f2f2" },
              ]}
            >
              {m.type === "image" ? (
                <Image
                  source={{ uri: m.uri }}
                  style={styles.mediaThumb}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.videoPlaceholder}>
                  <Image
                    source={{
                      uri: `https://picsum.photos/seed/video${i}/400/300`,
                    }}
                    style={styles.mediaThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.playOverlay}>
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

  const renderItem = ({ item }) => {
    const showMediaOnRight = width > 720;

    return (
      <Surface
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            borderWidth: dark ? 1 : 0,
            borderColor: dark ? "#333" : "transparent",
          },
        ]}
      >
        <View
          style={[
            styles.cardInner,
            showMediaOnRight
              ? { flexDirection: "row" }
              : { flexDirection: "column" },
          ]}
        >
          <View
            style={[
              styles.mediaArea,
              showMediaOnRight ? { width: 160 } : { width: "100%" },
            ]}
          >
            {renderMediaPreview(item)}
          </View>
        </View>
      </Surface>
    );
  };

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

  card: { borderRadius: 12, padding: 12, elevation: 3 },

  mediaArea: { paddingRight: 12 },
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
  onlineMediaRow: { flexDirection: "row", alignItems: "center" },
  inlineImage: { width: 68, height: 48, borderRadius: 6, marginRight: 8 },
  inlineVideo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    marginRight: 8,
  },
  videoText: { marginLeft: 6, fontSize: 12 },
});
