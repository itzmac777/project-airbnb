const mongoose = require("mongoose");

// ==== SCHEMAS ====
const Scehma = mongoose.Schema;
const model = mongoose.model;
const listingSchema = new Scehma({
  title: {
    type: "String",
    required: true,
  },
  description: {
    type: "String",
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
  },
  location: {
    type: "String",
  },
  country: {
    type: "String",
  },
});

const Listing = model("Listing", listingSchema);
module.exports = Listing;
