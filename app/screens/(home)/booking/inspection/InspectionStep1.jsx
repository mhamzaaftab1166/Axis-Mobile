import { useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox, useTheme } from "react-native-paper";
import AppErrorMessage from "../../../../components/forms/AppErrorMessage";
import AppFormDateInput from "../../../../components/forms/AppFormDatePicker";
import AppMultiMediaPicker from "../../../../components/forms/AppFormMultiMediaPicker";
import AppFormTimeInput from "../../../../components/forms/AppFormTimePicker";
import ServiceCardList from "../../../../components/home/services/ServiceCardList";
import { inspectionBookingSchema } from "../../../../helpers/validations";

export default forwardRef(function InspectionStep1(
  { onSubmit, initialData = {} },
  ref
) {
  const { service } = useLocalSearchParams();
  const parsedSelectedService = service ? JSON.parse(service) : null;
  const { colors } = useTheme();
  const formikRef = useRef(null);

  useImperativeHandle(ref, () => ({
    submitForm: () => formikRef.current?.handleSubmit(),
    validate: () => formikRef.current?.validateForm(),
  }));

  const defaultInitialValues = {
    bookingDate: "",
    time: "",
    inspectionType: service?.physicalInspection === true ? "physical" : "online",
    images: null,
    videos: null,
  };

  const mergedInitialValues = { ...defaultInitialValues, ...initialData };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={mergedInitialValues}
      enableReinitialize
      validationSchema={inspectionBookingSchema}
      onSubmit={(values) => {
        const basePayload =
          values.inspectionType === "physical"
            ? { ...values, images: null, videos: null }
            : values;

        const payload = {
          selectedService: parsedSelectedService,
          ...basePayload,
        };

        onSubmit && onSubmit(payload);
      }}
      validateOnMount={false}
    >
      {({ values, setFieldValue, errors, touched }) => {
        const onInspectionTypeChange = (val) => {
          setFieldValue("inspectionType", val);
          if (val === "physical") {
            setFieldValue("images", null);
            setFieldValue("videos", null);
          }
        };

        return (
          <View
            style={[styles.container, { backgroundColor: colors.background }]}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={[
                  styles.heading,
                  { color: colors.onBackground, marginBottom: 8 },
                ]}
              >
                Selected Service
              </Text>

              <View style={styles.serviceCardWrap}>
                <ServiceCardList
                  service={parsedSelectedService}
                  type="inspection_services"
                  onlyView
                  onBookInspection={(selected) =>
                    console.log("Booking:", selected)
                  }
                />
              </View>

              <Text style={[styles.subHeading, { color: colors.onBackground }]}>
                Schedule
              </Text>

              <View style={styles.row}>
                <View style={[styles.flexItem, { marginRight: 10 }]}>
                  <AppFormDateInput
                    name="bookingDate"
                    label="Preferred Date"
                    minDaysOffset={3}
                  />
                </View>
                <View style={[styles.flexItem, { marginLeft: 10 }]}>
                  <AppFormTimeInput name="time" label="Preferred Time" />
                </View>
              </View>

              <Text style={[styles.heading, { color: colors.onBackground }]}>
                Inspection Type
              </Text>

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onInspectionTypeChange("physical")}
                  style={styles.option}
                >
                  <Checkbox.Android
                    status={
                      values.inspectionType === "physical"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => onInspectionTypeChange("physical")}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.optionLabel, { color: colors.onBackground }]}
                  >
                    Physical Inspection
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onInspectionTypeChange("online")}
                  style={styles.option}
                >
                  <Checkbox.Android
                    status={
                      values.inspectionType === "online"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => onInspectionTypeChange("online")}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.optionLabel, { color: colors.onBackground }]}
                  >
                    Online Inspection
                  </Text>
                </TouchableOpacity>
              </View>

              <AppErrorMessage
                error={errors?.inspectionType}
                visible={Boolean(touched?.inspectionType)}
              />

              {values.inspectionType === "physical" ? (
                <View
                  style={[styles.physicalBox, { borderColor: colors.outline }]}
                >
                  <Text
                    style={{
                      color: colors.onBackground,
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    Physical inspection cost: 25 AED
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.section}>
                    <AppMultiMediaPicker
                      name="images"
                      mediaType="image"
                      maxItems={3}
                    />
                  </View>

                  <View style={styles.section}>
                    <AppMultiMediaPicker
                      name="videos"
                      mediaType="video"
                      maxItems={1}
                    />
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        );
      }}
    </Formik>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  heading: { fontSize: 18, marginVertical: 12, fontWeight: "700" },
  subHeading: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
  },
  serviceCardWrap: { marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  flexItem: { flex: 1 },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 6,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingRight: 12,
    marginRight: 8,
  },
  optionLabel: { fontSize: 15, fontWeight: "600" },
  physicalBox: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  section: { marginTop: 12 },
});
