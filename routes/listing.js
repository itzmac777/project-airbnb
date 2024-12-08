const express = require("express");
const router = express.Router();

// ==== LOCAL MODULES ====
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const { cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

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
  .post(isLoggedIn, upload.single("listing[image]"), listingControllers.create);

//RENDER CREATE FORM
router.get("/new", isLoggedIn, listingControllers.renderCreate);

router
  .route("/:id")
  //READ
  .get(listingControllers.read)
  //UPDATE
  .patch(isLoggedIn, upload.single("data[image]"), listingControllers.update)
  //DELETE
  .delete(isLoggedIn, listingControllers.delete);

//RENDER UPDATE FORM
router.get("/:id/edit", isLoggedIn, listingControllers.renderUpdate);

module.exports = router;
