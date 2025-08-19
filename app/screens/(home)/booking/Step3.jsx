import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as Yup from "yup";
import AppFormDropdown from "../../../components/forms/AppFormDropdown";
import AppFormField from "../../../components/forms/AppFormFeild";
import useBookingStore from "../../../store/useBookingStore";

const Step3 = forwardRef(function Step3({ onSubmit }, ref) {
  const booking = useBookingStore((state) => state.booking);
  const { colors } = useTheme();
  const formikRef = useRef(null);

  const [cards] = useState([
    { id: "1", type: "visa", last4: "1234", cardHolder: "John Doe" },
    { id: "2", type: "mastercard", last4: "5678", cardHolder: "Samantha Ray" },
    { id: "3", type: "amex", last4: "9012", cardHolder: "Aarav Kumar" },
  ]);

  const [showOtpStep, setShowOtpStep] = useState(false);

  const validationSchema = Yup.object({
    selectedCard: Yup.object().required("Please select a card"),
    cvv: Yup.string()
      .required("CVV is required")
      .matches(/^\d{3}$/, "CVV must be 3 digits"),
  });

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
      initialValues={{ selectedCard: null, cvv: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Payment data:", { ...booking, ...values });
        setShowOtpStep(true);
      }}
    >
      {({ handleSubmit }) => (
        <ScrollView style={styles.inner} showsVerticalScrollIndicator={false}>
          <AppFormDropdown
            name="selectedCard"
            placeholder="Select Card"
            items={cards}
            labelKey="cardHolder"
            valueKey="id"
          />
          <AppFormField
            name="cvv"
            placeholder="CVV"
            keyboardType="numeric"
            maxLength={3}
          />

          {!showOtpStep && (
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.btn, { backgroundColor: colors.primary }]}
              labelStyle={{ color: colors.onPrimary }}
            >
              Pay AED 50
            </Button>
          )}

          {showOtpStep && (
            <View style={styles.otpWrapper}>
              <Text style={[styles.desc, { color: colors.onSurface }]}>
                This payment requires 3D Secure verification. An OTP will be
                sent to your registered mobile/email.
              </Text>
              <Button
                mode="contained"
                onPress={() => onSubmit({ ...booking })}
                style={[styles.btn, { backgroundColor: colors.tertiary }]}
                labelStyle={{ color: colors.onPrimary }}
              >
                Confirm Payment
              </Button>
            </View>
          )}
        </ScrollView>
      )}
    </Formik>
  );
});

export default Step3;

const styles = StyleSheet.create({
  inner: { flex: 1, padding: 16 },
  btn: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 6,
  },
  otpWrapper: {
    marginTop: 24,
    borderRadius: 8,
  },
  desc: {
    fontSize: 14,
    marginBottom: 12,
  },
});
