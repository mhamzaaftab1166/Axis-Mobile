import { useFormikContext } from "formik";
import AppInput from "../AppInputFeild";
import AppErrorMessage from "./AppErrorMessage";

const AppFormField = ({
  name,
  isPassword,
  parentStyles,
  icon,
  style,
  editable,
  multiline,
  numberOfLines,
  ...otherProps
}) => {
  const { touched, setFieldTouched, errors, values, setFieldValue } =
    useFormikContext();

  return (
    <>
      <AppInput
        placeholder={otherProps.placeholder}
        value={values[name]}
        onChangeText={(text) => setFieldValue(name, text)}
        onBlur={() => setFieldTouched(name)}
        isPassword={isPassword}
        parentStyles={parentStyles}
        icon={icon}
        style={style}
        editable={editable}
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...otherProps}
      />
      <AppErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormField;
