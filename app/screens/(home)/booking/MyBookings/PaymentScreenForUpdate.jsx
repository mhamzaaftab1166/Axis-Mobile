import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as Yup from "yup";

import { router } from "expo-router";
import config from "../../../../../config.json";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";
import EmptyState from "../../../../components/common/EmptyState";
import AppErrorMessage from "../../../../components/forms/AppErrorMessage";
import AppForm from "../../../../components/forms/AppForm";
import AppFormDropdown from "../../../../components/forms/AppFormDropdown";
import AppFormField from "../../../../components/forms/AppFormFeild";
import LoadingOverlay from "../../../../components/LoadingOverlay";
import { encryptCVV } from "../../../../helpers/general";
import { ROUTES } from "../../../../helpers/routePaths";
import { useCompletePayment } from "../../../../hooks/useBookingQuery";
import { useGetPaymentMethods } from "../../../../hooks/usePaymetMethodQuery";
import { useStripeCancelledIntent, useStripeConfirmPayment } from "../../../../hooks/useStripeQuery";
import useBookingStore from "../../../../store/useBookingStore";

const validationSchema = Yup.object({
  selectedCard: Yup.object().required("Please select a card"),
  cvv: Yup.string()
    .required("CVV is required")
    .matches(/^\d{3}$/, "CVV must be 3 digits"),
});

export default function MakePayment() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { data: cards, isLoading: loadingCards } = useGetPaymentMethods();
  
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [intentId, setIntentId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [requireAction, setRequireAction] = useState(false);
  const [isWorkingOnStripe, setIsWorkingOnStripe] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const clearBooking = useBookingStore((state) => state.clearBooking);

  const params = useLocalSearchParams();

  const { mutate: confirmPaymentForService, isPending: isBooking } = useCompletePayment({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      clearBooking();
      navigation.replace(ROUTES.HOME);
    },
    onRequireAction: (clientSecret, methodId, intentId)=>{
      setRequireAction(true);
      setClientSecret(clientSecret);
      setPaymentMethodId(methodId);
      setIntentId(intentId);
      setIsError(false);
      setError("");
    }
  });

  // stripe methods
  const { mutate: cancelIntent, isPending: cancellingIntent } = useStripeCancelledIntent({
    onSuccessCallback: () => {
      navigation.replace(ROUTES.HOME);
    },
    onErrorCallback: (msg) => {
      setIsError(true);
      setError(msg);
    },
  });

  const { mutate: confirmPayment, isPending: isLoading  } = useStripeConfirmPayment({
    onSuccessCallback: (intentId) => {
      setIsWorkingOnStripe(false);
      if(intentId){
        cancelIntent({intentId});
      }else{
        navigation.replace(ROUTES.HOME);
      }
    },
    onErrorCallback: (msg) => {
      setIsError(true);
      setError(msg);
      setIsWorkingOnStripe(false);
    },
  });

  const screenBg = colors.background;

  const handleSubmit = (values) => {
    confirmPaymentForService({
      serviceId: params?.serviceId,
      cvv: encryptCVV(values.cvv,config.secretKeyForEncryption),
      cardId: values?.selectedCard?.id,
      amount: params?.amount
    });
  };

  const onConfirmPayment = () => {
    confirmPayment({clientSecret,pmtMethodId: paymentMethodId, intentId});
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Payment"}
        onBack={() => navigation.goBack()}
      />
      <LoadingOverlay  visible={isLoading || cancellingIntent} />
      <View style={styles.content}>
        <AppForm
          initialValues={{
            selectedCard: null,
            cvv: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleSubmit }) => (
            <>
              <View style={{ alignSelf: "center" }}>
                <AppErrorMessage visible={isError} error={error} />
              </View>

              {Array.isArray(cards) && cards.length > 0 ? (
                <>
                  <AppFormDropdown
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
                        {
                          backgroundColor: colors.primary,
                          borderRadius: 7,
                          paddingVertical: 4,
                        },
                      ]}
                      labelStyle={{ color: colors.onPrimary }}
                      loading={isBooking}
                    >
                      Pay AED {params?.amount} /-
                    </Button>
                  )}

                  {requireAction && (
                    <View style={styles.otpWrapper}>
                      <Text
                        style={{ color: colors.onSurface, marginBottom: 8 }}
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
        </AppForm>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  btn: { marginTop: 16 },
  otpWrapper: { marginTop: 20 },
});
