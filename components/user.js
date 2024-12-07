// ==== LOCAL MODULES ====
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.renderSignup = (req, res, next) => {
  if (req.user) {
    res.locals.userData = req.user;
    return res.redirect("/auth/user");
  }
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const email = req.body.user.email;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.flash("failure", "Email is already in use");
      res.redirect("/auth/user/signup");
    } else {
      let newUser = new User({
        username: req.body.user.username,
        email: req.body.user.email,
      });
      let createdUser = await User.register(newUser, req.body.user.password);
      req.logIn(createdUser, (err) => {
        if (err) {
          req.flash(
            "failure",
            "Signed Up. Some error happened while logging in"
          );
        }
        req.flash("success", "Signed up. Welcome to AirBnb");
        return res.redirect("/listings");
      });
    }
  } catch (err) {
    console.log(err);
    req.flash("failure", "Username already exists");
    res.redirect("/auth/user/signup");
  }
};

module.exports.renderLogin = (req, res, next) => {
  if (req.user) {
    res.locals.userData = req.user;
    return res.redirect("/auth/user");
  }
  res.render("users/login.ejs");
};

module.exports.login = async (req, res, next) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (!existingUser) {
    req.flash("failure", "Credential not found");
    return res.redirect("/auth/user/login");
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("failure", "Some error occured");
      return res.redirect("/auth/user/login");
    }
    if (!user) {
      req.flash("failure", "Credential doesn't match");
      return res.redirect("/auth/user/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        req.flash("failure", "Some error happened while logging in. Try again");
      }
      req.flash("success", "Login successful");
      if (res.locals.redirectUrl) {
        return res.redirect(res.locals.redirectUrl);
      } else {
        return res.redirect("/listings");
      }
    });
  })(req, res, next);
};

module.exports.renderLogout = (req, res, next) => {
  if (req.user) {
    res.locals.userData = req.user;
    res.render("users/logout.ejs");
  } else {
    req.flash("failure", "You are not logged in");
    return res.redirect("/auth/user/login");
  }
};

module.exports.logout = (req, res, next) => {
  if (req.user) {
    req.logOut((err) => {
      if (err) {
        req.flash("failure", "Some error occured");
        return res.redirect("/");
      }
      req.flash("success", "Logged out successfully");
      res.redirect("/listings");
    });
  } else {
    req.flash("failure", "You are not logged in");
    return res.redirect("/auth/user/login");
  }
};
