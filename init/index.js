// ==== DB CONNECTION ====
const mongoose = require("mongoose");
const Listing = require("../models/listing");
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

// ==== IMPORTING DATA ====
const data = require("./data.js");

for (listing of data) {
  listing.createdBy = "67505ea151ce9dd73ef7a646";
}

// ==== DATA INITIALIZATION ====
const initData = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(data);
};

initData()
  .then((res) => {
    console.log("Data initialized");
  })
  .catch((err) => {
    console.log(err);
  });
