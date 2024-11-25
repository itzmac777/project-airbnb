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
app.get("/listings", (req, res) => {
  Listing.find()
    .then((data) => {
      res.render("listings/index.ejs", { data });
    })
    .catch((err) => {
      res.send(err);
    });
});

//CREATE ROUTE
app.get("/listings/new", (req, res) => {
  res.render("listings/create.ejs");
});

app.post("/listings", (req, res) => {
  const { listing } = req.body;
  if (listing) {
    Listing.insertMany([listing])
      .then((data) => {
        res.redirect("/listings");
      })
      .catch((err) => {
        console.log("Some error occured, input valid data");
      });
  }
});

//READ ROUTE
app.get("/listings/:id", (req, res) => {
  const { id } = req.params;
  Listing.findById(id)
    .then((data) => {
      res.render("listings/show.ejs", { data });
    })
    .catch((err) => {
      console.log("Data not found");
    });
});

//UPDATE ROUTE
app.get("/listings/:id/edit", (req, res) => {
  const { id } = req.params;
  Listing.findById(id)
    .then((data) => {
      res.render("listings/edit.ejs", { data });
    })
    .catch((err) => {
      console.log("Data not found");
    });
});

app.patch("/listings/:id", (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  if (data) {
    Listing.findByIdAndUpdate(id, data)
      .then((data) => {
        res.redirect(`/listings/${id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//DELETE ROUTE
app.delete("/listings/:id", (req, res) => {
  const { id } = req.params;
  Listing.findByIdAndDelete(id)
    .then((data) => {
      res.redirect("/listings");
    })
    .catch((err) => {
      console.log(err);
    });
});
