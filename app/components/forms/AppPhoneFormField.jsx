import { useFormikContext } from "formik";
import { useRef } from "react";
import AppPhoneInput from "../AppPhoneInputFeild";
import AppErrorMessage from "./AppErrorMessage";

const AppPhoneFormField = ({ name, editable }) => {
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const phoneInputRef = useRef(null);

  return (
    <>
      <AppPhoneInput
        value={values[name]}
        onChangeText={(text) => setFieldValue(name, text)}
        phoneInputRef={phoneInputRef}
        touched={touched[name]}
        error={errors[name]}
        editable={editable}
      />
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppPhoneFormField;
