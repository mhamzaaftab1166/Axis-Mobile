import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

function ResetPropertyCategoryOnTypeChange() {
  const { values, initialValues, setFieldValue } = useFormikContext();
  const initialPropertyTypeRef = useRef(initialValues.propertyType);

  useEffect(() => {
    const initialValue = initialPropertyTypeRef.current?.[0]?.value;
    const currentValue = values.propertyType?.[0]?.value;

    if (initialValue !== currentValue) {
      setFieldValue("property_category", "");
      setFieldValue("bhk",null);
      initialPropertyTypeRef.current = values.propertyType;
    }
  }, [values.propertyType, setFieldValue]);

  return null;
}

export default ResetPropertyCategoryOnTypeChange;
