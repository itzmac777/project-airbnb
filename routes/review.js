const express = require("express");
const router = express.Router({ mergeParams: true });

// ==== LOCAL MODULES ====
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");

// ==== LOCAL MIDDLEWARES ====
const { isLoggedIn } = require("../middleware.js");

// ==== REVIEWS ROUTES ====

//REVIEWS - REDIRECT ROUTE
router.get("/", (req, res, next) => {
  const { id } = req.params;
  res.redirect(`/listings/${id}`);
});

//REVIEWS - CREATE ROUTE
router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { review } = req.body;
    const creatorId = req.user["_id"];
    let listing = await Listing.findById(id);
    review.createdAt = Date.now();
    review.createdBy = await User.findById(creatorId);
    let newReview = new Review(review);
    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(new ExpressError(400, "Please enter valid data"));
  }
});

//REVIEWS - DELETE ROUTE

router.delete("/", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { listingId } = req.body;
    const currUser = req.user["_id"];
    let review = await Review.findById(id);
    if (
      review.createdBy["_id"].equals(currUser) ||
      req.user.username == "admin"
    ) {
      await Listing.findByIdAndUpdate(listingId, {
        $pull: { reviews: id },
      });
      await Review.findByIdAndDelete(id);
      req.flash("success", "Review Deleted");
      res.redirect(`/listings/${listingId}`);
    } else {
      req.flash("failure", "You cannot delete this review");
      return res.redirect(`/listings/${listingId}`);
    }
  } catch (err) {
    next(new ExpressError(400, "Review was not found"));
  }
});

module.exports = router;
