// Update with your config settings.
const DB_URL =
  process.env.DB_URL ??
  "postgres://pwddrxwa:d7fNZo35tih9nkXrVRdwPI-hF3jonNhN@tiny.db.elephantsql.com/pwddrxwa";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: DB_URL,
    migrations: {
      directory: "./Data/Migrations",
    },
    seeds: { directory: "./Data/Seeds" },
  },

  staging: {
    client: "pg",
    connection: DB_URL,
    migrations: {
      directory: "./Data/Migrations",
    },
    seeds: { directory: "./Data/Seeds" },
  },

  production: {
    client: "pg",
    connection: DB_URL,
    migrations: {
      directory: "./Data/Migrations",
    },
    seeds: { directory: "./Data/Seeds" },
  },
};
