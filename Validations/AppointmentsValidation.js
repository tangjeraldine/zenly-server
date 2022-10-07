const yup = require("yup");

const AppointmentsValidation = yup.object({
  Users_id: yup.number().min(0, "id cannot be lower than 0."),
  Goods_id: yup.number().min(0, "id cannot be lower than 0."),
  Purchases_id: yup.number().min(0, "id cannot be lower than 0."),
  date_time: yup.date().required("Date and time is required."),
  visit_purpose: yup
    .string()
    .min(5, "A min length of 5 char is required.")
    .max(300, "A maximum length of 300 char is allowed.")
    .required("Purpose of visit must be provided."),
  appt_status: yup
    .string()
    .required("Exactly one status is required.")
    .matches(
      /(Pending Confirmation|Session Confirmed|Session Completed|Session Cancelled)/,
      {
        message: "Please select one status.",
        excludeEmptyString: true,
      }
    ),
});

module.exports = AppointmentsValidation;
