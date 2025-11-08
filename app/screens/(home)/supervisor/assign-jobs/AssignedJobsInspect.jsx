import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Avatar,
  Card,
  Divider,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";
import { ROUTES } from "../../../../helpers/routePaths";
import SendQuotationPopup from "./SendQuotationPopup";

const SAMPLE = [
  {
    id: "ASD-1001",
    serviceName: "Home Deep Cleaning",
    serviceCategory: "Cleaning",
    inspectionType: "Physical",
    images: null,
    video: null,
    bookingDate: "2025-11-12",
    bookingTime: "10:00 AM",
    address: "Al Barsha, Dubai, UAE",
    quotationSent: false,
    status: "pending",
  },
  {
    id: "ASD-1002",
    serviceName: "AC Filter Replacement",
    serviceCategory: "Maintenance",
    inspectionType: "Online",
    images: [
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
      "https://picsum.photos/200/300",
    ],
    video: [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    ],
    bookingDate: "2025-11-15",
    bookingTime: "02:30 PM",
    address: "Business Bay, Dubai, UAE",
    quotationSent: true,
    status: "confirmed",
  },
];

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

export default function AssignedJobsInspect({ navigation }) {
  const { colors, dark } = useTheme();
  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const [items] = useState(SAMPLE);
  const [snack, setSnack] = useState({ visible: false, msg: "" });

  // <-- State for currently selected item for quotation
  const [quotationItem, setQuotationItem] = useState(null);

  const toggleDropdown = (id) =>
    setOpenDropdownFor((prev) => (prev === id ? null : id));

  const onViewDetails = (item) => {
    router.push({
      pathname: ROUTES.INSPECT_JOB_DETAILS_VIEW,
      params: {
        item: JSON.stringify(item),
      },
    });
  };

  const onSendQuotation = (item) => {
    setQuotationItem(item);
  };

  const onChangeStatus = (item, newStatus) => {
    const cfg =
      STATUS_OPTIONS.find((s) => s.value === newStatus) || STATUS_OPTIONS[0];
    setSnack({
      visible: true,
      msg: `Status change (simulated) to ${cfg.label} for ${item.id}`,
    });
    setOpenDropdownFor(null);
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => {
          const statusCfg =
            STATUS_OPTIONS.find(
              (s) => s.value === (item.status || "").toLowerCase()
            ) || STATUS_OPTIONS[0];
          const isOpen = openDropdownFor === item.id;

          return (
            <View
              key={item.id}
              style={{ marginBottom: 12, position: "relative" }}
            >
              <Card
                style={[
                  styles.card,
                  { backgroundColor: dark ? colors.surface : "#fff" },
                ]}
              >
                <Card.Content style={styles.cardInner}>
                  {/* Row Top */}
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
                        <Text
                          style={[styles.serviceName, { color: colors.text }]}
                        >
                          {item.serviceName}
                        </Text>
                        <Text
                          style={[styles.subtle, { color: colors.disabled }]}
                        >
                          {item.serviceCategory}
                        </Text>
                      </View>
                    </View>

                    {/* Inspection Type */}
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

                  {/* Meta Row */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Icon
                        name="calendar"
                        size={16}
                        color={colors.placeholder}
                      />
                      <Text
                        style={[styles.metaText, { color: colors.placeholder }]}
                      >{`  ${item.bookingDate}`}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Icon
                        name="clock-outline"
                        size={16}
                        color={colors.placeholder}
                      />
                      <Text
                        style={[styles.metaText, { color: colors.placeholder }]}
                      >{`  ${item.bookingTime}`}</Text>
                    </View>
                  </View>

                  {/* Address */}
                  <View style={styles.addressRow}>
                    <Icon
                      name="map-marker"
                      size={16}
                      color={colors.placeholder}
                    />
                    <Text
                      style={[
                        styles.addressText,
                        { color: colors.placeholder },
                      ]}
                      numberOfLines={2}
                    >
                      {`  ${item.address}`}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsRow}>
                    <View style={styles.leftAction}>
                      <View style={styles.pillWrapper}>
                        {!item.quotationSent ? (
                          <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => onSendQuotation(item)}
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
                            <Text style={styles.statusText}>
                              Send Quotation
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => toggleDropdown(item.id)}
                            activeOpacity={0.85}
                          >
                            <View
                              style={[
                                styles.statusPill,
                                { backgroundColor: statusCfg.color },
                              ]}
                            >
                              <Icon
                                name={statusCfg.icon}
                                size={14}
                                color="#fff"
                                style={{ marginRight: 6 }}
                              />
                              <Text style={styles.statusText}>
                                {statusCfg.label}
                              </Text>
                              <Icon
                                name={isOpen ? "chevron-up" : "chevron-down"}
                                size={14}
                                color="#fff"
                                style={{ marginLeft: 6 }}
                              />
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <View style={styles.rightAction}>
                      <TouchableOpacity
                        onPress={() => onViewDetails(item)}
                        activeOpacity={0.85}
                        style={styles.viewDetailsPill}
                      >
                        <Icon
                          name="eye-outline"
                          size={16}
                          color={colors.text}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={[
                            styles.viewDetailsText,
                            { color: colors.text },
                          ]}
                        >
                          View Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card.Content>
                <Divider />
              </Card>

              {/* Status Dropdown */}
              {isOpen && (
                <View
                  style={[
                    styles.dropdown,
                    { backgroundColor: dark ? colors.surface : "#FFFFFF" },
                  ]}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <TouchableOpacity
                      key={st.value}
                      style={styles.dropdownItem}
                      activeOpacity={0.7}
                      onPress={() => onChangeStatus(item, st.value)}
                    >
                      <Icon
                        name={st.icon}
                        size={16}
                        color={st.color}
                        style={{ width: 22 }}
                      />
                      <Text
                        style={[
                          styles.dropdownItemText,
                          { color: colors.text },
                        ]}
                      >
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Snackbar */}
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

      {/* Send Quotation Popup */}
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
  container: { padding: 16, paddingBottom: 40 },
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
  rightAction: { marginLeft: 12 },
  pillWrapper: { position: "relative", alignSelf: "flex-start" },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    borderRadius: 10,
    paddingVertical: 6,
    minWidth: 160,
    zIndex: 999,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: { marginLeft: 10, fontSize: 14 },
  viewDetailsPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },
  viewDetailsText: { fontWeight: "700", fontSize: 13 },
});
