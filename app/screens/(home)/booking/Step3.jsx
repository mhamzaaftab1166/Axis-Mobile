import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as Yup from "yup";
import AppFormDropdown from "../../../components/forms/AppFormDropdown";
import AppFormField from "../../../components/forms/AppFormFeild";
import LoadingOveralay from "../../../components/LoadingOverlay";
import { calculateTotals } from "../../../helpers/general";
import { useGetPaymentMethods } from "../../../hooks/usePaymetMethodQuery";
import useAddressStore from "../../../store/useAddressStore";
import useBookingStore from "../../../store/useBookingStore";

const Step3 = forwardRef(function Step3({ onSubmit, requireAction, isBooking = false, onConfirmPayment = ()=>{}, onCanclePayment = ()=>{} }, ref) {
  const booking = useBookingStore((state) => state.booking);
  const { colors } = useTheme();
  const formikRef = useRef(null);

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

  const selectedAddress = useAddressStore((s) => s.selectedAddress);

  const { totalAmountAfterTax } = calculateTotals(
    booking?.selectedServices,
    selectedAddress?.unitId?.unitCapacity || 1
  );

  const { data: cards, isLoading: loadingCards } = useGetPaymentMethods();

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ selectedCard: null, cvv: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => onSubmit({ ...booking, ...values })}
    >
      {({ handleSubmit }) => (
        <ScrollView style={styles.inner} showsVerticalScrollIndicator={false}>

          <LoadingOveralay visible={loadingCards} />
          <AppFormDropdown
            key="id"
            name="selectedCard"
            placeholder="Select Card"
            items={cards}
            labelKey="name_on_card"
            valueKey="id"
          />
          <AppFormField
            name="cvv"
            placeholder="CVV"
            keyboardType="numeric"
            maxLength={3}
          />

          {!requireAction && (
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.btn, { backgroundColor: colors.primary }]}
              labelStyle={{ color: colors.onPrimary }}
              loading={isBooking}
            >
              Pay AED {totalAmountAfterTax} /-
            </Button>
          )}

          {requireAction && (
            <View style={styles.otpWrapper}>
              <Text style={[styles.desc, { color: colors.onSurface }]}>
                This payment requires 3D Secure verification. An OTP will be
                sent to your registered mobile/email.
              </Text>
              <Button
                mode="contained"
                onPress={onConfirmPayment}
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
