if (process.env.NODE_ENV != "prduction") {
  require("dotenv").config();
}

// ==== BASIC SERVER SETUP ====
const express = require("express");
const app = express();
app.listen(3000, () => {
  console.log("Server started on port: 3000");
});

// ==== DB CONNECTION ====
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnbv2";
const main = async () => {
  await mongoose.connect(MONGO_URL);
};
main()
  .then((msg) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// ==== NPM MODULES ====
const path = require("path");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// ==== LOCAL MODULES ====
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");
const User = require("./models/user.js");

// ==== MIDDLEWARES ====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(
  session({
    secret: "airbnbv2",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// ==== LOCAL MIDDLEWARES ====
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  if (req.user) {
    res.locals.userExists = true;
    res.locals.userInfo = req.user;
  } else {
    res.locals.userExists = false;
  }
  next();
});

// ==== LISTING ROUTE ====
app.use("/listings", listing);

// ==== REVIEWS ROUTE ====
app.use("/listings/:id/reviews", review);

// ==== REGISTER ROUTE ====
app.use("/auth/user", user);

// === ERROR HANDLING MIDDLEWARE ===
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { status = 400, message = "Bad request" } = err;
  res.status(status).render("listings/error.ejs", { status, message });
});
