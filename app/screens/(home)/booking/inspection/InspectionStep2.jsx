import { router } from "expo-router";
import { Formik } from "formik";
import { forwardRef, useImperativeHandle } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as Yup from "yup";
import EmptyState from "../../../../components/common/EmptyState";
import AppFormDropdown from "../../../../components/forms/AppFormDropdown";
import AppFormField from "../../../../components/forms/AppFormFeild";
import LoadingOveralay from "../../../../components/LoadingOverlay";
import { ROUTES } from "../../../../helpers/routePaths";
import { useGetPaymentMethods } from "../../../../hooks/usePaymetMethodQuery";

const InspectionStep2 = forwardRef(
  (
    {
      onSubmit,
      requireAction,
      amount,
      selectedLoyaltyPoints,
      isBooking,
      onConfirmPayment,
      isWorkingOnStripe,
      inspectionType,
    },
    ref
  ) => {
    const { colors } = useTheme();
    const { data: cards, isLoading: loadingCards } = useGetPaymentMethods();

    let formikRef;

    useImperativeHandle(ref, () => ({
      submitForm: () => formikRef?.handleSubmit(),
    }));

    // Validation for physical payments
    const paymentValidationSchema = Yup.object({
      selectedCard: Yup.object().required("Please select a card"),
      cvv: Yup.string()
        .required("CVV is required")
        .matches(/^\d{3}$/, "CVV must be 3 digits"),
    });

    const handleLocalSubmit = (values) => {
      if (typeof onSubmit === "function") {
        onSubmit(values);
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        {inspectionType === "physical" ? (
          <Formik
            innerRef={(r) => (formikRef = r)}
            initialValues={{
              selectedCard: null,
              cvv: "",
            }}
            validationSchema={paymentValidationSchema}
            onSubmit={handleLocalSubmit}
          >
            {({ handleSubmit }) => (
              <>
                <Text>Payment Details</Text>
                <LoadingOveralay visible={loadingCards} />

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
                        style={[
                          styles.btn,
                          { backgroundColor: colors.primary },
                        ]}
                        labelStyle={{ color: colors.onPrimary }}
                        loading={isBooking}
                      >
                        Pay AED 999 /- (+5% Tax)
                      </Button>
                    )}

                    {requireAction && (
                      <View style={styles.otpWrapper}>
                        <Text
                          style={[styles.desc, { color: colors.onSurface }]}
                        >
                          This payment requires 3D Secure verification. An OTP
                          will be sent to your registered mobile/email.
                        </Text>
                        <Button
                          mode="contained"
                          onPress={onConfirmPayment}
                          style={[
                            styles.btn,
                            { backgroundColor: colors.tertiary },
                          ]}
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
              </>
            )}
          </Formik>
        ) : (
          // online inspection summary placeholder
          <Formik
            innerRef={(r) => (formikRef = r)}
            initialValues={{ summaryConfirmed: false }}
            onSubmit={handleLocalSubmit}
          >
            {({ handleSubmit }) => (
              <View>
                <Text style={{ marginBottom: 20 }}>
                  Online Inspection Summary
                </Text>
              </View>
            )}
          </Formik>
        )}
      </ScrollView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  btn: {
    marginTop: 20,
    borderRadius: 8,
  },
  otpWrapper: {
    marginTop: 20,
  },
  desc: {
    textAlign: "center",
    marginBottom: 12,
  },
});

export default InspectionStep2;
