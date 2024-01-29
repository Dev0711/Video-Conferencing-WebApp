const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

router.post("/signup", (req, res) => {
  const {
    username,
    email,
    password,
  } = req.body;

  // Perform validation (similar to the frontend validation)
  if (!username || !email || !password) {
    return res
      .status(422)
      .json({ error: "Please fill in all the required fields." });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists." });
      }

      bcrypt
        .hash(password, 12)
        .then((hashedpassword) => {

          const user = new User({
            email,
            password: hashedpassword,
            username,
          });

          user
            .save()
            .then((user) => {
              res.json({
                message:
                  "Account created successfully...",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error:
                  "An error occurred during user registration. Please try again later.",
              });
            });

        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error:
              "An error occurred during password hashing. Please try again later.",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "An error occurred during user lookup. Please try again later.",
      });
    });
});


router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: "Please provide both email and password" });
  }

  // Find the user based on the email provided
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email or password" });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, savedUser.password).then((doMatch) => {
        if (doMatch) {
          // Password is correct, generate a JWT token for successful signin
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, username, email } = savedUser;

          res.json({
            token,
            user: { _id, username, email },
            message: "Successful SignIn!",
          });
        } else {
          return res.status(422).json({ error: "Invalid email or password" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;