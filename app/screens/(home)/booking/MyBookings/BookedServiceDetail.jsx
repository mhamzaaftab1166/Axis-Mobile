// screens/(home)/book-service/listing/BookedServiceDetail.js
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Appbar, Divider, Menu, Text, useTheme } from "react-native-paper";
import ConfirmDialog from "../../../../components/common/ConfirmDialog";
import CustomDataTable from "../../../../components/common/DataTable";
import DetailItem from "../../../../components/home/bookings/DetailItem";
import {
  serviceTableColumns,
  staticServiceData,
} from "../../../../helpers/contantData";
import {
  getAddressTextDetail,
  getScheduleTextDetail,
  getStatusColor,
} from "../../../../helpers/general";

export default function BookedServiceDetail() {
  const { bookedService } = useLocalSearchParams();
  const service = bookedService ? JSON.parse(bookedService) : null;
  const { colors, fonts } = useTheme();
  const screenBg = colors.background;

  const [menuVisible, setMenuVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const openDialog = () => {
    closeMenu();
    setDialogVisible(true);
  };
  const closeDialog = () => setDialogVisible(false);

  const confirmTerminate = () => {
    console.log("Terminated ID:", service?.id);
    closeDialog();
  };

  const handleUpdate = () => {
    closeMenu();
    if (!service) return;
    router.push({
      pathname: "",
      params: { bookedService: JSON.stringify(service) },
    });
  };

  const statusColor = getStatusColor(service?.status);
  const scheduleText = getScheduleTextDetail(service);
  const addressText = getAddressTextDetail(service);
  const servicesArray = service?.services || [];

  // optional: calculate total price
  const totalPrice = servicesArray.reduce(
    (sum, svc) => sum + (svc.price || 0),
    0
  );

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />
      <Appbar.Header style={{ backgroundColor: colors.primary }}>
        <Appbar.BackAction
          onPress={() => router.back()}
          color={colors.onPrimary}
        />
        <Appbar.Content
          title="Service Detail"
          titleStyle={{ color: colors.onPrimary, fontFamily: fonts.medium }}
        />
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              color={colors.onPrimary}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item onPress={handleUpdate} title="Update" />
          <Menu.Item onPress={openDialog} title="Terminate" />
        </Menu>
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top Section */}
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.propertyTitle,
                { color: colors.text, fontFamily: fonts.medium },
              ]}
            >
              {addressText}
            </Text>
            <Text style={[styles.smallMuted, { color: colors.placeholder }]}>
              {servicesArray.map((s) => s.name).join(", ") || "No services"}
            </Text>
          </View>

          <View
            style={[styles.statusBadge, { backgroundColor: statusColor?.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColor?.text }]}>
              {service?.status}
            </Text>
          </View>
        </View>

        <Divider
          style={[styles.divider, { backgroundColor: colors.outlineVariant }]}
        />

        {/* Services List */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Services
        </Text>

        {servicesArray.length > 0 ? (
          <View
            style={[styles.serviceList, { backgroundColor: colors.background }]}
          >
            {servicesArray.map((svc, index) => (
              <View key={svc.id} style={styles.serviceRow}>
                <Text
                  style={[
                    styles.serviceName,
                    { color: colors.text, fontFamily: fonts.medium },
                  ]}
                  numberOfLines={1}
                >
                  {svc.name}
                </Text>
                <Text
                  style={[
                    styles.servicePrice,
                    { color: colors.primary, fontFamily: fonts.bold },
                  ]}
                >
                  ${svc.price}
                </Text>
              </View>
            ))}
            <Divider style={{ marginVertical: 8 }} />
            <View style={styles.serviceRow}>
              <Text
                style={[
                  styles.serviceName,
                  { color: colors.text, fontFamily: fonts.medium },
                ]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.servicePrice,
                  { color: colors.primary, fontFamily: fonts.bold },
                ]}
              >
                ${totalPrice}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.placeholder }}>No services</Text>
        )}

        <Divider
          style={[styles.divider, { backgroundColor: colors.outlineVariant }]}
        />

        {/* Materials */}
        <DetailItem
          icon="cube-outline"
          iconBg="#FF9800"
          label="Materials"
          value={service?.materialRequired ? "Required" : "Not Required"}
        />

        {/* Schedule */}
        <DetailItem
          icon={
            service?.serviceTime?.mode === "oneTime"
              ? "calendar"
              : "calendar-range"
          }
          iconBg="#4CAF50"
          label="Schedule"
          value={scheduleText || "—"}
        />

        <Divider
          style={[styles.divider, { backgroundColor: colors.outlineVariant }]}
        />

        {/* Upcoming Services */}
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[
              styles.sectionTitle,
              {
                fontFamily: fonts.medium,
                color: colors.text,
                fontWeight: "700",
              },
            ]}
          >
            Upcoming Services
          </Text>
        </View>

        <CustomDataTable
          data={staticServiceData}
          columns={serviceTableColumns}
          showPagination={true}
        />
      </ScrollView>

      {/* Terminate Dialog */}
      <ConfirmDialog
        visible={dialogVisible}
        title="Terminate Service"
        message="Are you sure you want to terminate this service?"
        onCancel={closeDialog}
        onConfirm={confirmTerminate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  propertyTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  smallMuted: { fontSize: 13, marginBottom: 6 },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginLeft: 12,
  },
  statusText: { fontWeight: "600", fontSize: 14 },
  divider: { marginVertical: 12 },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },

  // Services list
  serviceList: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  serviceName: {
    fontSize: 15,
    flex: 1,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: "700",
  },

  sectionHeaderRow: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});
