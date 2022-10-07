const yup = require("yup");

const GoodsValidation = yup.object({
  title: yup
    .string()
    .min(5, "A minimum length of 5 char is required.")
    .max(60, "A maximum length of 60 char is allowed.")
    .required("Title must be provided."),
  image_url: yup
    .string()
    .matches(
      /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{5,200}$/,
      {
        message:
          "The URL must not contain any whitespaces, must have at least one uppercase letter, one lowercase character, one digit, one special character, and must be 5-200 characters long.",
        excludeEmptyString: true,
      }
    )
    .required("Image URL is required."),
  description: yup
    .string()
    .min(20, "A minimum length of 20 char is required.")
    .max(500, "A maximum length of 500 char is allowed.")
    .required("Goods description must be provided."),
  goods_type: yup
    .string()
    .matches(/(Product|Service)/, {
      message: "A goods type is required.",
      excludeEmptyString: true,
    })
    .required("A goods type is required."),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("A price is required.")
    .min(0, "Price cannot be less than 0.")
    .max(999, "Price cannot be higher than 999."),
});

module.exports = GoodsValidation;
