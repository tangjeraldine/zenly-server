require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
//* Connecting Port
const PORT = process.env.PORT ?? 3000;
const UsersController = require("./Controllers/UsersController");
const LoginRegisterController = require("./Controllers/LoginRegisterController");
//* Connecting Database using pg
const Pool = require("pg").Pool;
const connectionString = process.env.DB_URL;
const pool = new Pool({
  connectionString,
});
// const Pool = require("pg").Pool;
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "ice_creams",
//   password: "Th$Beebies2809",
//   port: 5432,
// });
//* Middleware
app.use(cors());
app.use(express.json());
app.use("/user", UsersController);
app.use("/sign", LoginRegisterController);

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

app.get("/allicecream", async (req, res) => {
  try {
    const allIceCreams = await pool.query("SELECT * FROM ice_creams");
    res.status(200).json(allIceCreams.rows);
    pool.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/all", async (req, res) => {
  try {
    const allGoods = await pool.query(`SELECT * FROM "Goods"`);
    res.status(200).json(allGoods.rows);
    pool.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
