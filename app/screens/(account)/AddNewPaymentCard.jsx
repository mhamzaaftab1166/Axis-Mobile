// screens/(account)/AddNewCard.tsx
import { useNavigation, useRouter } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";

import Payment from "payment";
import { useState } from "react";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import AppErrorMessage from "../../components/forms/AppErrorMessage";
import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { ROUTES } from "../../helpers/routePaths";
import { useSavePaymentMethod } from "../../hooks/usePaymetMethodQuery";

const validationSchema = Yup.object().shape({
  cardHolder: Yup.string()
    .required("Cardholder name is required")
    .min(3, "Enter full name"),
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^\d{16}$/, "Must be 16 digits"),
  expiry: Yup.string()
    .required("Expiration date is required")
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Format MM/YY"),
});

export default function AddNewCard() {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { mutate: savingPaymentMethod, isPending: isSaving } = useSavePaymentMethod({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      router.dismissTo(ROUTES.PAYMENT_METHODS);
    },
  });

  const handleSubmit = (values) => {
    const validateCard = Payment.fns.validateCardNumber(values.cardNumber);
    if (!validateCard) {
      setError("Invalid card number.");
      setIsError(true);
      return;
    }

    const [month, year] = values.expiry.split("/");
    const isValidExpiry = Payment.fns.validateCardExpiry(
      month?.trim(),
      year?.trim()
    );

    if (!isValidExpiry) {
      setError("Invalid expiry date.");
      setIsError(true);
      return;
    }

    savingPaymentMethod({
      card_number: values.cardNumber,
      name_on_card: values.cardHolder,
      expiry: values.expiry,
      card_type: Payment.fns.cardType(values.cardNumber)
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <CenteredAppbarHeader
        title={"Add New Card"}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppForm
          initialValues={{
            cardHolder: "",
            cardNumber: "",
            expiry: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <View style={{
            alignSelf: "center",
          }}>
            <AppErrorMessage visible={isError} error={error} />
          </View>
          <AppFormField
            name="cardHolder"
            placeholder="Cardholder Name"
            icon="account"
            autoCapitalize="words"
          />

          <AppFormField
            name="cardNumber"
            placeholder="Card Number"
            icon="credit-card"
            keyboardType="number-pad"
            maxLength={16}
          />

          <AppFormField
            name="expiry"
            placeholder="MM/YY"
            icon="calendar"
            maxLength={5}
          />

          <SubmitButton isLoading={isSaving} title="Save Card" />
        </AppForm>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
