// screens/(account)/AddNewCard.tsx
import { useNavigation, useRouter } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";

import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import AppForm from "../../components/forms/AppForm";
import AppFormField from "../../components/forms/AppFormFeild";
import SubmitButton from "../../components/forms/AppSubmitButton";
import { ROUTES } from "../../helpers/routePaths";

const validationSchema = Yup.object().shape({
  cardHolder: Yup.string()
    .required("Cardholder name is required")
    .min(3, "Enter full name"),
  cardNumber: Yup.string()
    .required("Card number is required")
    .matches(/^\d{16}$/, "Must be 16 digits"),
  expiry: Yup.string()
    .required("Expiration date is required")
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Format MMYY"),
});

export default function AddNewCard() {
  const navigation = useNavigation();
  const router = useRouter();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const handleSubmit = (values) => {
    console.log("New card values:", values);
    router.dismissTo(ROUTES.PAYMENT_METHODS);
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
            keyboardType="number-pad"
            maxLength={4}
          />

          <SubmitButton title="Save Card" />
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
