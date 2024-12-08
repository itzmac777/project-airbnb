// ==== LOCAL MODULES ====
const { cloudinary } = require("../cloudConfig.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");

module.exports.index = (req, res, next) => {
  Listing.find()
    .then((data) => {
      res.render("listings/index.ejs", { data });
    })
    .catch((err) => {
      next(new ExpressError(404, "Not Found"));
    });
};

module.exports.renderCreate = (req, res, next) => {
  res.render("listings/create.ejs");
};

module.exports.create = async (req, res, next) => {
  try {
    const { listing } = req.body;
    listing.createdBy = req.user;
    listing.image = {
      url: await req.file.path,
      filename: await req.file.filename,
    };
    await Listing.insertMany([listing]);
    req.flash("success", "Listing created successfully");
    res.redirect("/listings");
  } catch (err) {
    console.log(err);
    next(new ExpressError(400, "Some error occured, input valid data"));
  }
};

module.exports.read = async (req, res, next) => {
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
};

module.exports.renderUpdate = async (req, res, next) => {
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
};

module.exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    let listingCheck = await Listing.findById(id);
    const currUser = req.user["_id"];
    if (
      listingCheck.createdBy["_id"].equals(currUser) ||
      req.user.username == "admin"
    ) {
      const { data } = req.body;
      const newImage = req.file;
      const existingImage = req.body.filename;
      let listing = await Listing.findByIdAndUpdate(id, data);
      if (req.file) {
        listing.image = {
          url: await newImage.path,
          filename: await newImage.filename,
        };
        await listing.save();
        await cloudinary.uploader.upload(newImage.path, {
          public_id: existingImage,
          overwrite: true,
        });
      }
      req.flash("success", "Updated successfully");
      res.redirect(`/listings/${id}`);
    } else {
      req.flash("failure", "You cannot edit this listing");
      return res.redirect(`/listings/${id}`);
    }
  } catch (err) {
    next(new ExpressError(400, "Some error occured, input valid data"));
  }
  // const { id } = req.params;
  // const { data } = req.body;
  // const listing = await Listing.findById(id);
  // const currUser = req.user["_id"];
  // if (
  //   listing.createdBy["_id"].equals(currUser) ||
  //   req.user.username == "admin"
  // ) {
  //   Listing.findByIdAndUpdate(id, data)
  //     .then((data) => {
  //       req.flash("success", "Updated successfully");
  //       res.redirect(`/listings/${id}`);
  //     })
  //     .catch((err) => {
  //       next(new ExpressError(400, "Some error occured, input valid data"));
  //     });
  // } else {
  //   req.flash("failure", "You cannot edit this listing");
  //   return res.redirect(`/listings/${id}`);
  // }
};

module.exports.delete = async (req, res, next) => {
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
};
