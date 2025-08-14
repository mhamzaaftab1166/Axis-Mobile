import * as Yup from "yup";
const today = new Date();
const minOneTimeDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 3
);
const minRegularStartDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate() + 7
);

const isValidDateString = (dateString) => {
  if (typeof dateString !== "string") return false;
  const parts = dateString.split("-");
  if (parts.length !== 3) return false;
  const [yyyy, mm, dd] = parts.map(Number);
  if (!Number.isInteger(yyyy) || !Number.isInteger(mm) || !Number.isInteger(dd))
    return false;
  const d = new Date(yyyy, mm - 1, dd);
  return (
    d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd
  );
};
const parseDateString = (dateString) => {
  const [yyyy, mm, dd] = dateString.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
};

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const bookingValidationSchema = Yup.object().shape({
  serviceTime: Yup.object({
    oneTimeTime: Yup.string().when("mode", {
      is: "oneTime",
      then: (schema) =>
        schema
          .required("One-time time is required")
          .matches(timeRegex, "Time must be in HH:mm format"),
      otherwise: (schema) => schema.notRequired(),
    }),

    regular: Yup.object().when("mode", {
      is: "regular",
      then: (schema) =>
        schema.required().shape({
          type: Yup.string()
            .oneOf(["all", "selected"])
            .required("Regular type is required"),
          startDate: Yup.string()
            .required("Start date is required")
            .test(
              "is-valid-format",
              "Start date must be in YYYY-MM-DD format",
              (val) => isValidDateString(val)
            )
            .test(
              "min-date",
              `Start date must be at least ${minRegularStartDate.toLocaleDateString()}`,
              (val) => {
                if (!isValidDateString(val)) return false;
                const d = parseDateString(val);
                const m = new Date(minRegularStartDate);
                m.setHours(0, 0, 0, 0);
                return d.getTime() >= m.getTime();
              }
            ),
          startTime: Yup.string()
            .required("Start time is required")
            .matches(timeRegex, "Start time must be in HH:mm format"),
          selectedDays: Yup.array().when("type", {
            is: "selected",
            then: (schema) =>
              schema
                .required()
                .min(1, "Select at least one day")
                .of(
                  Yup.string().oneOf([
                    "mon",
                    "tue",
                    "wed",
                    "thu",
                    "fri",
                    "sat",
                    "sun",
                  ])
                ),
            otherwise: (schema) => schema.notRequired(),
          }),
          repeat: Yup.boolean().required(),
          repeatDuration: Yup.string().when("repeat", {
            is: true,
            then: (schema) =>
              schema
                .required("Please select a repeat interval")
                .oneOf(
                  ["1w", "2w", "3w", "1m", "2m", "3m", "6m", "9m", "1y"],
                  "Invalid repeat interval"
                ),
            otherwise: (schema) => schema.notRequired(),
          }),
        }),
      otherwise: (schema) => schema.notRequired(),
    }),
  }).required("Service Time is required"),
});
