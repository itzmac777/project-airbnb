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

// ==== LOCAL MODULES ====
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const listing = require("./routes/listing.js");
const review = require("./routes/review.js");

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

// ==== ACQUIRING FLASH IF EXISTS ====
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  next();
});

// ==== LISTING ROUTE ====
app.use("/listings", listing);

// ==== REVIEWS ROUTE ====
app.use("/listings/:id/reviews", review);

// === ERROR HANDLING MIDDLEWARE ===
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { status = 400, message = "Bad request" } = err;
  res.status(status).render("listings/error.ejs", { status, message });
});
