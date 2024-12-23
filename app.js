const express = require("express");
const { Pool } = require("pg");
const session = require("express-session");
var passport = require("passport");
var crypto = require("crypto");
var routes = require("./routes");
const connection = require("./config/database");

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
 * -------------- SESSION SETUP ----------------
 */

/**
 * The `pgSession` is used to store session data in PostgreSQL. We provide the `pgPool`
 * connection to interact with the database.
 */
app.use(
  session({
    store: new pgSession({
      pool: connection, // Connection pool to use
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
 * -------------- PASSPORT AUTHENTICATION ----------------
 */
require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());

/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
