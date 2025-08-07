import * as Yup from "yup";

const getPropertyValidationSchema = (selectedProperty) => {
  return Yup.object().shape({
    propertyType: Yup.array()
      .min(1, "Select at least one")
      .required("Required"),

    property_name: Yup.string()
      .required("Property Name is required")
      .min(5, "Property Name must be at least 5 characters"),

    bhk: Yup.mixed().when("propertyType", (propTypeArray, schema) => {
      return selectedProperty?.value === "Residential"
        ? schema.required("Please select a BHK")
        : schema.notRequired();
    }),

    property_category: Yup.string().required("Please select a Property Category"),

    full_address: Yup.string().min(5, "Address must be at least 5 characters"),

    pinLink: Yup.string()
      .required("Pin location link is required")
      .url("Enter a valid URL"),

    tower_villa_shop_name: Yup.string().required(
      "Tower/Villa/Shop name is required"
    ),

    flat_villa_shop_no: Yup.string().required(
      "Flat/Villa/Shop number is required"
    ),

    floor: Yup.string(),

    city: Yup.string().required("Please select a City"),
  });
};

export default getPropertyValidationSchema;
