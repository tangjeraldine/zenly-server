const express = require("express");
const router = express.Router();
const RegisterValidation = require("../Validations/RegisterValidation");
const LoginValidation = require("../Validations/LoginValidation");
//* Connecting Database using pg
const Pool = require("pg").Pool;
const connectionString = process.env.DB_URL;
const pool = new Pool({
  connectionString,
});

//* Middleware for validation
const validation = (schema) => async (req, res, next) => {
  const body = req.body;
  try {
    await schema.validate(body);
    next();
  } catch (error) {
    res.status(400).json(error);
  }
};

//router for login

//router for register as new user

//router for editing profile details

module.exports = router;
