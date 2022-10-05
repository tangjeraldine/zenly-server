require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
//* Connecting Port
const PORT = process.env.PORT ?? 3000;
//* Connecting Database using pg
const { Pool, Client } = require("pg");
const connectionString = process.env.DB_URL;
const pool = new Pool({
  connectionString,
});
//* Middleware
app.use(cors());
app.use(express.json());
// app.use("/route", XXController);

app.get("/", (req, res) => {
  res.json({ OnStart: "Welcome to Zenly API" });
});

// app.get("/allicecream", async (req, res) => {
//   try {
//     const allIceCreams = await pool.query("SELECT * FROM ice_creams");
//     res.status(200).json(allIceCreams.rows);
//     pool.end();
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
