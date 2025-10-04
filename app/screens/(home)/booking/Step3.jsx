import { router } from "expo-router";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as Yup from "yup";
import EmptyState from "../../../components/common/EmptyState";
import AppFormDropdown from "../../../components/forms/AppFormDropdown";
import AppFormField from "../../../components/forms/AppFormFeild";
import LoadingOveralay from "../../../components/LoadingOverlay";
import LoyaltyPointsBottomSheet from "../../../components/LoyaltyPointsBottomSheet";
import { calculateTotals } from "../../../helpers/general";
import { ROUTES } from "../../../helpers/routePaths";
import { useGetLoyaltyPoints } from "../../../hooks/useLoyaltyQuery";
import { useGetPaymentMethods } from "../../../hooks/usePaymetMethodQuery";
import useAddressStore from "../../../store/useAddressStore";
import useBookingStore from "../../../store/useBookingStore";

const Step3 = forwardRef(function Step3(
  {
    onSubmit,
    requireAction,
    isBooking = false,
    onConfirmPayment = () => {},
    isWorkingOnStripe,
    noOfDays,
    loyaltyPointsSelection,
    selectedLoyaltyPoints
  },
  ref
) {
  const booking = useBookingStore((state) => state.booking);
  const { colors } = useTheme();
  const formikRef = useRef(null);
  const [loyaltySheetVisible, setLoyaltySheetVisible] = useState(false);
  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const { totalAmountAfterTax } = calculateTotals(
    booking?.selectedServices,
    selectedAddress?.unitId?.unitCapacity || 1,
    5,
    noOfDays
  );

  const { data: loyaltyPointsData, isLoading: fetchingLoyaltyPointsData } = useGetLoyaltyPoints();

  const handleLoyaltySelect = ({ percentage, discountValue }) => {
    loyaltyPointsSelection({ percentage, discountValue });
    setLoyaltySheetVisible(false);
  };

  const validationSchema = Yup.object({
    selectedCard: Yup.object().required("Please select a card"),
    cvv: Yup.string()
      .required("CVV is required")
      .matches(/^\d{3}$/, "CVV must be 3 digits"),
  });

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formikRef.current) formikRef.current.handleSubmit();
    },
  }));

  const { data: cards, isLoading: loadingCards } = useGetPaymentMethods();

  return (
    <>
      <Pressable
        onPress={() => setLoyaltySheetVisible(true)}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 14,
            paddingHorizontal: 16,
            margin: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.primary,
            backgroundColor: pressed ? colors.primary + "20" : colors.surface,
          },
        ]}
      >
        <Text
          style={{ color: colors.onSurface, fontSize: 16, fontWeight: "600" }}
        >
          Redeem Loyalty Points
        </Text>

        <Text
          style={{ color: colors.primary, fontSize: 16, fontWeight: "700" }}
        >
          {selectedLoyaltyPoints
            ? `${selectedLoyaltyPoints?.percentage}% (-AED ${selectedLoyaltyPoints?.discountValue})`
            : "Select"}
        </Text>
      </Pressable>

      <Formik
        innerRef={formikRef}
        initialValues={{ selectedCard: null, cvv: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => onSubmit({ ...booking, ...values })}
      >
        {({ handleSubmit }) => (
          <ScrollView style={styles.inner} showsVerticalScrollIndicator={false}>
            <LoadingOveralay visible={loadingCards || fetchingLoyaltyPointsData} />

            {Array.isArray(cards) && cards.length > 0 ? (
              <>
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
                    Pay AED{' '}
                    {selectedLoyaltyPoints
                      ? (totalAmountAfterTax - selectedLoyaltyPoints.discountValue).toFixed(2)
                      : totalAmountAfterTax.toFixed(2)}{' '}
                    /-
                  </Button>
                )}

                {requireAction && (
                  <View style={styles.otpWrapper}>
                    <Text style={[styles.desc, { color: colors.onSurface }]}>
                      This payment requires 3D Secure verification. An OTP will
                      be sent to your registered mobile/email.
                    </Text>
                    <Button
                      mode="contained"
                      onPress={onConfirmPayment}
                      style={[styles.btn, { backgroundColor: colors.tertiary }]}
                      labelStyle={{ color: colors.onPrimary }}
                      loading={isWorkingOnStripe}
                    >
                      Confirm Payment
                    </Button>
                  </View>
                )}
              </>
            ) : (
              <EmptyState
                iconName="credit-card-off"
                title="No Saved Cards"
                description="You don’t have any saved payment methods. Please add one to continue."
                buttonLabel="Add Payment Method"
                onButtonPress={() => router.push(ROUTES.PAYMENT_METHODS)}
                style={{ marginTop: 60 }}
              />
            )}
          </ScrollView>
        )}
      </Formik>

      <LoyaltyPointsBottomSheet
        visible={loyaltySheetVisible}
        onClose={() => setLoyaltySheetVisible(false)}
        totalAmount={totalAmountAfterTax}
        availablePoints={loyaltyPointsData?.data?.pointsBalance}
        onSelect={handleLoyaltySelect}
        selectedPercentage={loyaltyPointsSelection?.percentage ?? null}
      />
    </>
  );
});

export default Step3;

const styles = StyleSheet.create({
  inner: { flex: 1, padding: 16 },
  btn: { marginTop: 20, borderRadius: 8, paddingVertical: 6 },
  otpWrapper: { marginTop: 24, borderRadius: 8 },
  desc: { fontSize: 14, marginBottom: 12 },
});
