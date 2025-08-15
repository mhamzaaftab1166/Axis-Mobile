import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

const Step2 = forwardRef(function Step2({ onSubmit }, ref) {
  const { colors } = useTheme();
  const formikRef = useRef(null);

  // Expose submitForm to parent via ref
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formikRef.current) {
        formikRef.current.handleSubmit();
      }
    },
  }));

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{}}
      validationSchema={null}
      onSubmit={onSubmit}
    >
      {() => (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.inner, { backgroundColor: colors.background }]}>
            {/* Your form fields go here */}
          </View>
        </ScrollView>
      )}
    </Formik>
  );
});

export default Step2;

const styles = StyleSheet.create({
  inner: { flex: 1, padding: 16 },
});
