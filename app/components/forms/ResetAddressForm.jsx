import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

export default function ResetAddressFields() {
  const { values, setFieldValue } = useFormikContext();

  const prevPropertyRef = useRef(values.property?.id ?? null);
  const prevBlockRef = useRef(values.block?.id ?? null);
  const prevFloorRef = useRef(values.floor?.id ?? null);

  useEffect(() => {
    if (prevPropertyRef.current !== values.property?.id) {
      setFieldValue("block", null);
      setFieldValue("floor", null);
      setFieldValue("unit", null);
      prevPropertyRef.current = values.property?.id ?? null;
    }

    if (prevBlockRef.current !== values.block?.id) {
      setFieldValue("floor", null);
      setFieldValue("unit", null);
      prevBlockRef.current = values.block?.id ?? null;
    }

    if (prevFloorRef.current !== values.floor?.id) {
      setFieldValue("unit", null);
      prevFloorRef.current = values.floor?.id ?? null;
    }
  }, [values.property, values.block, values.floor, setFieldValue]);

  return null;
}
