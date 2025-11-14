import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { findNodeHandle, ScrollView, StyleSheet, TouchableOpacity, UIManager, View } from "react-native";
import { Avatar, Card, Menu, Portal, Snackbar, Text, useTheme } from "react-native-paper";
import { filterInspectionServices } from "../../helpers/general";
import { ROUTES } from "../../helpers/routePaths";
import { useUpdateSubServiceStatus } from "../../hooks/useBookingQuery";
import { useSubmitQuotation } from "../../hooks/useInspectionServices";
import SendQuotationPopup from "../../screens/(home)/supervisor/assign-jobs/SendQuotationPopup";
import { useSupServicesStore } from "../../store/useSupServicesStore";
import LoadingOverlay from "../LoadingOverlay";

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
  {
    label: "Payment Pending",
    value: "paymentpending",
    color: "#000303ff",
    icon: "close-circle-outline",
  },
  { label: "Cancelled", value: "cancelled", color: "#e74c3c", icon: "cancel" },
];

const INSPECTION_FILTERS = ["All", "Online", "Physical"];

export default function WeekInspection() {

  // fetch inspection assigned servics
  const inspectionServices = useSupServicesStore((s) => s.inspectionServices);
  const services = filterInspectionServices(inspectionServices);

  const { colors, dark } = useTheme();
  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const [snack, setSnack] = useState({ visible: false, msg: "", type: "" });
  const [quotationItem, setQuotationItem] = useState(null);

  const anchorRef = useRef(null);
  const [anchorLayout, setAnchorLayout] = useState(null);
  const [menuKey, setMenuKey] = useState(null);

  const filterAnchorRef = useRef(null);
  const [filterAnchorLayout, setFilterAnchorLayout] = useState(null);
  const [filterMenuKey, setFilterMenuKey] = useState(null);
  const [filterType, setFilterType] = useState("All");

  const measureInWindowAsync = (node) =>
    new Promise((resolve, reject) => {
      const handle = findNodeHandle(node);
      if (!handle) return reject(new Error("no handle"));
      if (UIManager && UIManager.measureInWindow) {
        UIManager.measureInWindow(handle, (x, y, w, h) =>
          resolve({ x, y, width: w, height: h })
        );
      } else if (node && node.measureInWindow) {
        node.measureInWindow((x, y, w, h) =>
          resolve({ x, y, width: w, height: h })
        );
      } else reject(new Error("no measure method"));
    });

  const toggleDropdown = async (id, node) => {
    if (openDropdownFor === id) {
      setOpenDropdownFor(null);
      setAnchorLayout(null);
      setMenuKey(null);
      return;
    }
    try {
      const layout = await measureInWindowAsync(node);
      setAnchorLayout(layout);
      setMenuKey(String(Date.now()));
      setTimeout(() => setOpenDropdownFor(id), 30);
    } catch {
      setMenuKey(String(Date.now()));
      setTimeout(() => setOpenDropdownFor(id), 30);
    }
  };

  const toggleFilterDropdown = async () => {
    if (openDropdownFor === "filter") {
      setOpenDropdownFor(null);
      setFilterAnchorLayout(null);
      setFilterMenuKey(null);
      return;
    }
    try {
      const layout = await measureInWindowAsync(filterAnchorRef.current);
      setFilterAnchorLayout(layout);
      setFilterMenuKey(String(Date.now()));
      setTimeout(() => setOpenDropdownFor("filter"), 30);
    } catch {
      setFilterMenuKey(String(Date.now()));
      setTimeout(() => setOpenDropdownFor("filter"), 30);
    }
  };

  const handleFilterSelect = (type) => {
    setFilterType(type);
    setOpenDropdownFor(null);
    setFilterAnchorLayout(null);
    setFilterMenuKey(null);
  };

  const onViewDetails = (item) => {
    router.push({
      pathname: ROUTES.INSPECT_JOB_DETAILS_VIEW,
      params: { item: JSON.stringify(item) },
    });
  };

  const onSendQuotation = (item) => setQuotationItem(item);

  const filteredItems = useMemo(() => {
    return services.filter((svc) =>
      filterType === "All"
        ? svc
        : svc.filter((item) => item.status === filterType),
    );
  }, [services, filterType]);

  const { mutate: submitQuotation, isPending: isSubmittingQuotation } = useSubmitQuotation({
    onErrorCallback: (errMsg) => {
      setSnack({ visible: true, message: errMsg, type: "error" })
    },
    onSuccessCallback: () => {
      setQuotationItem(null);
      setSnack({
        visible: true,
        msg: `Quotation Submitted`,
        type: "success",
      });
    },
  });

  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateSubServiceStatus({
    onErrorCallback: (errMsg) => setSnack({ visible: true, msg: errMsg, type: "error" }),
    onSuccessCallback: (data) => {
      setSnack({
        visible: true,
        msg: `Status updated to ${data?.newStatus}`,
        type: "success"
      });
      setOpenDropdownFor(null);
      setAnchorLayout(null);
      setMenuKey(null);
      useSupServicesStore.getState().updateInspectionServiceStatus(data?.inspectionServiceId, data?.newStatus);
    },
  });

  const onChangeStatus = (item, newStatus) => {
    updateStatus({
      inspectionServiceId: item.id, 
      newStatus
    });
  };

  return (
    <>
      <View style={[styles.headerRow, { marginBottom: 12 }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          This Week Inspections
        </Text>
        <LoadingOverlay visible={updatingStatus} />
        <View style={styles.filterWrapper}>
          <View ref={filterAnchorRef}>
            <TouchableOpacity
              onPress={toggleFilterDropdown}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.filterPill,
                  { backgroundColor: dark ? colors.outlineVariant : "#EEF2FF" },
                ]}
              >
                <Text style={{ color: dark ? "#fff" : "#3730A3" }}>
                  {filterType}
                </Text>
                <Icon
                  name={
                    openDropdownFor === "filter" ? "chevron-up" : "chevron-down"
                  }
                  size={16}
                  color={dark ? "#fff" : "#3730A3"}
                  style={{ marginLeft: 6 }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Portal>
            <Menu
              key={filterMenuKey || "filter-menu"}
              visible={openDropdownFor === "filter"}
              onDismiss={() => {
                setOpenDropdownFor(null);
                setFilterAnchorLayout(null);
                setFilterMenuKey(null);
              }}
              anchor={
                filterAnchorLayout
                  ? {
                      x: filterAnchorLayout.x,
                      y: filterAnchorLayout.y + filterAnchorLayout.height,
                      width: filterAnchorLayout.width,
                    }
                  : undefined
              }
              contentStyle={{ paddingVertical: 4 }}
            >
              {INSPECTION_FILTERS.map((type) => (
                <Menu.Item
                  key={type}
                  title={type}
                  onPress={() => handleFilterSelect(type)}
                />
              ))}
            </Menu>
          </Portal>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.map((item) => {
          const statusCfg = STATUS_OPTIONS.find((s) => s.value === (item.serviceStatus || "").toLowerCase() ) || STATUS_OPTIONS[0];
          
          const isOpen = openDropdownFor === item.id;
          return (
            <View
              key={item.id}
              style={{ marginBottom: 12, position: "relative" }}
            >
              <View
                style={{
                  borderRadius: 12,
                  backgroundColor: dark ? "#1F2937" : "#fff",
                  borderWidth: 1,
                  borderColor: dark ? "#374151" : "#E5E7EB",
                  elevation: 0,
                  overflow: "hidden",
                }}
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
                    >{`  ${item.address}`}</Text>
                  </View>

                  <View style={styles.actionsRow}>
                    <View style={styles.leftAction}>
                      {!item.quotation ? (
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
                          <Text style={styles.statusText}>Send Quotation</Text>
                        </TouchableOpacity>
                      ) : (
                        <View
                          ref={(r) => (anchorRef.current = r)}
                          style={{ alignSelf: "flex-start" }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              toggleDropdown(item.id, anchorRef.current)
                            }
                            activeOpacity={0.85}
                            style={[
                              styles.statusPill,
                              { backgroundColor: statusCfg.color },
                            ]}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
                          </TouchableOpacity>
                        </View>
                      )}
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
              </View>

              <Portal>
                <Menu
                  key={menuKey || `menu-${item.id}`}
                  visible={isOpen}
                  onDismiss={() => setOpenDropdownFor(null)}
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
                      onPress={() => onChangeStatus(item, st.value)}
                      disabled={item?.serviceStatus === "paymentPending"}
                      title={st.label}
                      icon={() => (
                        <Icon name={st.icon} size={16} color={st.color} />
                      )}
                    />
                  ))}
                </Menu>
              </Portal>
            </View>
          );
        })}
      </ScrollView>

      <Portal>
        <Snackbar
          visible={snack.visible}
          onDismiss={() => setSnack({ visible: false, msg: "", type: "" })}
          duration={2200}
          action={{
            label: "OK",
            onPress: () => setSnack({ visible: false, msg: "", type: "" }),
          }}
        >
          <Text style={{ color: snack.type === "error" ? "red" : "#0fdd08ff" }}>
            {snack.msg}
          </Text>
        </Snackbar>
      </Portal>

      {quotationItem && (
        <SendQuotationPopup
          visible={!!quotationItem}
          item={quotationItem}
          onDismiss={() => setQuotationItem(null)}
          isLoading={isSubmittingQuotation}
          onSubmit={(id,values)=>{
            submitQuotation({
              serviceId: id,
              quotation: values?.amount,
              remarks: values?.remarks
            });
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700" },
  filterWrapper: { position: "relative" },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
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
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 13 },
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
