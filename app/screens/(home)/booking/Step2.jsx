// screens/.../Step2.js
import { router } from "expo-router";
import { Formik } from "formik";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import AddressBottomSheet from "../../../components/home/AddressBottomSheet";
import BookingSummary from "../../../components/home/summary/BookingSummary";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { ROUTES } from "../../../helpers/routePaths";
import { useGetAllAddress } from "../../../hooks/useAddressQuery";
import useAddressStore from "../../../store/useAddressStore";
import useBookingStore from "../../../store/useBookingStore";

const Step2 = forwardRef(function Step2({ onSubmit, noOfDays }, ref) {
  const booking = useBookingStore((state) => state.booking);
  const { colors, fonts } = useTheme();
  const formikRef = useRef(null);

  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const setAddress = useAddressStore((s) => s.setAddress);
  const ensureDefault = useAddressStore((s) => s.ensureDefault);
  const [showAddrSheet, setShowAddrSheet] = useState(false);

  const { allAddresses, isLoading: loadingAddress } = useGetAllAddress();

  useEffect(() => {
    ensureDefault(allAddresses ? allAddresses[0] : undefined);
  }, [allAddresses]);

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      if (formikRef.current) {
        formikRef.current.setSubmitting(true);
        onSubmit(booking);
        formikRef.current.setSubmitting(false);
      }
    },
  }));

  const handleOpenAddressSheet = () => setShowAddrSheet(true);
  const handleCloseAddressSheet = () => setShowAddrSheet(false);

  const handleSelectAddress = (addr) => {
    setAddress(addr);
    setShowAddrSheet(false);
  };

  return (
    <>
      <Formik
        innerRef={formikRef}
        initialValues={{}}
        validationSchema={null}
        onSubmit={() => onSubmit(booking)}
      >
        {() => (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[styles.inner, { backgroundColor: colors.background }]}
            >
              <LoadingOverlay visible={loadingAddress} />
              <Text
                style={[
                  styles.title,
                  { color: colors.text, fontFamily: fonts.medium?.fontFamily },
                ]}
              >
                Booking Summary
              </Text>

              <BookingSummary
                noOfDays={noOfDays}
                booking={booking}
                onChangeAddress={handleOpenAddressSheet}
              />

              <View style={{ height: 24 }} />
            </View>
          </ScrollView>
        )}
      </Formik>

      <AddressBottomSheet
        addresses={allAddresses}
        visible={showAddrSheet}
        selectedId={selectedAddress?._id}
        onClose={handleCloseAddressSheet}
        onSelect={handleSelectAddress}
        onAdd={() => router.push(ROUTES.ADD_ADDRESS)}
      />
    </>
  );
});

export default Step2;

const styles = StyleSheet.create({
  inner: { flex: 1, padding: 16 },
  title: { fontSize: 18, marginBottom: 12, fontWeight: "700" },
});
