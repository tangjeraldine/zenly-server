/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Cart").del();
  await knex("Cart").insert([
    {
      id: 1,
      quantity: 1,
      Users_id: 1,
      Goods_id: 1,
      link_to: "",
      checked_out: false,
    },
    {
      id: 2,
      quantity: 1,
      Users_id: 2,
      Goods_id: 2,
      link_to: "",
      checked_out: false,
    },
    {
      id: 3,
      quantity: 1,
      Users_id: 2,
      Goods_id: 5,
      link_to: "",
      checked_out: true,
    },
    {
      id: 4,
      quantity: 2,
      Users_id: 2,
      Goods_id: 3,
      link_to: "",
      checked_out: true,
    },
    {
      id: 5,
      quantity: 1,
      Users_id: 1,
      Goods_id: 6,
      link_to: "",
      checked_out: true,
    },
  ]);
};
