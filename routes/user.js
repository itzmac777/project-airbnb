const express = require("express");
const router = express.Router();

// ==== LOCAL MODULES ====
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// ==== COMPONENTS ====
const userControllers = require("../components/user.js");

// ==== SIGN UP ROUTES ====
router
  .route("/signup")
  .get(userControllers.renderSignup)
  .post(userControllers.signup);

// ==== LOGIN ROUTES ====
router
  .route("/login")
  .get(userControllers.renderLogin)
  .post(saveRedirectUrl, userControllers.login);

// ==== LOGOUT ROUTES ====
router.get("/", userControllers.renderLogout);
router.get("/logout", userControllers.logout);

module.exports = router;
