// src/components/assigned/AssignedJobsDirect.jsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, List, Surface, Text } from "react-native-paper";
import EmptyState from "../../../../components/common/EmptyState";

export default function AssignedJobsDirect({
  services,
  setServices,
  openDropdownFor,
  toggleDropdown,
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

  return (
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

                        {/* Row 2: Date and Time */}
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

                  {/* Dropdown */}
                  {isOpen && (
                    <View
                      style={[
                        styles.dropdown,
                        { backgroundColor: dark ? colors.surface : "#FFFFFF" },
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
            })}
          </View>
        </List.Accordion>
      ))}
    </List.Section>
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
