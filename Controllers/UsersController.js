const express = require("express");
const router = express.Router();
const PurchasesValidation = require("../Validations/PurchasesValidation");
const CartValidation = require("../Validations/CartValidation");
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

router.get("/all", async (req, res) => {
  try {
    const allGoods = await pool.query(`SELECT * FROM "Goods"`);
    res.status(200).json(allGoods.rows);
    pool.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/current/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const currentgood = await pool.query(
      `SELECT * FROM "Goods" WHERE "Goods".id = $1`,
      [id]
    );
    res.status(200).json(currentgood.rows[0]);
    pool.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/allproducts", async (req, res) => {
  try {
    const allProducts = await pool.query(
      `SELECT * FROM "Goods" WHERE goods_type = 'Product'`
    );
    res.status(200).json(allProducts.rows);
    pool.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/allservices", async (req, res) => {
  try {
    const allServices = await pool.query(
      `SELECT * FROM "Goods" WHERE goods_type = 'Service'`
    );
    res.status(200).json(allServices.rows);
    pool.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/allcartitems/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //? SOMETHING ODD ABOUT THIS. YOU NEED TO GET THE ROW IN CART WHERE THE USER_ID IS <$1>, THEN, USE THE GOODS_ID IN THAT ROW, TO SELECT TITLE PRICE ETC FROM 'GOODS' --> USE SUB QUERY? OR JUNCTION TABLE?
    const allCartItems = await pool.query(
      `SELECT title, price, goods_type FROM "Goods" WHERE "Goods".id = $1`,
      [id]
    );
    res.status(200).json(allCartItems.rows);
    pool.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/addtocart", validation(CartValidation), async (req, res) => {
  const { quantity, User_id, Goods_id } = req.body;
  try {
    const addToCart = await pool.query(
      `INSERT INTO "Cart"("id", quantity, "Users_id", "Goods_id") VALUES(nextval('cart_id_seq'), $1, $2, $3) RETURNING *`,
      [quantity, User_id, Goods_id]
    );
    res.status(200).json(addToCart);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/removecartitem/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const findThisCartItem = await pool.query(
      `SELECT * FROM "Cart" WHERE "Cart".id = $1`,
      [id]
    );
    const thisItem = findThisCartItem.rows[0];
    if (thisItem.checked_out === false) {
      const deleteThisCartItem = await pool.query(
        `DELETE FROM "Cart" WHERE "Cart".id = $1 AND checked_out = false`,
        [id]
      );
      res.status(200).json({ msg: "Item deleted." });
      pool.end();
    } else res.status(400).json({ msg: "Item is checked out. Not deleted." });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/purchases", validation(PurchasesValidation), async (req, res) => {
  const {
    User_id,
    Goods_id,
    transaction_no,
    purchase_price,
    quantity,
    grand_total,
  } = req.body;
  try {
    const addToPurchase = await pool.query(
      `INSERT INTO "Purchases"("id", "Users_id", "Goods_id", purchase_price, quantity, transaction_no, grand_total) VALUES(nextval('purchase_id_seq'), $1, $2, $3, $4, $5, $6) RETURNING *`,
      [User_id, Goods_id, purchase_price, quantity, transaction_no, grand_total]
    );
    res.status(200).json(addToPurchase);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/mypurchases/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getMyPurchases = await pool.query(
      `SELECT * FROM "Purchases" WHERE "Users_id" = $1`,
      [id]
    );
    res.status(200).json(getMyPurchases.rows);
    pool.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
