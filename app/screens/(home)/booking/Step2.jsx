import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import BookingSummary from "../../../components/home/summary/BookingSummary";
import useBookingStore from "../../../store/useBookingStore";

const Step2 = forwardRef(function Step2({ onSubmit }, ref) {
  const booking = useBookingStore((state) => state.booking);
  const { colors, fonts } = useTheme();
  const formikRef = useRef(null);
  console.log(booking);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formikRef.current) {
        formikRef.current.setSubmitting(true);
        onSubmit(booking);
        formikRef.current.setSubmitting(false);
      }
    },
  }));

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{}}
      validationSchema={null}
      onSubmit={() => onSubmit(booking)}
    >
      {() => (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.inner, { backgroundColor: colors.background }]}>
            <Text
              style={[
                styles.title,
                { color: colors.text, fontFamily: fonts.medium?.fontFamily },
              ]}
            >
              Booking Summary
            </Text>

            <BookingSummary booking={booking} />

            <View style={{ height: 24 }} />
          </View>
        </ScrollView>
      )}
    </Formik>
  );
});

export default Step2;

const styles = StyleSheet.create({
  inner: { flex: 1, padding: 16 },
  title: { fontSize: 18, marginBottom: 12, fontWeight: "700" },
});
