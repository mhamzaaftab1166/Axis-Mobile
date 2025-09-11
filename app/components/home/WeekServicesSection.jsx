import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text, useTheme } from "react-native-paper";
import { SUB_SERVICES_AVAILABLE_STATUSES } from "../../helpers/contantData";
import { getSubServiceStatusConfig } from "../../helpers/general";

export default function WeekServicesSection({ services }) {
  const theme = useTheme();
  const { colors, dark, fonts } = theme;
  const [filterStatus, setFilterStatus] = useState("All");
  const [openDropdownFor, setOpenDropdownFor] = useState(null);

  const cardBackground = dark ? "#1F2937" : "#fff";
  const mutedText = dark ? "#AAB0B6" : "#6B7280";
  const borderColor = dark ? "#374151" : "#E5E7EB";

  const toggleDropdown = (id) =>
    setOpenDropdownFor((prev) => (prev === id ? null : id));

  const handleChangeStatus = (serviceId, subId, newStatus) => {
    services.forEach((svc) => {
      if (svc.id === serviceId) {
        const sub = svc.subServices.find((s) => s.id === subId);
        if (sub) sub.status = newStatus.trim();
      }
    });
    setOpenDropdownFor(null);
  };

  const filteredServices = services.map((svc) => ({
    ...svc,
    subServices:
      filterStatus === "All"
        ? svc.subServices
        : svc.subServices.filter((s) => s.status === filterStatus),
  }));

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerRow}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontFamily: fonts.medium?.fontFamily },
          ]}
        >
          This Week Services
        </Text>
        <View style={styles.filterWrapper}>
          <TouchableOpacity
            onPress={() => toggleDropdown("filter")}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.filterPill,
                { backgroundColor: dark ? colors.outlineVariant : "#EEF2FF" },
              ]}
            >
              <Text style={{ color: dark ? "#fff" : "#3730A3" }}>
                {filterStatus}
              </Text>
              <MaterialCommunityIcons
                name={
                  openDropdownFor === "filter" ? "chevron-up" : "chevron-down"
                }
                size={16}
                color={dark ? "#fff" : "#3730A3"}
                style={{ marginLeft: 6 }}
              />
            </View>
          </TouchableOpacity>
          {openDropdownFor === "filter" && (
            <View
              style={[styles.dropdownMenu, { backgroundColor: cardBackground }]}
            >
              {["All", ...SUB_SERVICES_AVAILABLE_STATUSES].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFilterStatus(st);
                    setOpenDropdownFor(null);
                  }}
                >
                  <MaterialCommunityIcons
                    name={
                      st === "All"
                        ? "format-list-bulleted"
                        : getSubServiceStatusConfig(st).icon
                    }
                    size={16}
                    color={
                      st === "All"
                        ? mutedText
                        : getSubServiceStatusConfig(st).color
                    }
                    style={{ width: 22 }}
                  />
                  <Text
                    style={[styles.dropdownItemText, { color: colors.text }]}
                  >
                    {st}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.servicesList, { paddingBottom: 200 }]}
      >
        {filteredServices.map((service) =>
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
                            label={sub.id.replace(/[^A-Z0-9]/gi, "").slice(-2)}
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
                              {sub.id}
                            </Text>
                            <Text
                              style={[styles.subtleText, { color: mutedText }]}
                            >
                              Subservice
                            </Text>
                          </View>
                        </View>
                        <View style={styles.statusWrap}>
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
                                name={isOpen ? "chevron-up" : "chevron-down"}
                                size={14}
                                color="#fff"
                                style={{ marginLeft: 6 }}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={[styles.rowSpace, { marginTop: 12 }]}>
                        <View style={styles.infoLeft}>
                          <MaterialCommunityIcons
                            name="calendar-outline"
                            size={16}
                            color={mutedText}
                          />
                          <Text style={[styles.infoText, { color: mutedText }]}>
                            {sub.scheduledDate}
                          </Text>
                        </View>
                        <View style={styles.infoRight}>
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={16}
                            color={mutedText}
                          />
                          <Text style={[styles.infoText, { color: mutedText }]}>
                            {sub.time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {isOpen && (
                  <View
                    style={[
                      styles.dropdownMenu,
                      { backgroundColor: cardBackground },
                    ]}
                  >
                    {SUB_SERVICES_AVAILABLE_STATUSES.map((st) => {
                      const cfg = getSubServiceStatusConfig(st);
                      return (
                        <TouchableOpacity
                          key={st}
                          style={styles.dropdownItem}
                          activeOpacity={0.7}
                          onPress={() =>
                            handleChangeStatus(service.id, sub.id, st)
                          }
                        >
                          <MaterialCommunityIcons
                            name={cfg.icon}
                            size={16}
                            color={cfg.color}
                            style={{ width: 22 }}
                          />
                          <Text
                            style={[
                              styles.dropdownItemText,
                              { color: colors.text },
                            ]}
                          >
                            {cfg.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
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
  dropdownMenu: {
    position: "absolute",
    top: 60,
    right: 16,
    borderRadius: 10,
    paddingVertical: 6,
    minWidth: 160,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemText: { marginLeft: 10, fontSize: 14 },
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
