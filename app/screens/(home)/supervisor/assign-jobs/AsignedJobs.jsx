// screens/AssignedJobs.js
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Snackbar, Text, useTheme } from "react-native-paper";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";

import ButtonSegmented from "../../../../components/common/ButtonSegmented";
import LoadingOverlay from "../../../../components/LoadingOverlay";

import AssignedJobsDirect from "./AssignedJobsDirect";
import AssignedJobsInspect from "./AssignedJobsInspect";

import {
  SUB_SERVICES_AVAILABLE_STATUSES,
  subServicesStatusGroups,
} from "../../../../helpers/contantData";
import {
  filterByStatus,
  getSubServiceStatusConfig,
} from "../../../../helpers/general";
import { useUpdateSubServiceStatus } from "../../../../hooks/useBookingQuery";
import { useSupServicesStore } from "../../../../store/useSupServicesStore";

export default function AssignedJobs() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { colors, dark, fonts } = theme;

  const [segment, setSegment] = useState("direct");

  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "",
  });

  const cardBackground = dark ? colors.surface : "#FFFFFF";
  const mutedText = dark ? "#AAB0B6" : "#6B7280";
  const surfaceElevation = Platform.OS === "android" ? 2 : 1;

  const toggleDropdown = (subId) =>
    setOpenDropdownFor((prev) => (prev === subId ? null : subId));

  const { mutate: updateStatus, isPending: updatingStatus } =
    useUpdateSubServiceStatus({
      onErrorCallback: (errMsg) => {
        setSnackbar({
          visible: true,
          message: errMsg,
          type: "error",
        });
      },
      onSuccessCallback: (data) => {
        setOpenDropdownFor(null);
        setSnackbar({
          visible: true,
          message: `Status updated to ${data?.newStatus}`,
          type: "success",
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

        useSupServicesStore.getState().moveFromAssignedToPrevious();
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

  const segmentOptions = [
    { value: "direct", label: "Direct" },
    { value: "inspect", label: "Inspect" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Assigned Jobs"
        onBack={() => navigation.goBack()}
        cartDisplay={false}
      />

      <View style={{ paddingHorizontal: 16 }}>
        <ButtonSegmented
          options={segmentOptions}
          selected={segment}
          onChange={setSegment}
          cardStyle={{ marginTop: 8, marginBottom: 12 }}
          colors={colors}
          dark={dark}
        />
      </View>

      <LoadingOverlay visible={updatingStatus} />

      {segment === "direct" ? (
        <AssignedJobsDirect
          services={services}
          setServices={setServices}
          openDropdownFor={openDropdownFor}
          toggleDropdown={toggleDropdown}
          handleChangeStatus={handleChangeStatus}
          getSubServiceStatusConfig={getSubServiceStatusConfig}
          SUB_SERVICES_AVAILABLE_STATUSES={SUB_SERVICES_AVAILABLE_STATUSES}
          navigation={navigation}
          colors={colors}
          dark={dark}
          fonts={fonts}
          mutedText={mutedText}
          surfaceElevation={surfaceElevation}
        />
      ) : (
        <AssignedJobsInspect />
      )}

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: "", type: "" })}
        duration={2500}
        action={{
          label: "OK",
          onPress: () => setSnackbar({ visible: false, message: "", type: "" }),
        }}
      >
        <Text
          style={{
            color:
              snackbar.type === "error"
                ? "#D32F2F"
                : snackbar.type === "success"
                ? "#2E7D32"
                : "#333",
          }}
        >
          {snackbar.message}
        </Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
