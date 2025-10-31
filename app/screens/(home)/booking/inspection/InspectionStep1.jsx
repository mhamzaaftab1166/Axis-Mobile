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
import * as Yup from "yup";
import AppErrorMessage from "../../../../components/forms/AppErrorMessage";
import AppFormDateInput from "../../../../components/forms/AppFormDatePicker";
import AppMultiMediaPicker from "../../../../components/forms/AppFormMultiMediaPicker";
import AppFormTimeInput from "../../../../components/forms/AppFormTimePicker";

export default forwardRef(function InspectionStep1({ onSubmit }, ref) {
  const { colors } = useTheme();
  const formikRef = useRef(null);

  useImperativeHandle(ref, () => ({
    submitForm: () => formikRef.current?.handleSubmit(),
    validate: () => formikRef.current?.validateForm(),
  }));

  const validationSchema = Yup.object().shape({
    bookingDate: Yup.string().required("Preferred date is required"),
    time: Yup.string().required("Preferred time is required"),
    inspectionType: Yup.string()
      .oneOf(["online", "physical"])
      .required("Select inspection type"),
    images: Yup.array()
      .of(Yup.mixed())
      .when("inspectionType", {
        is: "online",
        then: (schema) =>
          schema
            .min(3, "Please upload at least 3 images")
            .max(10, "Too many images")
            .required("Images are required"),
        otherwise: (schema) => schema.nullable(),
      }),
    videos: Yup.array()
      .of(Yup.mixed())
      .when("inspectionType", {
        is: "online",
        then: (schema) =>
          schema
            .min(1, "Please upload at least 1 video")
            .max(3, "Too many videos")
            .required("Video is required"),
        otherwise: (schema) => schema.nullable(),
      }),
  });

  const initialValues = {
    bookingDate: "",
    time: "",
    inspectionType: "physical",
    images: [],
    videos: [],
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const payload =
          values.inspectionType === "physical"
            ? { ...values, images: [], videos: [] }
            : values;
        onSubmit && onSubmit(payload);
      }}
      validateOnMount={false}
    >
      {({ values, setFieldValue, errors, touched }) => {
        const onInspectionTypeChange = (val) => {
          setFieldValue("inspectionType", val);
          if (val === "physical") {
            setFieldValue("images", []);
            setFieldValue("videos", []);
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
              {/* Date & Time Row */}
              <View style={styles.row}>
                <View style={[styles.flexItem, { marginRight: 8 }]}>
                  <AppFormDateInput
                    name="bookingDate"
                    label="Preferred Date"
                    minDaysOffset={3}
                  />
                </View>
                <View style={styles.flexItem}>
                  <AppFormTimeInput name="time" label="Preferred Time" />
                </View>
              </View>

              {/* Inspection Type */}
              <Text style={[styles.heading, { color: colors.onBackground }]}>
                Inspection Type
              </Text>

              <View style={[styles.optionsRow, { marginBottom: 8 }]}>
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
                  style={[styles.option, { marginLeft: 8 }]}
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
                visible={touched?.inspectionType}
              />

              {/* Conditional Sections */}
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

  heading: {
    fontSize: 18,
    marginVertical: 12,
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  flexItem: {
    flex: 1,
  },

  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
  },

  physicalBox: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },

  section: { marginTop: 12 },
});
