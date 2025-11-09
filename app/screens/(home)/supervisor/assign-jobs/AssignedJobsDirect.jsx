import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
  findNodeHandle,
} from "react-native";
import {
  Avatar,
  List,
  Menu,
  Portal,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import EmptyState from "../../../../components/common/EmptyState";

export default function AssignedJobsDirect({
  services,
  setServices,
  openDropdownFor,
  toggleDropdown: parentToggleDropdown,
  handleChangeStatus,
  getSubServiceStatusConfig,
  SUB_SERVICES_AVAILABLE_STATUSES,
  navigation,
  colors,
  dark,
  fonts,
  mutedText,
  surfaceElevation,
}) {
  const { colors: themeColors } = useTheme();
  const anchorRefs = useRef({});
  const [anchorLayouts, setAnchorLayouts] = useState({});
  const [menuKeys, setMenuKeys] = useState({});
  const [snack, setSnack] = useState({ visible: false, msg: "" });

  if (!services || services.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <EmptyState
          iconName="home"
          title="No Assigned Job!"
          description="You have 0 assigned jobs."
        />
      </View>
    );
  }

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
      } else {
        reject(new Error("no measure method"));
      }
    });

  const toggleDropdown = async (id) => {
    if (openDropdownFor === id) {
      parentToggleDropdown(null);
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
      setTimeout(() => parentToggleDropdown(id), 30);
    } catch {
      setMenuKeys((s) => ({ ...s, [id]: String(Date.now()) }));
      setTimeout(() => parentToggleDropdown(id), 30);
    }
  };

  const handleSelectStatus = (serviceId, subId, st) => {
    handleChangeStatus(serviceId, subId, st);
    parentToggleDropdown(null);
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

  const handleMenuDismiss = (subId) => {
    parentToggleDropdown(null);
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

  return (
    <>
      <List.Section style={styles.listSection}>
        {services.map((service) => (
          <List.Accordion
            key={service.id}
            title={`Service No ${service?.uniqueNumber}`}
            description={
              service?.startDate
                ? `Start Date • ${service?.startDate}`
                : undefined
            }
            titleStyle={[
              styles.serviceTitle,
              { color: colors.text, fontFamily: fonts?.medium?.fontFamily },
            ]}
            descriptionStyle={{ color: colors.disabled }}
            style={[
              styles.accordion,
              { backgroundColor: dark ? "#050608" : "#fff" },
            ]}
            left={(props) => <List.Icon {...props} icon="folder" />}
          >
            <View style={styles.subservicesContainer}>
              {service.subServices.map((sub) => {
                const statusCfg = getSubServiceStatusConfig(sub.status);
                const isOpen = openDropdownFor === sub.id;
                return (
                  <View key={sub.id} style={{ marginBottom: 12 }}>
                    <Surface
                      elevation={surfaceElevation}
                      style={[
                        styles.card,
                        { backgroundColor: dark ? colors.surface : "#FFFFFF" },
                      ]}
                    >
                      <View style={{ borderRadius: 14, overflow: "hidden" }}>
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
                                      fontFamily: fonts?.medium?.fontFamily,
                                    },
                                  ]}
                                >
                                  {sub?.uniqueNumber}
                                </Text>
                                <Text
                                  numberOfLines={1}
                                  style={[
                                    styles.subtleText,
                                    { color: mutedText },
                                  ]}
                                >
                                  Subservice
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
                    </Surface>

                    <Portal>
                      <Menu
                        key={menuKeys[sub.id] || `menu-${sub.id}`}
                        visible={isOpen}
                        onDismiss={() => handleMenuDismiss(sub.id)}
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
              })}
            </View>
          </List.Accordion>
        ))}
      </List.Section>

      <Snackbar
        visible={snack.visible}
        onDismiss={() => setSnack({ visible: false, msg: "" })}
        duration={2500}
        action={{
          label: "OK",
          onPress: () => setSnack({ visible: false, msg: "" }),
        }}
      >
        {snack.msg}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  listSection: { padding: 16, paddingBottom: 40 },
  accordion: { paddingHorizontal: 8, paddingVertical: 0 },
  serviceTitle: { fontSize: 16 },
  subservicesContainer: { paddingHorizontal: 4, paddingVertical: 8 },

  card: {
    borderRadius: 14,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
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
    top: 60,
    right: 16,
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

  infoLeft: { flexDirection: "row", alignItems: "center" },
  infoRight: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 8, fontSize: 13 },
});
