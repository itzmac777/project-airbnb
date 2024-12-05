const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const User = require("./user.js");

const reviewSchema = new Schema({
  comment: { type: String, required: true },
  rating: {
    type: String,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
  createdBy: {
    type: Object,
    required: true,
  },
});

const Review = model("Review", reviewSchema);

module.exports = Review;
