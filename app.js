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

// ==== LOCAL MODULES ====
const Listing = require("./models/listing.js");

// ==== MIDDLEWARES ====
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));

// ==== ROUTES ====
app.get("/", (req, res) => {
  Listing.insertMany([
    {
      title: "test001",
      description: "This is a simple desc",
      price: 10,
      image: "f",
      location: "Sylhet",
      country: "Bangladesh",
    },
  ])
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  res.send("This is root");
});
