require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

// Import routes
const rootRoute = require("./routes/rootRoute.route");
const notFoundRoute = require("./routes/notfound.route");

// Initialize app
const app = express();

// Set the View Engine
app.set("view engine", "ejs");

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Allows us to use HTTP verbs like PUT, DELETE
app.use(methodOverride("_method"));

// Helps with cookies, making them available as req.cookie
app.use(cookieParser());

// Setting the static file as public
app.use(express.static("public"));

// For the flash, a session is needed
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());

// Express Flash Middleware
app.use("/", function (req, res, next) {
  const message = req.flash();
  res.locals.message = message;
  next();
});

// Routes
app.use("/", rootRoute);
app.use("*", notFoundRoute);

// Export the app
module.exports = app;
