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
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/allcartitems/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const allCartItems = await pool.query(
      `SELECT title, image_url, price, quantity, "Goods_id", "Cart".id FROM "Cart" INNER JOIN "Goods" ON "Cart"."Goods_id" = "Goods"."id" WHERE "Users_id" = $1 AND checked_out = false`,
      [id]
    );
    res.status(200).json(allCartItems.rows);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/addtocart/", validation(CartValidation), async (req, res) => {
  const { quantity, User_id, Goods_id } = req.body;
  const findExistingItem = await pool.query(
    `SELECT * FROM "Cart" WHERE "Users_id" = $1 AND "Goods_id" = $2 AND checked_out = false`,
    [User_id, Goods_id]
  );
  if (findExistingItem.rows.length !== 0) {
    res.status(401).json(findExistingItem.rows);
  } else {
    const addToCart = await pool.query(
      `INSERT INTO "Cart"("id", quantity, "Users_id", "Goods_id") VALUES(nextval('cart_id_seq'), $1, $2, $3) RETURNING *`,
      [quantity, User_id, Goods_id]
    );
    res.status(200).json(addToCart);
  }
});

router.put("/edititemquantity", async (req, res) => {
  const { quantity, User_id, Goods_id, cartItem_id } = req.body;
  if (quantity > 0 && quantity < 6) {
    const editItemQuantity = await pool.query(
      `UPDATE "Cart" SET quantity = $1 WHERE id = $2`,
      [quantity, cartItem_id]
    );
    res.status(200).json({ msg: "Item quantity changed." });
  } else {
    res.status(500).send({
      error: "Item quantity is not between 1 to 5. Quantity not updated.",
    });
  }
});

router.delete("/removecartitem/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteThisCartItem = await pool.query(
      `DELETE FROM "Cart" WHERE "id" = $1 AND checked_out = false`,
      [id]
    );
    res.status(200).json({ msg: "Item deleted." });
  } catch (error) {
    res.status(500).send({ msg: "Item not deleted" });
  }
});

router.post("/addtopurchases", async (req, res) => {
  const { User_id, checkedOutItems, grand_total, transaction_no } = req.body;
  try {
    for (const eachItem of checkedOutItems) {
      const addToPurchase = await pool.query(
        `INSERT INTO "Purchases"("id", "Users_id", "Goods_id", purchase_price, quantity, transaction_no, grand_total) VALUES(nextval('purchase_id_seq'), $1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          User_id,
          eachItem.Goods_id,
          eachItem.price,
          eachItem.quantity,
          transaction_no,
          grand_total,
        ]
      );
      const changeCartCheckOutStatus = await pool.query(
        `UPDATE "Cart" SET checked_out = true WHERE id = $1`,
        [eachItem.id]
      );
    }
    res.status(200).json({ msg: "Transaction completed." });
  } catch (error) {
    res.status(500).send({ msg: "Cannot be updated" });
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
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
