const router = require('express').Router();
const User = require("../models/user");

const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  const { username, email, password } = req.body;

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
                message: "Account created successfully...",
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

module.exports = router;