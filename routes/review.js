const express = require("express");
const router = express.Router({ mergeParams: true });

// ==== LOCAL MODULES ====
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

// ==== REVIEWS ROUTES ====

//REVIEWS - CREATE ROUTE
router.post("/", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { review } = req.body;
    let listing = await Listing.findById(id);
    review.createdAt = Date.now();
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

router.delete("/", async (req, res) => {
  try {
    const { id } = req.params;
    const { listingId } = req.body;
    await Listing.findByIdAndUpdate(listingId, {
      $pull: { reviews: id },
    });
    await Review.findByIdAndDelete(id);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    next(new ExpressError(400, "Review was not found"));
  }
});

module.exports = router;
