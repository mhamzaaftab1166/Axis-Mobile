// screens/(account)/AddAddress.js
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

import { useState } from "react";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import AppErrorMessage from "../../components/forms/AppErrorMessage";
import AppForm from "../../components/forms/AppForm";
import AppFormDropdown from "../../components/forms/AppFormDropdown";
import SubmitButton from "../../components/forms/AppSubmitButton";
import ResetAddressFields from "../../components/forms/ResetAddressForm";
import LoadingOveralay from "../../components/LoadingOverlay";
import { addressValidationSchema } from "../../helpers/validations";
import { useGetAllBuildingInfo, useSaveAddress } from "../../hooks/useAddressQuery";

export default function AddAddress() {
  const params = useLocalSearchParams();
  const addressParam = params.address ? JSON.parse(params.address) : null;
  const navigation = useNavigation();
  const { colors } = useTheme();

  const screenBg = colors.background;

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
      router.back();
    },
  });

  const handleSubmit = (values) => {
    saveAddress({
      id: addressParam?._id || undefined,
      towerId: values?.property?._id,
      blockId: values?.block?._id,
      floorId: values?.floor?._id,
      unitId: values?.unit?._id,
      unitName: values?.unit?.unitName
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <LoadingOveralay visible={isLoading} />
      <CenteredAppbarHeader
        title="Add New Address"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppForm
          initialValues={{
            property: addressParam?.towerId || null,
            block: addressParam?.blockId || null,
            floor: addressParam?.floorId || null,
            unit: addressParam?.unitId || null,
          }}
          onSubmit={handleSubmit}
          validationSchema={addressValidationSchema}
        >
          {({ values }) => (
            <>
              <ResetAddressFields />

              <View style={{alignSelf: "center"}}>
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

              <SubmitButton isLoading={isSaving} title={
                addressParam ? "Update Address" : "Save Address"
              } />
            </>
          )}
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
