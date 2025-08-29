import { Formik } from "formik";

function AppForm({ initialValues, onSubmit, validationSchema, children }) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(formikProps) =>
        typeof children === "function"
          ? children(formikProps) // 🔑 Call function-as-children
          : children              // Or render JSX normally
      }
    </Formik>
  );
}

export default AppForm;
