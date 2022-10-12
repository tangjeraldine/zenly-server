const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const GoodsValidation = require("../Validations/GoodsValidation");
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

//router for viewing pending orders, appointments booked, appointments completed
router.get("/allpendingorders", async (req, res) => {
  try {
    const getPendingOrders = await pool.query(
      `SELECT * FROM "Purchases" WHERE order_status = 'Pending Confirmation'`
    );
    res.status(200).send(getPendingOrders.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router to display pending orders and sort them by timestamp and transaction no.
router.get("/displayallorders", async (req, res) => {
  try {
    const displayAllOrders = await pool.query(
      `SELECT * FROM "Purchases" FULL JOIN "Goods" on "Purchases"."Goods_id" = "Goods"."id" ORDER BY created_at DESC, transaction_no ASC`
    );
    res.status(200).send(displayAllOrders.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router to get the buyer details for that purchase
router.get("/viewthisbuyer/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const viewThisBuyer = await pool.query(
      `SELECT * FROM "Users" WHERE "id" = $1`,
      [id]
    );
    res.status(200).send(viewThisBuyer.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router to filter and see only certain purchases

//router to edit the order status via Purchases table id
router.put("/editorderstatus", async (req, res) => {
  const { order_status, transaction_no, Goods_id, Users_id, created_at } =
    req.body;
  try {
    const changeOrderStatus = await pool.query(
      `UPDATE "Purchases" SET order_status = $1 WHERE transaction_no = $2 AND "Goods_id" = $3 AND "Users_id" = $4 AND created_at = $5 RETURNING *`,
      [order_status, transaction_no, Goods_id, Users_id, created_at]
    );
    res.status(200).send(changeOrderStatus.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router to view all goods
router.get("/viewgoodslist/", async (req, res) => {
  try {
    const viewAllGoods = await pool.query(`SELECT * FROM "Goods" `);
    res.status(200).send(viewAllGoods.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router to view that particular good in Modal
router.get("/viewgoodslist/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const viewThisGoods = await pool.query(
      `SELECT * FROM "Goods" WHERE "id"=$1 `,
      [id]
    );
    res.status(200).send(viewThisGoods.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router to edit Goods items
router.put(
  "/editgoodsdetails/",
  validation(GoodsValidation),
  async (req, res) => {
    const { title, image_url, description, goods_type, price, id } = req.body;
    try {
      const editGoodsDetails = await pool.query(
        `UPDATE "Purchases" SET title = $1, image_url=$2, description = $3, goods_type=$4, price=$5 WHERE "id" = $6 RETURNING *`,
        [title, image_url, description, goods_type, price, id]
      );
      res.status(200).json(editGoodsDetails);
    } catch (error) {
      res.status(500).send({ msg: "Failed to edit goods details." });
    }
  }
);

//router to new items to Goods table
router.post("/addnewgoods/", validation(GoodsValidation), async (req, res) => {
  const { title, image_url, description, goods_type, price } = req.body;
  try {
    const addNewGood = await pool.query(
      `INSERT INTO "Goods" ("id", title, image_url, description, goods_type, price) VALUES(nextval('goods_id_seq'), $1, $2, $3, $4, $5)RETURNING *`,
      [title, image_url, description, goods_type, price]
    );
    const seeAllGoods = await pool.query(`SELECT * FROM "Goods"`);
    res.status(200).json(seeAllGoods);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router to delete items from Goods table
router.delete("/deletegoods/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteThisGood = await pool.query(
      `DELETE FROM "Goods" WHERE "id" = $1`,
      [id]
    );
    res.status(200).json({ msg: "This item has been deleted." });
  } catch (error) {
    res.status(500).send({ msg: "Item not deleted" });
  }
});

//router to view all users
router.post("/viewuserslist/", async (req, res) => {
  const data = req.body;
  try {
    const viewThisUser = await pool.query(
      `SELECT * FROM "Users" WHERE (full_name) LIKE $1`,
      [data]
    );
    res.status(200).send(viewThisUser.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

//router to delete users from Users table
router.delete("/deleteuser/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteThisUser = await pool.query(
      `DELETE FROM "Users" WHERE "id" = $1`,
      [id]
    );
    res.status(200).json({ msg: "This user has been deleted." });
  } catch (error) {
    res.status(500).send({ msg: "User could not be deleted" });
  }
});

//router to suspend users? --> create new page to inform user they have been suspended
router.put("/changeuserstatus/:id", async (req, res) => {
  const { id } = req.params;
  const { thisStatus } = req.body;
  try {
    const changeSecurityLvl = await pool.query(
      `UPDATE "Users" SET security_lvl = $1 WHERE id = $2 RETURNING *`,
      [thisStatus, id]
    );
    res.status(200).json(changeSecurityLvl);
  } catch (error) {
    res.status(500).send({ msg: "Item not deleted" });
  }
});

// router to obtain this user by name

module.exports = router;
