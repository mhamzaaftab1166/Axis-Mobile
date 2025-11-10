import { StyleSheet, View } from "react-native";
import * as Yup from "yup";
import PopupDialog from "../../../../components/common/PopupDialogue";
import AppForm from "../../../../components/forms/AppForm";
import AppFormField from "../../../../components/forms/AppFormFeild";
import SubmitButton from "../../../../components/forms/AppSubmitButton";

export default function SendQuotationPopup({ visible, onDismiss, item, onSubmit, isLoading }) {
  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .required("Quotation amount is required"),
    remarks: Yup.string(),
  });

  const submitQuotationItem = (values)=>{
    onSubmit(item.id,values);
  }

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
        onSubmit={submitQuotationItem}
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
          <SubmitButton title={"Send Quotation"} isLoading={isLoading} />
        </View>
      </AppForm>
    </PopupDialog>
  );
}

const styles = StyleSheet.create({});
