import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

export default function ResetAddressFields() {
  const { values, setFieldValue } = useFormikContext();

  const prevPropertyRef = useRef(values.property?._id ?? null);
  const prevBlockRef = useRef(values.block?._id ?? null);
  const prevFloorRef = useRef(values.floor?._id ?? null);

  useEffect(() => {
    if (prevPropertyRef.current !== values.property?._id) {
      setFieldValue("block", null);
      setFieldValue("floor", null);
      setFieldValue("unit", null);
      prevPropertyRef.current = values.property?._id ?? null;
    }

    if (prevBlockRef.current !== values.block?._id) {
      setFieldValue("floor", null);
      setFieldValue("unit", null);
      prevBlockRef.current = values.block?._id ?? null;
    }

    if (prevFloorRef.current !== values.floor?._id) {
      setFieldValue("unit", null);
      prevFloorRef.current = values.floor?._id ?? null;
    }
  }, [values.property, values.block, values.floor, setFieldValue]);

  return null;
}
