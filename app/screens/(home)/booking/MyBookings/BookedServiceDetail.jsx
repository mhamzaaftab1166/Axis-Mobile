// screens/(home)/book-service/listing/BookedServiceDetail.js
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  Divider,
  Menu,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import CustomDataTable from "../../../../components/common/DataTable";
import DetailItem from "../../../../components/home/bookings/DetailItem";
import ServiceCardList from "../../../../components/home/services/ServiceCardList";
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
  const { colors, dark, fonts } = useTheme();
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

  const statusColor = getStatusColor(service.status);
  const scheduleText = getScheduleTextDetail(service);
  const addressText = getAddressTextDetail(service);
  const servicesArray = service.services || [];

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
            style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColor.text }]}>
              {service.status}
            </Text>
          </View>
        </View>

        <Divider
          style={[styles.divider, { backgroundColor: colors.outlineVariant }]}
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Services
        </Text>

        {servicesArray.map((svc) => (
          <ServiceCardList key={svc.id} service={svc} onlyView={true} />
        ))}

        <Divider
          style={[styles.divider, { backgroundColor: colors.outlineVariant }]}
        />

        <DetailItem
          icon="cube-outline"
          iconBg="#FF9800"
          label="Materials"
          value={service.materialRequired ? "Required" : "Not Required"}
        />

        <DetailItem
          icon={
            service.serviceTime?.mode === "oneTime"
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

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={closeDialog}
          style={{
            backgroundColor: dark ? colors.onPrimary : colors.primary,
            borderRadius: 12,
          }}
        >
          <Dialog.Title
            style={{
              color: dark ? colors.primary : colors.onPrimary,
              fontFamily: fonts.bold?.fontFamily,
            }}
          >
            Terminate Service?
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                color: dark ? colors.primary : colors.onPrimary,
                fontFamily: fonts.regular?.fontFamily,
              }}
            >
              Are you sure you want to terminate this service (ID: {service.id}
              )?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ justifyContent: "flex-end" }}>
            <Button
              onPress={closeDialog}
              labelStyle={{
                color: dark ? colors.primary : colors.onPrimary,
              }}
              style={{ marginRight: 8 }}
            >
              Cancel
            </Button>
            <Button
              onPress={confirmTerminate}
              labelStyle={{
                color: dark ? colors.primary : colors.onPrimary,
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  card: {
    borderRadius: 12,
  },
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

  svcCard: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
  },
  svcRow: { flexDirection: "row", alignItems: "flex-start" },
  svcImage: {
    width: 68,
    height: 68,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#EEE",
  },
  svcImagePlaceholder: { justifyContent: "center", alignItems: "center" },
  svcHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  svcName: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  svcBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  svcBadgeText: { fontSize: 12, fontWeight: "600" },
  svcDesc: { fontSize: 13, marginBottom: 8 },
  svcMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  svcPrice: { fontSize: 15, fontWeight: "700" },
  ratingWrap: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 13 },
  ratingStars: { fontSize: 14 },
  sectionHeaderRow: {
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
});
