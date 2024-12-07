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

router
  .route("/")
  //RENDER
  .get(listingControllers.index)
  //CREATE
  .post(isLoggedIn, listingControllers.create);

//RENDER CREATE FORM
router.get("/new", isLoggedIn, listingControllers.renderCreate);

router
  .route("/:id")
  //READ
  .get(listingControllers.read)
  //UPDATE
  .patch(isLoggedIn, listingControllers.update)
  //DELETE
  .delete(isLoggedIn, listingControllers.delete);

//RENDER UPDATE FORM
router.get("/:id/edit", isLoggedIn, listingControllers.renderUpdate);

module.exports = router;
