import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./src/database/dev.sqlite3",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    useNullAsDefault: true,
  },

  test: {
    client: "sqlite3",
    connection: {
      filename: "./src/database/test.sqlite3",
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    useNullAsDefault: true,
  },

  production: {
    client: "pg",
    connection: `${process.env.DATABASE_URL}?ssl=true`,
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds/",
    },
    useNullAsDefault: true,
  },
};
