import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import useBookingStore from "../../../../store/useBookingStore";

export default function ResetServiceTimeOnSelectedServicesChange({
  fieldName = "serviceTime",
}) {
  const { values, setFieldValue } = useFormikContext();
  const selectedServices = useBookingStore(
    (s) => s.booking?.selectedServices ?? []
  );
  const prevLenRef = useRef(selectedServices.length);

  useEffect(() => {
    const prev = prevLenRef.current;
    const curr = selectedServices.length;
    if (prev !== curr) {
      if (curr === 0) {
        setFieldValue(fieldName, {});
      }
      prevLenRef.current = curr;
    }
  }, [selectedServices.length, setFieldValue, fieldName, values]);

  return null;
}
