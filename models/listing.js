const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const Review = require("./review.js");

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
    type: "String",
    default:
      "https://plus.unsplash.com/premium_photo-1673643405538-de0f82933fcb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://plus.unsplash.com/premium_photo-1673643405538-de0f82933fcb?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
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
