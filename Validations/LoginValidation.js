const yup = require("yup");

const LoginValidation = yup.object({
  email: yup
    .string()
    .email("Must be a valid email")
    .required("An email address is required."),
  password: yup
    .string()
    .matches(
      /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/,
      {
        message:
          "Password must not contain any whitespaces, must have at least one uppercase letter, one lowercase character, one digit, one special character, and must be 10-16 characters long.",
        excludeEmptyString: true,
      }
    )
    .required("Password is required."),
});

module.exports = LoginValidation;
