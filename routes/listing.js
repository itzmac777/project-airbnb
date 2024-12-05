const express = require("express");
const router = express.Router();

// ==== LOCAL MODULES ====
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");

// ==== LOCAL MIDDLEWARES ====
const { isLoggedIn } = require("../middleware.js");

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
router.get("/new", isLoggedIn, (req, res, next) => {
  res.render("listings/create.ejs");
});

router.post("/", isLoggedIn, (req, res, next) => {
  const { listing } = req.body;
  listing.createdBy = req.user;
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
    let owner = false;
    const data = await Listing.findById(req.params.id).populate("reviews");
    if (
      (req.user && data.createdBy.equals(req.user["_id"])) ||
      (req.user && req.user.username == "admin")
    ) {
      owner = true;
    }
    await res.render("listings/show.ejs", { data, owner });
  } catch (err) {
    next(new ExpressError(404, "Not Found"));
  }
});

//UPDATE ROUTE
router.get("/:id/edit", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const currUser = req.user["_id"];
  if (
    listing.createdBy["_id"].equals(currUser) ||
    req.user.username == "admin"
  ) {
    Listing.findById(id)
      .then((data) => {
        res.render("listings/edit.ejs", { data });
      })
      .catch((err) => {
        next(new ExpressError(404, "Not Found"));
      });
  } else {
    req.flash("failure", "You cannot edit this listing");
    return res.redirect(`/listings/${id}`);
  }
});

router.patch("/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;
  const listing = await Listing.findById(id);
  const currUser = req.user["_id"];
  if (
    listing.createdBy["_id"].equals(currUser) ||
    req.user.username == "admin"
  ) {
    Listing.findByIdAndUpdate(id, data)
      .then((data) => {
        req.flash("success", "Updated successfully");
        res.redirect(`/listings/${id}`);
      })
      .catch((err) => {
        next(new ExpressError(400, "Some error occured, input valid data"));
      });
  } else {
    req.flash("failure", "You cannot edit this listing");
    return res.redirect(`/listings/${id}`);
  }
});

//DELETE ROUTE
router.delete("/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const currUser = req.user["_id"];
  const listing = await Listing.findById(id);
  if (
    listing.createdBy["_id"].equals(currUser) ||
    req.user.username == "admin"
  ) {
    Listing.findByIdAndDelete(id)
      .then((data) => {
        req.flash("success", "Deleted successfully");
        res.redirect("/listings");
      })
      .catch((err) => {
        next(new ExpressError(404, "Not Found"));
      });
  } else {
    req.flash("failure", "You cannot delete this listing");
    return res.redirect(`/listings/${id}`);
  }
});

module.exports = router;
