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
  try {
    const findExistingItem = await pool.query(
      `SELECT * FROM "Cart" WHERE "id" = $1 AND "Goods_id" = $2 AND checked_out = false`,
      [User_id, Goods_id]
    );
    if (findExistingItem.length !== 0) {
      res.status(401).json(findExistingItem);
      // {
      //   msg: "Item already exists in cart";
      // }
    } else {
      const addToCart = await pool.query(
        `INSERT INTO "Cart"("id", quantity, "Users_id", "Goods_id") VALUES(nextval('cart_id_seq'), $1, $2, $3) RETURNING *`,
        [quantity, User_id, Goods_id]
      );
      res.status(200).json({ msg: "Added to cart" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/edititemquantity", async (req, res) => {
  const { quantity, User_id, Goods_id, cartItem_id } = req.body;
  try {
    const editItemQuantity = await pool.query(
      `UPDATE "Cart" SET quantity = $1 WHERE id = $2`,
      [quantity, cartItem_id]
    );
    res.status(200).json({ msg: "Item quantity changed." });
  } catch (error) {
    res.status(500).send(error);
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

router.post(
  "/addtopurchases",
  validation(PurchasesValidation),
  async (req, res) => {
    const {
      Cart_id,
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
        [
          User_id,
          Goods_id,
          purchase_price,
          quantity,
          transaction_no,
          grand_total,
        ]
      );
      const changeCartCheckOutStatus = await pool.query(
        `UPDATE "Cart" SET checked_out = true WHERE id = $1`,
        [Cart_id]
      );
      res.status(200).json(addToPurchase);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

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
