const express = require("express");
const router = express.Router({ mergeParams: true });

// ==== LOCAL MODULES ====
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");

// ==== LOCAL MIDDLEWARES ====
const { isLoggedIn } = require("../middleware.js");

// ==== COMPONENTS ====
const reviewControllers = require("../components/reviews.js");

// ==== REVIEWS ROUTES ====

//REVIEWS - REDIRECT ROUTE
router.get("/", reviewControllers.redirect);

//REVIEWS - CREATE ROUTE
router.post("/", isLoggedIn, reviewControllers.create);

//REVIEWS - DELETE ROUTE

router.delete("/", isLoggedIn, reviewControllers.delete);

module.exports = router;
