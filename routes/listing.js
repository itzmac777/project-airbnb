const express = require("express");
const router = express.Router();

// ==== LOCAL MODULES ====
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");

// ==== LOCAL MIDDLEWARES ====
const { isLoggedIn } = require("../middleware.js");

// ==== COMPONENTS ====
const listingControllers = require("../components/listings.js");

// ==== LISTING ROUTES ====

// INDEX ROUTE
router.get("/", listingControllers.index);

//CREATE ROUTE
router.get("/new", isLoggedIn, listingControllers.renderCreate);

router.post("/", isLoggedIn, listingControllers.create);

//READ ROUTE
router.get("/:id", listingControllers.read);

//UPDATE ROUTE
router.get("/:id/edit", isLoggedIn, listingControllers.renderUpdate);

router.patch("/:id", isLoggedIn, listingControllers.update);

//DELETE ROUTE
router.delete("/:id", isLoggedIn, listingControllers.delete);

module.exports = router;
