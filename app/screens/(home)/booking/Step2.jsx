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
import { ROUTES } from "../../../helpers/routePaths";
import useAddressStore from "../../../store/useAddressStore";
import useBookingStore from "../../../store/useBookingStore";

const Step2 = forwardRef(function Step2({ onSubmit }, ref) {
  const booking = useBookingStore((state) => state.booking);
  const { colors, fonts } = useTheme();
  const formikRef = useRef(null);

  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const setAddress = useAddressStore((s) => s.setAddress);
  const ensureDefault = useAddressStore((s) => s.ensureDefault);
  const [showAddrSheet, setShowAddrSheet] = useState(false);

  const addresses = [
    {
      id: "1",
      property: { id: "1", name: "Tower A" },
      block: { id: "2", name: "Block 2" },
      floor: { id: "5", name: "5th" },
      unit: { id: "102", name: "102" },
    },
    {
      id: "2",
      property: { id: "2", name: "Tower B" },
      block: { id: "1", name: "Block 1" },
      floor: { id: "2", name: "2nd" },
      unit: { id: "201", name: "201" },
    },
  ];

  useEffect(() => {
    ensureDefault(addresses[0]);
  }, []);

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
              <Text
                style={[
                  styles.title,
                  { color: colors.text, fontFamily: fonts.medium?.fontFamily },
                ]}
              >
                Booking Summary
              </Text>

              <BookingSummary
                booking={booking}
                onChangeAddress={handleOpenAddressSheet}
              />

              <View style={{ height: 24 }} />
            </View>
          </ScrollView>
        )}
      </Formik>

      <AddressBottomSheet
        addresses={addresses}
        visible={showAddrSheet}
        selectedId={selectedAddress?.id}
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
