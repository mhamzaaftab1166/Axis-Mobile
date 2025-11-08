import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import * as Yup from "yup";
import PopupDialog from "../../../../components/common/PopupDialogue";
import AppForm from "../../../../components/forms/AppForm";
import AppFormField from "../../../../components/forms/AppFormFeild";
import SubmitButton from "../../../../components/forms/AppSubmitButton";

export default function SendQuotationPopup({ visible, onDismiss, item }) {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Quotation amount is required"),
    remarks: Yup.string(),
  });

  const handleSubmit = (values) => {
    console.log("Quotation submitted:", item.id, values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onDismiss();
    }, 1200);
  };

  return (
    <PopupDialog
      visible={visible}
      onDismiss={onDismiss}
      title={`Send Quotation - ${item.serviceName}`}
      subtitle={`Service ID: ${item.id}`}
      actions={[]}
    >
      <AppForm
        initialValues={{
          amount: "",
          remarks:
            "Your inspection is completed. Please pay the amount to proceed with the completion.",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <View>
          <AppFormField
            name="amount"
            placeholder="Enter Quotation Amount"
            icon="currency-usd"
            keyboardType="numeric"
            mode="outlined"
          />
          <AppFormField
            name="remarks"
            placeholder="Remarks"
            icon="message-text-outline"
            multiline
            mode="outlined"
          />
          <SubmitButton title={"Send Quotation"} isLoading={loading} />
        </View>
      </AppForm>
    </PopupDialog>
  );
}

const styles = StyleSheet.create({});
