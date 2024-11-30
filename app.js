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

// ==== LOCAL MODULES ====
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");

// ==== MIDDLEWARES ====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// ==== LISTING ROUTES ====
app.get("/", (req, res) => {
  res.send("This is root");
});

// INDEX ROUTE
app.get("/listings", (req, res, next) => {
  Listing.find()
    .then((data) => {
      res.render("listings/index.ejs", { data });
    })
    .catch((err) => {
      next(new ExpressError(404, "Not Found"));
    });
});

//CREATE ROUTE
app.get("/listings/new", (req, res, next) => {
  res.render("listings/create.ejs");
});

app.post("/listings", (req, res, next) => {
  const { listing } = req.body;
  Listing.insertMany([listing])
    .then((data) => {
      res.redirect("/listings");
    })
    .catch((err) => {
      next(new ExpressError(400, "Some error occured, input valid data"));
    });
});

//READ ROUTE
app.get("/listings/:id", async (req, res, next) => {
  // Listing.findById(id)
  //   .then((data) => {
  //     res.render("listings/show.ejs", { data });
  //   })
  //   .catch((err) => {
  //     next(new ExpressError(404, "Not Found"));
  //   });
  try {
    const { id } = req.params;
    const data = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { data });
  } catch (err) {
    next(new ExpressError(404, "Not Found"));
  }
});

//UPDATE ROUTE
app.get("/listings/:id/edit", (req, res, next) => {
  const { id } = req.params;
  Listing.findById(id)
    .then((data) => {
      res.render("listings/edit.ejs", { data });
    })
    .catch((err) => {
      next(new ExpressError(404, "Not Found"));
    });
});

app.patch("/listings/:id", (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;
  Listing.findByIdAndUpdate(id, data)
    .then((data) => {
      res.redirect(`/listings/${id}`);
    })
    .catch((err) => {
      next(new ExpressError(400, "Some error occured, input valid data"));
    });
});

//DELETE ROUTE
app.delete("/listings/:id", (req, res, next) => {
  const { id } = req.params;
  Listing.findByIdAndDelete(id)
    .then((data) => {
      res.redirect("/listings");
    })
    .catch((err) => {
      next(new ExpressError(404, "Not Found"));
    });
});

// ==== LISTING-REVIEWS ROUTES ====

//REVIEWS - CREATE ROUTE
app.post("/listings/:id/reviews", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { review } = req.body;
    let listing = await Listing.findById(id);
    review.createdAt = Date.now();
    let newReview = new Review(review);
    await listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(new ExpressError(400, "Please enter valid data"));
  }
});

//REVIEWS - DELETE ROUTE

app.delete("/listings/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { listingId } = req.body;
    await Listing.findByIdAndUpdate(listingId, {
      $pull: { reviews: id },
    });
    await Review.findByIdAndDelete(id);
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    next(new ExpressError(400, "Review was not found"));
  }
});

// === ERROR HANDLING MIDDLEWARE ===
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { status = 400, message = "Bad request" } = err;
  res.status(status).render("listings/error.ejs", { status, message });
});
