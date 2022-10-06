/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Purchases").del();
  await knex("Purchases").insert([
    {
      id: 1,
      Users_id: 2,
      Goods_id: 5,
      purchase_price: 7.0,
      quantity: 1,
      transaction_no: "a7076210jGDl71",
      order_status: "Pending Confirmation",
    },
    {
      id: 2,
      Users_id: 2,
      Goods_id: 3,
      purchase_price: 80.0,
      quantity: 2,
      transaction_no: "d8173210jGPl12",
      order_status: "Session Booked",
    },
    {
      id: 3,
      Users_id: 1,
      Goods_id: 6,
      purchase_price: 20.0,
      quantity: 1,
      transaction_no: "a8177210jGDl45",
      order_status: "Order Completed",
    },
  ]);
};
