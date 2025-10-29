import { Formik } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import AppErrorMessage from "../../../../components/forms/AppErrorMessage";
import AppMultiMediaPicker from "../../../../components/forms/AppFormMultiMediaPicker";
// import { bookingValidationSchema } from "../../../helpers/validations";

export default forwardRef(function InspectionStep1({ onSubmit }, ref) {
  const { colors } = useTheme();

  let formikRef;
  useImperativeHandle(ref, () => ({
    submitForm: () => formikRef.handleSubmit(),
  }));

  return (
    <Formik
      innerRef={(f) => (formikRef = f)}
      initialValues={{}}
      enableReinitialize
      onSubmit={onSubmit}
      validationSchema={null}
    >
      {() => (
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <AppErrorMessage error={null} visible={null} />
            <AppMultiMediaPicker name="images" mediaType="image" maxItems={3} />
          </ScrollView>
        </View>
      )}
    </Formik>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  heading: { fontSize: 20, marginBottom: 12, fontWeight: "600" },

  categoryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
    elevation: 2,
  },
  categoryName: { fontSize: 16, fontWeight: "600" },
  categorySubtitle: { fontSize: 12, marginTop: 2 },

  serviceCardContainer: {
    marginLeft: 8,
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  serviceName: { fontSize: 14, fontWeight: "600" },
  servicePrice: { fontSize: 12, marginTop: 2, color: "#28a745" },
});
