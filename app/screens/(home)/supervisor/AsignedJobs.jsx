// screens/AssignedJobs.js
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
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
  List,
  Snackbar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import CenteredAppbarHeader from "../../../components/common/CenteredAppBar";

import EmptyState from "../../../components/common/EmptyState";
import LoadingOverlay from "../../../components/LoadingOverlay";
import {
  SUB_SERVICES_AVAILABLE_STATUSES,
  subServicesStatusGroups,
} from "../../../helpers/contantData";
import {
  filterByStatus,
  getSubServiceStatusConfig,
} from "../../../helpers/general";
import { useUpdateSubServiceStatus } from "../../../hooks/useBookingQuery";
import { useSupServicesStore } from "../../../store/useSupServicesStore";

export default function AssignedJobs() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { colors, dark, fonts } = theme;

  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: "" });

  const cardBackground = dark ? colors.surface : "#FFFFFF";
  const mutedText = dark ? "#AAB0B6" : "#6B7280";
  const surfaceElevation = Platform.OS === "android" ? 2 : 1;
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const toggleDropdown = (subId) =>
    setOpenDropdownFor((prev) => (prev === subId ? null : subId));

  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateSubServiceStatus({
      onErrorCallback: (errMsg) => {
        setError(errMsg);
        setIsError(true);
      },
      onSuccessCallback: (data) => {
        setError("");
        setIsError(false);

        setOpenDropdownFor(null);
        setSnackbar({
          visible: true,
          message: `Status updated to ${data?.newStatus}`,
        });

        setServices((prev) =>
          prev.map((svc) =>
            svc.id !== data?.serviceId
              ? svc
              : {
                  ...svc,
                  subServices: svc.subServices.map((s) =>
                    s.id !== data?.subId ? s : { ...s, status: data?.newStatus }
                  ),
                }
          )
        );
        useSupServicesStore
          .getState()
          .updateServiceStatus(data?.serviceId, data?.subId, data?.newStatus);
      },
    });

  const [services, setServices] = useState(
    filterByStatus(
      useSupServicesStore((s) => s.services),
      subServicesStatusGroups.assigned
    )
  );

  const handleChangeStatus = (serviceId, subId, newStatus) => {
    updateStatus({
      serviceId,
      subId,
      newStatus: newStatus.trim(),
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Assigned Jobs"
        onBack={() => navigation.goBack()}
        cartDisplay={false}
      />
      <LoadingOverlay visible={updatingStatus} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          services.length === 0 && { flex: 1, justifyContent: "center" },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {services.length === 0 ? (
          <EmptyState
            iconName="home"
            title="No Assigned Job!"
            description="You have 0 assigned jobs."
          />
        ) : (
          services.map((service) => (
            <List.Section key={service.id} style={styles.serviceSection}>
              <List.Accordion
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
                            { backgroundColor: cardBackground },
                          ]}
                        >
                          <View
                            style={{ borderRadius: 14, overflow: "hidden" }}
                          >
                            <View style={styles.cardInner}>
                              <View style={styles.rowSpace}>
                                <View style={styles.idLeft}>
                                  <Avatar.Text
                                    size={36}
                                    label={sub.id
                                      .replace(/[^A-Z0-9]/gi, "")
                                      .slice(-2)}
                                    style={{
                                      backgroundColor: dark
                                        ? "#0F1720"
                                        : "#EEF2FF",
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

                              {/* Row 2: Date and Time */}
                              <View
                                style={[styles.rowSpace, { marginTop: 12 }]}
                              >
                                <View style={styles.infoLeft}>
                                  <MaterialCommunityIcons
                                    name="calendar-outline"
                                    size={16}
                                    color={mutedText}
                                  />
                                  <Text
                                    style={[
                                      styles.infoText,
                                      { color: mutedText },
                                    ]}
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
                                    style={[
                                      styles.infoText,
                                      { color: mutedText },
                                    ]}
                                  >
                                    {sub.time}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </Surface>

                        {/* Dropdown rendered outside the inner overflow wrapper */}
                        {isOpen && (
                          <View
                            style={[
                              styles.dropdown,
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
                  })}
                </View>
              </List.Accordion>
            </List.Section>
          ))
        )}
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: "" })}
        duration={2500}
        action={{
          label: "OK",
          onPress: () => setSnackbar({ visible: false, message: "" }),
        }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  serviceSection: { marginBottom: 12, borderRadius: 12 },
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

  empty: { marginTop: 48, alignItems: "center" },
});
