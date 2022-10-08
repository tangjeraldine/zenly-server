const yup = require("yup");

const PurchasesValidation = yup.object({
  Users_id: yup.number().min(0, "id cannot be lower than 0."),
  Goods_id: yup.number().min(0, "id cannot be lower than 0."),
  purchase_price: yup
    .number()
    .typeError("Price must be a number")
    .required("A price is required.")
    .min(0, "Price cannot be less than 0.")
    .max(999, "Price cannot be higher than 999."),
  quantity: yup
    .number()
    .min(0, "Quantity cannot be lower than 0.")
    .max(5, "Quantity cannot be higher than 5."),
  transaction_no: yup
    .string()
    .matches(/^[A-Za-z0-9_-]*$/, {
      excludeEmptyString: true,
    })
    .required("Transaction number is required."),
  order_status: yup
    .string()
    .matches(
      /(Pending Confirmation|Session Booked|Order Completed|Order Cancelled)/,
      {
        message: "Please select one status.",
        excludeEmptyString: true,
      }
    )
    .default("Pending Confirmation"),
  grand_total: yup
    .number()
    .typeError("Total must be a number")
    .required("A total is required.")
    .min(0, "Total cannot be less than 0.")
    .max(999, "Total cannot be higher than 999."),
});

module.exports = PurchasesValidation;
