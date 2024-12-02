const express = require("express");
const router = express.Router();

// ==== LOCAL MODULES ====
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");

// ==== LISTING ROUTES ====

// INDEX ROUTE
router.get("/", (req, res, next) => {
  Listing.find()
    .then((data) => {
      res.render("listings/index.ejs", { data });
    })
    .catch((err) => {
      next(new ExpressError(404, "Not Found"));
    });
});

//CREATE ROUTE
router.get("/new", (req, res, next) => {
  res.render("listings/create.ejs");
});

router.post("/", (req, res, next) => {
  const { listing } = req.body;
  Listing.insertMany([listing])
    .then((data) => {
      req.flash("success", "Listing created successfully");
      res.redirect("/listings");
    })
    .catch((err) => {
      next(new ExpressError(400, "Some error occured, input valid data"));
    });
});

//READ ROUTE
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { data });
  } catch (err) {
    next(new ExpressError(404, "Not Found"));
  }
});

//UPDATE ROUTE
router.get("/:id/edit", (req, res, next) => {
  const { id } = req.params;
  Listing.findById(id)
    .then((data) => {
      res.render("listings/edit.ejs", { data });
    })
    .catch((err) => {
      next(new ExpressError(404, "Not Found"));
    });
});

router.patch("/:id", (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;
  Listing.findByIdAndUpdate(id, data)
    .then((data) => {
      req.flash("success", "Updated successfully");
      res.redirect(`/listings/${id}`);
    })
    .catch((err) => {
      next(new ExpressError(400, "Some error occured, input valid data"));
    });
});

//DELETE ROUTE
router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  Listing.findByIdAndDelete(id)
    .then((data) => {
      req.flash("success", "Deleted successfully");
      res.redirect("/listings");
    })
    .catch((err) => {
      next(new ExpressError(404, "Not Found"));
    });
});

module.exports = router;
