const express = require("express");
const session = require("express-session");
const { Pool } = require("pg");
const pgSession = require("connect-pg-simple")(session);

/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require("dotenv").config();

// Create the Express application
var app = express();

// Middleware that allows Express to parse through both JSON and x-www-form-urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to PostgreSQL Server using the connection string in the `.env` file.
 * To implement this, place the following string into the `.env` file:
 *
 * DB_STRING=postgresql://<user>:<password>@localhost:5432/database_name
 */
const pgPool = new Pool({
  connectionString: process.env.DB_STRING,
});

/**
 * -------------- SESSION SETUP ----------------
 */

/**
 * The `pgSession` is used to store session data in PostgreSQL. We provide the `pgPool`
 * connection to interact with the database.
 */
app.use(
  session({
    store: new pgSession({
      pool: pgPool, // Connection pool to use
      tableName: "session", // Default is 'session', customize if needed
      createTableIfMissing: true, // Optionally create the table automatically
    }),
    secret: process.env.SECRET, // Replace with your own secure secret
    resave: false, // Prevents resaving unchanged sessions
    saveUninitialized: true, // Saves uninitialized sessions
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

/**
 * -------------- ROUTES ----------------
 */

// When you visit http://localhost:3000/
app.get("/", (req, res, next) => {
  res.send("<h1>Hello World (Sessions)</h1>");
});

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
