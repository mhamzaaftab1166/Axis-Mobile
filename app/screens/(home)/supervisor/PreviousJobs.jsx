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
import { Avatar, List, Surface, Text, useTheme } from "react-native-paper";
import CenteredAppbarHeader from "../../../components/common/CenteredAppBar";
import { getSubServiceStatusConfig } from "../../../helpers/general";

const SAMPLE_SERVICES = [
  {
    serviceNo: "1234",
    id: "service-1234",
    startDate: "10 September, 2025",
    subServices: [
      {
        id: "SS-1001",
        scheduledDate: "10 September, 2025",
        time: "10:00",
        status: "Completed",
      },
      {
        id: "SS-1002",
        scheduledDate: "10 September, 2025",
        time: "12:00",
        status: "Missed",
      },
      {
        id: "SS-1003",
        scheduledDate: "11 September, 2025",
        time: "09:30",
        status: "Cancelled",
      },
    ],
  },
  {
    serviceNo: "1235",
    id: "service-1235",
    startDate: "09 September, 2025",
    subServices: [
      {
        id: "SS-2001",
        scheduledDate: "09 September, 2025",
        time: "08:00",
        status: "Completed",
      },
      {
        id: "SS-2002",
        scheduledDate: "09 September, 2025",
        time: "14:00",
        status: "Completed",
      },
    ],
  },
];

export default function CompletedJobs() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { colors, dark, fonts } = theme;

  const [services] = useState(SAMPLE_SERVICES);

  const cardBackground = dark ? colors.surface : "#FFFFFF";
  const mutedText = dark ? "#AAB0B6" : "#6B7280";
  const surfaceElevation = Platform.OS === "android" ? 2 : 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Previous Jobs"
        onBack={() => navigation.goBack()}
        cartDisplay={false}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {services.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ color: colors.disabled }}>
              No completed jobs found.
            </Text>
          </View>
        ) : (
          services.map((service) => (
            <List.Section key={service.id} style={styles.serviceSection}>
              <List.Accordion
                title={`Service No ${service.serviceNo}`}
                description={
                  service.startDate
                    ? `Start Date • ${service.startDate}`
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

                    return (
                      <Surface
                        key={sub.id}
                        elevation={surfaceElevation}
                        style={[
                          styles.card,
                          { backgroundColor: cardBackground },
                        ]}
                      >
                        {/* Inner wrapper for shadow + overflow handling */}
                        <View style={{ borderRadius: 14, overflow: "hidden" }}>
                          <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => {}}
                            style={styles.cardInner}
                          >
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
                                    {sub.id}
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
                          </TouchableOpacity>
                        </View>
                      </Surface>
                    );
                  })}
                </View>
              </List.Accordion>
            </List.Section>
          ))
        )}
      </ScrollView>
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

  statusWrap: { marginLeft: 8 },
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

  infoLeft: { flexDirection: "row", alignItems: "center" },
  infoRight: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 8, fontSize: 13 },

  empty: { marginTop: 48, alignItems: "center" },
});
