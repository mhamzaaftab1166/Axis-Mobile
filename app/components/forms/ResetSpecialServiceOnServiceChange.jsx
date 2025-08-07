import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

function ResetSpecialServicesOnTypeChange({
  serviceField = "service",
  specialField = "specialServicesSection",
}) {
  const { values, setFieldValue } = useFormikContext();
  const prevTypeRef = useRef(values[serviceField]?.type ?? null);

  useEffect(() => {
    const prevType = prevTypeRef.current;
    const currType = values[serviceField]?.type;
    if (prevType !== currType) {
      setFieldValue(specialField, {
        specialServices: [],
        specialServicesSwitch: true,
      });
      prevTypeRef.current = currType;
    }
  }, [values[serviceField]?.type, setFieldValue, serviceField, specialField]);

  return null;
}

export default ResetSpecialServicesOnTypeChange;
