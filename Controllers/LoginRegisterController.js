const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const RegisterValidation = require("../Validations/RegisterValidation");
const LoginValidation = require("../Validations/LoginValidation");
//* Connecting Database using pg
const Pool = require("pg").Pool;
const connectionString = process.env.DB_URL;
const pool = new Pool({
  connectionString,
});

const SECRET = process.env.SECRET ?? "jtang";

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
router.post("/login", validation(LoginValidation), async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query(`SELECT * FROM "Users" WHERE email = $1`, [
    email,
  ]);
  const currentUser = user.rows[0];
  if (user.rows.length === 0) {
    res.status(401).send({ error: "No user found." });
  } else if (bcrypt.compareSync(password, currentUser.password)) {
    const payload = { currentUser };
    const token = jwt.sign(payload, SECRET, { expiresIn: "1200s" });
    res.status(200).send({ msg: "Login successful!", token });
  } else {
    res.status(401).send({ error: "Login failed." });
  }
});

//router for register as new user
router.post("/newuser", validation(RegisterValidation), async (req, res) => {
  const { full_name, email, password, phone_no, birthdate, gender } = req.body;
  const findExistingEmail = await pool.query(
    `SELECT * FROM "Users" WHERE email = $1`,
    [email]
  );
  if (findExistingEmail.rows.length === 0) {
    try {
      const hash = bcrypt.hashSync(password, 10);
      const addNewUser = await pool.query(
        `INSERT INTO "Users" ("id", full_name, email, password, phone_no, birthdate, gender) VALUES (nextval('users_id_seq'), $1, $2, $3, $4, $5, $6) RETURNING *`,
        [full_name, email, hash, phone_no, birthdate, gender]
      );
      res.status(200).json(addNewUser);
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    res.status(400).json({ msg: "This email already exists." });
  }
});

//router for viewing current user in edit profile
router.get("/currentuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const viewThisUser = await pool.query(
      `SELECT * FROM "Users" WHERE "id" = $1`,
      [id]
    );
    res.status(200).send(viewThisUser.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router for editing profile details
router.put(
  "/edituserdetails/:id",
  validation(RegisterValidation),
  async (req, res) => {
    const { id } = req.params;
    const { full_name, email, password, phone_no, birthdate, gender } =
      req.body;
    //? --------> continue with conditional
  }
);

module.exports = router;
