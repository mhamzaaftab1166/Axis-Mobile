import { useFormikContext } from "formik";
import { useCallback } from "react";
import AppImagePicker from "../AppImagePicker";
import AppErrorMessage from "./AppErrorMessage";

const AppImagePickerField = ({ name }) => {
  const { errors, setFieldValue, touched, values, setFieldTouched } =
    useFormikContext();

  const handleImageChange = useCallback(
    (uri) => {
      setFieldValue(name, uri);
      setFieldTouched(name, true, false);
    },
    [name, setFieldValue, setFieldTouched]
  );

  return (
    <>
      <AppImagePicker
        imageUri={values[name]}
        onChangeImage={handleImageChange}
        onError={(msg) => setFieldValue(`${name}Error`, msg)}
      />
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppImagePickerField;
