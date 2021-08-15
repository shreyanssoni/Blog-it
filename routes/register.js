const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const LoginInfo = require("./../models/database");
const { forwardAuthenticated } = require("../auth");
const { render } = require("ejs");

router.get("/", forwardAuthenticated, (req, res) => {
  res.render("register", {
    user: "null",
    message: "null",
  });
});

router.post("/", async (req, res) => {
  const newUser = {
    name: req.body.name,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password
  };
  let check = await LoginInfo.findOne({ email: newUser.email });
  const logindb = new LoginInfo({
    name: req.body.name,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password
  });
  try {
    if (check != null) {
      res.render("register", {
        user: newUser,
        message: "User already exists",
      });
    } else {
      await logindb.save();
      // console.log(logindb);
      res.redirect('/login')
    }
    // console.log("Your account has been made!")
  } catch (e) {
    console.log("there was an error!" + e);
  }
});

module.exports = router;
