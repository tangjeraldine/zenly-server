/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = (knex, Promise) => {
  return knex.schema
    .createTable("Users", function (tbl) {
      tbl.primary(["id"]);
      tbl.increments("id").checkPositive().notNullable();
      tbl.string("full_name", 40).notNullable();
      tbl.unique(["email"]);
      tbl.string("email", 40).notNullable();
      tbl.string("password").notNullable();
      tbl.string("phone_no").checkRegex("[0-9]{8,15}").notNullable();
      tbl.string("birthdate", 25).notNullable();
      tbl.enu("gender", ["Male", "Female"]).notNullable();
      tbl.integer("security_lvl").defaultTo(1);
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("Goods", function (tbl) {
      tbl.primary(["id"]);
      tbl.increments("id").checkPositive().notNullable();
      tbl.unique(["title"]);
      tbl.string("title", 60).notNullable();
      tbl.string("image_url", 200).notNullable();
      tbl.text("description").notNullable();
      tbl.enu("goods_type", ["Product", "Service"]).notNullable();
      tbl.float("price", 5, 2).notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("Cart", function (tbl) {
      tbl.primary(["id"]);
      tbl.increments("id").checkPositive().notNullable();
      tbl.integer("quantity").checkPositive().notNullable();
      tbl
        .integer("Users_id")
        .unsigned()
        .references("Users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      tbl
        .integer("Goods_id")
        .unsigned()
        .references("Goods.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      tbl.string("link_to", 50);
      tbl.boolean("checked_out").defaultTo(false);
    })
    .createTable("Purchases", function (tbl) {
      tbl.primary(["id"]);
      tbl.increments("id").checkPositive().notNullable();
      tbl
        .integer("Users_id")
        .unsigned()
        .references("Users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      tbl
        .integer("Goods_id")
        .unsigned()
        .references("Goods.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      tbl.float("purchase_price", 5, 2).notNullable();
      tbl.integer("quantity").checkPositive().notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
      tbl.string("transaction_no", 30).notNullable();
      tbl
        .enu("order_status", [
          "Pending Confirmation",
          "Session Booked",
          "Order Completed",
          "Order Cancelled",
        ])
        .defaultTo("Pending Confirmation");
      tbl.float("grand_total", 6, 2).defaultTo(0);
    })
    .createTable("Appointments", function (tbl) {
      tbl.primary(["id"]);
      tbl.increments("id").checkPositive().notNullable();
      tbl
        .integer("Users_id")
        .unsigned()
        .references("Users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      tbl
        .integer("Goods_id")
        .unsigned()
        .references("Goods.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      tbl
        .integer("Purchases_id")
        .unsigned()
        .references("Purchases.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      tbl.string("date_time").notNullable();
      tbl.text("visit_purpose", 300).notNullable();
      tbl
        .enu("appt_status", [
          "Pending Confirmation",
          "Session Confirmed",
          "Session Completed",
          "Session Cancelled",
        ])
        .defaultTo("Pending Confirmation");
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = (knex, Promise) => {
  return knex.schema

    .dropTableIfExists("Cart")
    .dropTableIfExists("Purchases")
    .dropTableIfExists("Appointments")
    .dropTableIfExists("Users")
    .dropTableIfExists("Goods");
};
