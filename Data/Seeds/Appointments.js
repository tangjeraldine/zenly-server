/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("Appointments").del();
  await knex("Appointments").insert([
    {
      id: 1,
      Users_id: 2,
      Goods_id: 3,
      date_time: "2022-10-15T15:30:00",
      visit_purpose: "Sore neck after badminton.",
      appt_status: "Session Confirmed",
    },
  ]);
};
