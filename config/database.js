const { Pool } = require("pg");
require("dotenv").config();

const connection = new Pool({
  connectionString: process.env.DB_STRING,
});

// Function to create a "users" table if it doesn't exist
(async () => {
  const client = await connection.connect();
  try {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL,
          hash TEXT NOT NULL,
          salt TEXT NOT NULL,
          admin BOOLEAN NOT NULL DEFAULT false
        );
      `;
    await client.query(createTableQuery);
    console.log("Users table created or already exists.");
  } catch (error) {
    console.error("Error creating users table:", error);
  } finally {
    client.release();
  }
})();

module.exports = connection;
