import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useRef, useState } from "react";
import {
  Dimensions,
  findNodeHandle,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import {
  Avatar,
  Card,
  Divider,
  Menu,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";
import SendQuotationPopup from "./SendQuotationPopup";

const { width } = Dimensions.get("window");

const STATUS_OPTIONS = [
  {
    label: "Pending",
    value: "pending",
    color: "#f39c12",
    icon: "clock-outline",
  },
  {
    label: "Confirmed",
    value: "confirmed",
    color: "#3498db",
    icon: "check-circle-outline",
  },
  {
    label: "Ongoing",
    value: "ongoing",
    color: "#3498db",
    icon: "progress-clock",
  },
  {
    label: "Completed",
    value: "completed",
    color: "#95a5a6",
    icon: "checkbox-marked-circle-outline",
  },
  {
    label: "Terminated",
    value: "terminated",
    color: "#95a5a6",
    icon: "close-circle-outline",
  },
  { label: "Cancelled", value: "cancelled", color: "#e74c3c", icon: "cancel" },
];

export default function InspectJobDetailsView() {
  const { colors, dark } = useTheme();
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item) : null;

  const [openDropdown, setOpenDropdown] = useState(false);
  const [status, setStatus] = useState(item?.status || "");
  const [snack, setSnack] = useState({ visible: false, msg: "" });
  const [quotationItem, setQuotationItem] = useState(null);
  const anchorRef = useRef(null);
  const [anchorLayout, setAnchorLayout] = useState(null);
  const [menuKey, setMenuKey] = useState(null);

  const videoPlayers = (item?.video || []).map((vid) => useVideoPlayer(vid));

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.text }}>No inspection details found.</Text>
      </View>
    );
  }

  const onSendQuotation = () => setQuotationItem(item);

  const onChangeStatus = (newStatus) => {
    const cfg =
      STATUS_OPTIONS.find((s) => s.value === newStatus) || STATUS_OPTIONS[0];
    setStatus(cfg.value);
    setOpenDropdown(false);
    setSnack({ visible: true, msg: `Status changed to ${cfg.label}` });
  };

  const measureInWindowAsync = (node) =>
    new Promise((resolve, reject) => {
      const handle = findNodeHandle(node);
      if (!handle) return reject(new Error("no handle"));
      if (UIManager && UIManager.measureInWindow) {
        UIManager.measureInWindow(handle, (x, y, w, h) =>
          resolve({ x, y, width: w, height: h })
        );
      } else if (node.measureInWindow) {
        node.measureInWindow((x, y, w, h) =>
          resolve({ x, y, width: w, height: h })
        );
      } else {
        reject(new Error("no measure method"));
      }
    });

  const openMenuAtAnchor = async () => {
    try {
      const node = anchorRef.current;
      const layout = await measureInWindowAsync(node);
      setAnchorLayout(layout);
      setMenuKey(String(Date.now()));
      setTimeout(() => setOpenDropdown(true), 30);
    } catch {
      setMenuKey(String(Date.now()));
      setTimeout(() => setOpenDropdown(true), 30);
    }
  };

  const handleDismiss = () => {
    setOpenDropdown(false);
    setAnchorLayout(null);
    setMenuKey(null);
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CenteredAppbarHeader
          title="Inspection Details"
          onBack={() => router.back()}
          cartDisplay={false}
        />
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          <Card
            style={[
              styles.card,
              { backgroundColor: dark ? colors.surface : "#fff" },
            ]}
          >
            <Card.Content style={styles.cardInner}>
              <View style={styles.rowTop}>
                <View style={styles.left}>
                  <Avatar.Text
                    size={44}
                    label={item.id.slice(-2)}
                    style={[
                      styles.avatar,
                      { backgroundColor: dark ? "#0F1720" : "#EEF2FF" },
                    ]}
                    labelStyle={{ color: dark ? "#E6EDF3" : "#3730A3" }}
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={[styles.serviceName, { color: colors.text }]}>
                      {item.serviceName}
                    </Text>
                    <Text style={[styles.subtle, { color: colors.disabled }]}>
                      {item.serviceCategory}
                    </Text>
                  </View>
                </View>

                <View style={styles.badgeWrap}>
                  <View
                    style={[
                      styles.typePill,
                      {
                        backgroundColor:
                          item.inspectionType.toLowerCase() === "online"
                            ? "#E8F4FF"
                            : "#F3F8E8",
                        borderColor:
                          item.inspectionType.toLowerCase() === "online"
                            ? "#90C6FF"
                            : "#C6E18A",
                      },
                    ]}
                  >
                    <Icon
                      name={
                        item.inspectionType.toLowerCase() === "online"
                          ? "laptop"
                          : "account"
                      }
                      size={14}
                      color="#333"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.typeText, { color: "#333" }]}>
                      {item.inspectionType}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Icon name="calendar" size={16} color={colors.placeholder} />
                  <Text
                    style={[styles.metaText, { color: colors.placeholder }]}
                  >
                    {item.bookingDate}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon
                    name="clock-outline"
                    size={16}
                    color={colors.placeholder}
                  />
                  <Text
                    style={[styles.metaText, { color: colors.placeholder }]}
                  >
                    {item.bookingTime}
                  </Text>
                </View>
              </View>

              <View style={styles.addressRow}>
                <Icon name="map-marker" size={16} color={colors.placeholder} />
                <Text
                  style={[styles.addressText, { color: colors.placeholder }]}
                  numberOfLines={2}
                >
                  {item.address}
                </Text>
              </View>

              <View style={styles.actionsRow}>
                <View style={styles.leftAction}>
                  <View style={styles.pillWrapper}>
                    {!item.quotationSent ? (
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={onSendQuotation}
                        style={[
                          styles.statusPill,
                          { backgroundColor: "#0B79D0" },
                        ]}
                      >
                        <Icon
                          name="send"
                          size={14}
                          color="#fff"
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.statusText}>Send Quotation</Text>
                      </TouchableOpacity>
                    ) : (
                      <>
                        <View
                          ref={anchorRef}
                          style={{ alignSelf: "flex-start" }}
                        >
                          <TouchableOpacity
                            onPress={openMenuAtAnchor}
                            activeOpacity={0.85}
                            style={[
                              styles.statusPill,
                              {
                                backgroundColor: STATUS_OPTIONS.find(
                                  (s) => s.value === status
                                )?.color,
                              },
                            ]}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Icon
                              name={
                                STATUS_OPTIONS.find((s) => s.value === status)
                                  ?.icon
                              }
                              size={14}
                              color="#fff"
                              style={{ marginRight: 6 }}
                            />
                            <Text style={styles.statusText}>
                              {
                                STATUS_OPTIONS.find((s) => s.value === status)
                                  ?.label
                              }
                            </Text>
                            <Icon
                              name={
                                openDropdown ? "chevron-up" : "chevron-down"
                              }
                              size={14}
                              color="#fff"
                              style={{ marginLeft: 6 }}
                            />
                          </TouchableOpacity>
                        </View>

                        <Portal>
                          <Menu
                            key={menuKey || "menu"}
                            visible={openDropdown}
                            onDismiss={handleDismiss}
                            anchor={
                              anchorLayout
                                ? {
                                    x: anchorLayout.x,
                                    y: anchorLayout.y + anchorLayout.height,
                                    width: anchorLayout.width,
                                  }
                                : undefined
                            }
                            contentStyle={{ paddingVertical: 4 }}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <Menu.Item
                                key={st.value}
                                onPress={() => onChangeStatus(st.value)}
                                title={st.label}
                                icon={() => (
                                  <Icon
                                    name={st.icon}
                                    size={16}
                                    color={st.color}
                                  />
                                )}
                              />
                            ))}
                          </Menu>
                        </Portal>
                      </>
                    )}
                  </View>
                </View>
              </View>
            </Card.Content>
            <Divider />
          </Card>

          {item.images?.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Images
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {item.images.map((img, idx) => (
                  <Image
                    key={String(idx)}
                    source={{ uri: img }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {item.video?.length > 0 && (
            <View style={{ marginTop: 16 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Video
              </Text>
              <View
                style={{
                  width: width - 32,
                  height: 220,
                  borderRadius: 12,
                  overflow: "hidden",
                  backgroundColor: "#000",
                  alignSelf: "center",
                }}
              >
                <VideoView
                  style={{ width: "100%", height: "100%" }}
                  player={videoPlayers[0]}
                  fullscreenOptions={true}
                  allowsPictureInPicture
                  contentFit="contain"
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ visible: false, msg: "" })}
        duration={2200}
        action={{
          label: "OK",
          onPress: () => setSnack({ visible: false, msg: "" }),
        }}
      >
        {snack.msg}
      </Snackbar>

      {quotationItem && (
        <SendQuotationPopup
          visible={!!quotationItem}
          item={quotationItem}
          onDismiss={() => setQuotationItem(null)}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { borderRadius: 12 },
  cardInner: { paddingVertical: 12 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { elevation: 0 },
  serviceName: { fontSize: 16, fontWeight: "700" },
  subtle: { fontSize: 13, marginTop: 2 },
  badgeWrap: { marginLeft: 8 },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  typeText: { fontSize: 13, fontWeight: "700" },
  metaRow: { flexDirection: "row", marginTop: 12, alignItems: "center" },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  metaText: { fontSize: 13 },
  addressRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  addressText: { fontSize: 13, flexShrink: 1 },
  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftAction: { flex: 1, alignItems: "flex-start" },
  pillWrapper: { position: "relative", alignSelf: "flex-start" },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
  },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  image: { width: width / 2.5, height: 150, borderRadius: 12, marginRight: 12 },
});
