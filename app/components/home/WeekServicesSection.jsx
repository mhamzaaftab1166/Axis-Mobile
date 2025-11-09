import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
  findNodeHandle,
} from "react-native";
import {
  Avatar,
  Menu,
  Portal,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";
import { SUB_SERVICES_AVAILABLE_STATUSES } from "../../helpers/contantData";
import {
  getNextWeekServices,
  getSubServiceStatusConfig,
} from "../../helpers/general";
import { useUpdateSubServiceStatus } from "../../hooks/useBookingQuery";
import { useSupServicesStore } from "../../store/useSupServicesStore";
import EmptyState from "../common/EmptyState";
import LoadingOverlay from "../LoadingOverlay";

export default function WeekServicesSection() {
  const theme = useTheme();
  const { colors, dark, fonts } = theme;
  const [filterStatus, setFilterStatus] = useState("All");
  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const cardBackground = dark ? "#1F2937" : "#fff";
  const mutedText = dark ? "#AAB0B6" : "#6B7280";
  const borderColor = dark ? "#374151" : "#E5E7EB";
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "",
  });

  const supervisorServices = useSupServicesStore((s) => s.services);
  const services = getNextWeekServices(supervisorServices);

  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateSubServiceStatus({
      onErrorCallback: (errMsg) =>
        setSnackbar({ visible: true, message: errMsg, type: "error" }),
      onSuccessCallback: (data) => {
        setSnackbar({
          visible: true,
          message: `Status updated to ${data?.newStatus}`,
          type: "success",
        });
        useSupServicesStore
          .getState()
          .updateServiceStatus(data?.serviceId, data?.subId, data?.newStatus);
        useSupServicesStore.getState().moveFromAssignedToPrevious();
      },
    });

  const filteredServices = services?.map((svc) => ({
    ...svc,
    subServices:
      filterStatus === "All"
        ? svc.subServices
        : svc.subServices.filter((s) => s.status === filterStatus),
  }));

  const anchorRefs = useRef({});
  const [anchorLayouts, setAnchorLayouts] = useState({});
  const [menuKeys, setMenuKeys] = useState({});
  const filterAnchorRef = useRef(null);
  const [filterAnchorLayout, setFilterAnchorLayout] = useState(null);
  const [filterMenuKey, setFilterMenuKey] = useState(null);

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

  const toggleDropdown = async (id) => {
    if (openDropdownFor === id) {
      setOpenDropdownFor(null);
      setAnchorLayouts((s) => {
        const n = { ...s };
        delete n[id];
        return n;
      });
      setMenuKeys((s) => {
        const n = { ...s };
        delete n[id];
        return n;
      });
      return;
    }
    try {
      const node = anchorRefs.current[id];
      const layout = await measureInWindowAsync(node);
      setAnchorLayouts((s) => ({ ...s, [id]: layout }));
      setMenuKeys((s) => ({ ...s, [id]: String(Date.now()) }));
      setTimeout(() => setOpenDropdownFor(id), 30);
    } catch {
      setMenuKeys((s) => ({ ...s, [id]: String(Date.now()) }));
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
      const node = filterAnchorRef.current;
      const layout = await measureInWindowAsync(node);
      setFilterAnchorLayout(layout);
      setFilterMenuKey(String(Date.now()));
      setTimeout(() => setOpenDropdownFor("filter"), 30);
    } catch {
      setFilterMenuKey(String(Date.now()));
      setTimeout(() => setOpenDropdownFor("filter"), 30);
    }
  };

  const handleChangeStatus = (serviceId, subId, newStatus) => {
    updateStatus({ serviceId, subId, newStatus: newStatus.trim() });
  };

  const handleSelectStatus = (serviceId, subId, st) => {
    handleChangeStatus(serviceId, subId, st);
    setOpenDropdownFor(null);
    setAnchorLayouts((s) => {
      const n = { ...s };
      delete n[subId];
      return n;
    });
    setMenuKeys((s) => {
      const n = { ...s };
      delete n[subId];
      return n;
    });
  };

  const handleFilterSelect = (st) => {
    setFilterStatus(st);
    setOpenDropdownFor(null);
    setFilterAnchorLayout(null);
    setFilterMenuKey(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <LoadingOverlay visible={updatingStatus} />
      {filteredServices?.length > 0 && (
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontFamily: fonts.medium?.fontFamily },
            ]}
          >
            This Week Direct Services
          </Text>
          <View style={styles.filterWrapper}>
            <View ref={filterAnchorRef}>
              <TouchableOpacity
                onPress={toggleFilterDropdown}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.filterPill,
                    {
                      backgroundColor: dark ? colors.outlineVariant : "#EEF2FF",
                    },
                  ]}
                >
                  <Text style={{ color: dark ? "#fff" : "#3730A3" }}>
                    {filterStatus}
                  </Text>
                  <MaterialCommunityIcons
                    name={
                      openDropdownFor === "filter"
                        ? "chevron-up"
                        : "chevron-down"
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
                {["All", ...SUB_SERVICES_AVAILABLE_STATUSES].map((st) => (
                  <Menu.Item
                    key={st}
                    onPress={() => handleFilterSelect(st)}
                    title={st}
                    icon={() =>
                      st === "All" ? (
                        <MaterialCommunityIcons
                          name="format-list-bulleted"
                          size={16}
                          color={mutedText}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name={getSubServiceStatusConfig(st).icon}
                          size={16}
                          color={getSubServiceStatusConfig(st).color}
                        />
                      )
                    }
                  />
                ))}
              </Menu>
            </Portal>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={[styles.servicesList]}>
        {filteredServices?.length === 0 ? (
          <EmptyState
            iconName="home"
            title="No Upcoming Jobs!"
            description="You have 0 upcoming jobs."
          />
        ) : (
          filteredServices?.map((service) =>
            service.subServices.map((sub) => {
              const statusCfg = getSubServiceStatusConfig(sub.status);
              const isOpen = openDropdownFor === sub.id;
              return (
                <View
                  key={sub.id}
                  style={{ marginBottom: 12, overflow: "visible" }}
                >
                  <View
                    style={[
                      styles.card,
                      { backgroundColor: cardBackground, borderColor },
                    ]}
                  >
                    <View style={{ borderRadius: 14, overflow: "visible" }}>
                      <View style={styles.cardInner}>
                        <View style={styles.rowSpace}>
                          <View style={styles.idLeft}>
                            <Avatar.Text
                              size={36}
                              label={sub.id
                                .replace(/[^A-Z0-9]/gi, "")
                                .slice(-2)}
                              style={{
                                backgroundColor: dark ? "#0F1720" : "#EEF2FF",
                                marginRight: 12,
                              }}
                              labelStyle={{
                                color: dark ? "#E6EDF3" : "#3730A3",
                                fontSize: 12,
                              }}
                            />
                            <View style={{ flexShrink: 1 }}>
                              <Text
                                style={[
                                  styles.idText,
                                  {
                                    color: colors.text,
                                    fontFamily: fonts.medium?.fontFamily,
                                  },
                                ]}
                              >
                                {sub?.uniqueNumber}
                              </Text>
                              <Text
                                style={[
                                  styles.subtleText,
                                  { color: mutedText },
                                ]}
                              >
                                {service.requestedService}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.statusWrap}>
                            <View
                              ref={(r) => (anchorRefs.current[sub.id] = r)}
                              style={{ alignSelf: "flex-end" }}
                            >
                              <TouchableOpacity
                                onPress={() => toggleDropdown(sub.id)}
                                activeOpacity={0.85}
                              >
                                <View
                                  style={[
                                    styles.statusPill,
                                    { backgroundColor: statusCfg.color },
                                  ]}
                                >
                                  <MaterialCommunityIcons
                                    name={statusCfg.icon}
                                    size={14}
                                    color="#fff"
                                    style={{ marginRight: 6 }}
                                  />
                                  <Text style={styles.statusText}>
                                    {statusCfg.label}
                                  </Text>
                                  <MaterialCommunityIcons
                                    name={
                                      isOpen ? "chevron-up" : "chevron-down"
                                    }
                                    size={14}
                                    color="#fff"
                                    style={{ marginLeft: 6 }}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                        <View style={[styles.rowSpace, { marginTop: 12 }]}>
                          <View style={styles.infoLeft}>
                            <MaterialCommunityIcons
                              name="calendar-outline"
                              size={16}
                              color={mutedText}
                            />
                            <Text
                              style={[styles.infoText, { color: mutedText }]}
                            >
                              {sub.scheduledDate}
                            </Text>
                          </View>
                          <View style={styles.infoRight}>
                            <MaterialCommunityIcons
                              name="clock-outline"
                              size={16}
                              color={mutedText}
                            />
                            <Text
                              style={[styles.infoText, { color: mutedText }]}
                            >
                              {sub.time}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <Portal>
                    <Menu
                      key={menuKeys[sub.id] || `menu-${sub.id}`}
                      visible={isOpen}
                      onDismiss={() => {
                        setOpenDropdownFor(null);
                        setAnchorLayouts((s) => {
                          const n = { ...s };
                          delete n[sub.id];
                          return n;
                        });
                        setMenuKeys((s) => {
                          const n = { ...s };
                          delete n[sub.id];
                          return n;
                        });
                      }}
                      anchor={
                        anchorLayouts[sub.id]
                          ? {
                              x: anchorLayouts[sub.id].x,
                              y:
                                anchorLayouts[sub.id].y +
                                anchorLayouts[sub.id].height,
                              width: anchorLayouts[sub.id].width,
                            }
                          : undefined
                      }
                      contentStyle={{ paddingVertical: 4 }}
                    >
                      {SUB_SERVICES_AVAILABLE_STATUSES.map((st) => {
                        const cfg = getSubServiceStatusConfig(st);
                        return (
                          <Menu.Item
                            key={st}
                            onPress={() =>
                              handleSelectStatus(service.id, sub.id, st)
                            }
                            title={cfg.label}
                            icon={() => (
                              <MaterialCommunityIcons
                                name={cfg.icon}
                                size={16}
                                color={cfg.color}
                              />
                            )}
                          />
                        );
                      })}
                    </Menu>
                  </Portal>
                </View>
              );
            })
          )
        )}
      </ScrollView>

      <Portal>
        <Snackbar
          visible={snackbar.visible}
          onDismiss={() =>
            setSnackbar({ visible: false, message: "", type: "success" })
          }
          duration={2500}
          action={{
            label: "OK",
            onPress: () =>
              setSnackbar({ visible: false, message: "", type: "success" }),
          }}
        >
          <Text style={{ color: snackbar.type === "error" ? "red" : "#fff" }}>
            {snackbar.message}
          </Text>
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  servicesList: { paddingBottom: 16 },
  card: { borderRadius: 14, marginBottom: 12, borderWidth: 1 },
  cardInner: { padding: 14 },
  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  idLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  idText: { fontSize: 15, fontWeight: "700" },
  subtleText: { fontSize: 12, marginTop: 2 },
  statusWrap: { marginLeft: 8, alignItems: "flex-end", zIndex: 10 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  infoLeft: { flexDirection: "row", alignItems: "center" },
  infoRight: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 8, fontSize: 13 },
});
