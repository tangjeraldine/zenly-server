require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
//* Connecting Port
const PORT = process.env.PORT ?? 3000;
const UsersController = require("./Controllers/UsersController");
const LoginRegisterController = require("./Controllers/LoginRegisterController");
const AdminController = require("./Controllers/AdminController");
//* Connecting Database using pg
const Pool = require("pg").Pool;
const connectionString = process.env.DB_URL;
const pool = new Pool({
  connectionString,
});

//* Middleware
app.use(cors());
app.use(express.json());
app.use("/user", UsersController);
app.use("/sign", LoginRegisterController);
app.use("/admin", AdminController);

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

app.get("/", (req, res) => {
  res.json({ OnStart: "Welcome to Zenly API" });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
