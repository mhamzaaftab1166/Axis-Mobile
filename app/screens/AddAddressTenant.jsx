// screens/(account)/AddPrimaryAddress.js
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import AppErrorMessage from "../components/forms/AppErrorMessage";
import AppForm from "../components/forms/AppForm";
import AppFormDropdown from "../components/forms/AppFormDropdown";
import SubmitButton from "../components/forms/AppSubmitButton";
import LoadingOveralay from "../components/LoadingOverlay";
import { addressValidationSchema } from "../helpers/validations";
import {
  useGetAllBuildingInfo,
  useSaveAddress,
} from "../hooks/useAddressQuery";

export default function AddPrimaryAddress() {
  const { colors } = useTheme();
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { buildingsData, isLoading } = useGetAllBuildingInfo();
  const { mutate: saveAddress, isPending: isSaving } = useSaveAddress({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
    },
  });

  const handleSubmit = (values) => {
    saveAddress({
      towerId: values?.property?._id,
      blockId: values?.block?._id,
      floorId: values?.floor?._id,
      unitId: values?.unit?._id,
      unitName: values?.unit?.unitName,
      primary: true, // mark as primary address
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LoadingOveralay visible={isLoading} />

      <View style={styles.content}>
        <Text
          variant="headlineMedium"
          style={{ marginBottom: 20, fontWeight: "600" }}
        >
          Add Your Primary Address to Access the App
        </Text>

        <AppForm
          initialValues={{
            property: null,
            block: null,
            floor: null,
            unit: null,
          }}
          onSubmit={handleSubmit}
          validationSchema={addressValidationSchema}
        >
          {({ values }) => (
            <>
              <View style={{ alignSelf: "center" }}>
                <AppErrorMessage error={error} visible={isError} />
              </View>

              <AppFormDropdown
                name="property"
                placeholder="Select Property"
                items={buildingsData?.towers}
                labelKey="towerName"
                valueKey="_id"
              />

              <AppFormDropdown
                name="block"
                placeholder="Select Block"
                items={buildingsData?.blocks?.filter(
                  (b) => b.towerId === values?.property?._id
                )}
                labelKey="blockName"
                valueKey="_id"
              />

              <AppFormDropdown
                name="floor"
                placeholder="Select Floor"
                items={buildingsData?.floors?.filter(
                  (f) => f.blockId === values?.block?._id
                )}
                labelKey="floorName"
                valueKey="_id"
              />

              <AppFormDropdown
                name="unit"
                placeholder="Select Unit"
                items={buildingsData?.units?.filter(
                  (u) => u.floorId === values?.floor?._id
                )}
                labelKey="unitName"
                valueKey="_id"
              />

              <SubmitButton isLoading={isSaving} title="Save Address" />
            </>
          )}
        </AppForm>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  content: { marginTop: 40 },
});
