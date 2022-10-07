const yup = require("yup");

const CartValidation = yup.object({
  quantity: yup
    .number()
    .min(0, "Quantity cannot be lower than 0.")
    .max(5, "Quantity cannot be higher than 5."),
  Users_id: yup.number().min(0, "id cannot be lower than 0."),
  Goods_id: yup.number().min(0, "id cannot be lower than 0."),
  link_to: yup.string().max(50, "A maximum length of 50 char is allowed."),
  checked_out: yup.boolean(),
});

module.exports = CartValidation;
