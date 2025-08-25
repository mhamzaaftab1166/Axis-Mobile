// screens/(account)/AddAddress.js
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import AppForm from "../../components/forms/AppForm";
import AppFormDropdown from "../../components/forms/AppFormDropdown";
import SubmitButton from "../../components/forms/AppSubmitButton";
import ResetAddressFields from "../../components/forms/ResetAddressForm";
import { addressValidationSchema } from "../../helpers/validations";

// Static dropdown data
const properties = [
  { id: "1", name: "Tower A" },
  { id: "2", name: "Tower B" },
  { id: "3", name: "Tower C" },
];

const blocks = [
  { id: "1", name: "Block 1" },
  { id: "2", name: "Block 2" },
  { id: "3", name: "Block 3" },
];

const floors = [
  { id: "1", name: "1st" },
  { id: "2", name: "2nd" },
  { id: "3", name: "3rd" },
  { id: "4", name: "4th" },
  { id: "5", name: "5th" },
];

const units = [
  { id: "101", name: "101" },
  { id: "102", name: "102" },
  { id: "103", name: "103" },
  { id: "201", name: "201" },
  { id: "202", name: "202" },
  { id: "203", name: "203" },
];

export default function AddAddress() {
  const params = useLocalSearchParams();
  const addressParam = params.address ? JSON.parse(params.address) : null;
  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;

  const handleSubmit = (values) => {
    console.log("New Address:", values);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title="Add New Address"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppForm
          initialValues={{
            property: addressParam?.property || null,
            block: addressParam?.block || null,
            floor: addressParam?.floor || null,
            unit: addressParam?.unit || null,
          }}
          onSubmit={handleSubmit}
          validationSchema={addressValidationSchema}
        >
          <ResetAddressFields />

          <AppFormDropdown
            name="property"
            placeholder="Select Property"
            items={properties}
            labelKey="name"
            valueKey="id"
            onValueChange={(val) => console.log("property selected:", val)}
          />

          <AppFormDropdown
            name="block"
            placeholder="Select Block"
            items={blocks}
            labelKey="name"
            valueKey="id"
            onValueChange={(val) => console.log("block selected:", val)}
          />

          <AppFormDropdown
            name="floor"
            placeholder="Select Floor"
            items={floors}
            labelKey="name"
            valueKey="id"
            onValueChange={(val) => console.log("floor selected:", val)}
          />

          <AppFormDropdown
            name="unit"
            placeholder="Select Unit"
            items={units}
            labelKey="name"
            valueKey="id"
            onValueChange={(val) => console.log("unit selected:", val)}
          />

          <SubmitButton title="Save Address" />
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
