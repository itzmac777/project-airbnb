const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const Review = require("./review.js");
const User = require("../models/user.js");

// ==== SCHEMAS ====
const listingSchema = new Schema({
  title: {
    type: "String",
    required: true,
  },
  description: {
    type: "String",
    required: true,
  },
  image: {
    url: { type: String },
    filename: { type: String },
  },
  price: {
    type: "Number",
    required: true,
  },
  location: {
    type: "String",
    required: true,
  },
  country: {
    type: "String",
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (data) => {
  try {
    if (data.reviews.length) {
      await Review.deleteMany({ _id: { $in: data.reviews } });
    }
  } catch (err) {
    console.log(err);
  }
});

const Listing = model("Listing", listingSchema);
module.exports = Listing;
