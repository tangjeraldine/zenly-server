const bcrypt = require("bcrypt");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Users").del();
  await knex("Users").insert([
    {
      id: 1,
      full_name: "Jade Chua Min Min",
      email: "jadechua@gmail.com",
      password: bcrypt.hashSync("Voll3yB@llL0ve!", 10),
      phone_no: "92223444",
      birthdate: "02-02-2002",
      gender: "Female",
      security_lvl: 1,
    },
    {
      id: 2,
      full_name: "Alex Tan Xiao Ming",
      email: "alextan@gmail.com",
      password: bcrypt.hashSync("tantanFamily%12", 10),
      phone_no: "80019002",
      birthdate: "15-09-1980",
      gender: "Male",
      security_lvl: 1,
    },
    {
      id: 3,
      full_name: "Bobby Liew",
      email: "bobliew@gmail.com",
      password: bcrypt.hashSync("TCM1sthebest*", 10),
      phone_no: "83338555",
      birthdate: "15-08-1990",
      gender: "Male",
      security_lvl: 2,
    },
  ]);
};
