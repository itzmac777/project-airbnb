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
router.get("/signup", userControllers.renderSignup);

router.post("/signup", userControllers.signup);

// ==== LOGIN ROUTES ====
router.get("/login", userControllers.renderLogin);

router.post("/login", saveRedirectUrl, userControllers.login);

// ==== LOGOUT ROUTES ====
router.get("/", userControllers.renderLogout);

router.get("/logout", userControllers.logout);

module.exports = router;
