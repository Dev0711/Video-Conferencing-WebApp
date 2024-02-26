const router = require('express').Router();
const User = require("../models/user");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/auth", (req, res) => {
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
        console.log(1);
        return res.status(422).json({ error: "Invalid email or password" });
      }

      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, savedUser.password).then(async (doMatch) => {
        if (doMatch) {
          // Password is correct, generate a JWT token for successful signin
          const accessToken = jwt.sign({ _id: savedUser._id.toString() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
          const refreshToken = jwt.sign({ _id: savedUser._id.toString() }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
          const { _id, username, email } = savedUser;

          // saving the user with refreshToken
          savedUser.refreshToken = refreshToken;
          const result = await savedUser.save();
          // console.log(result);
          
          res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24*60*60*1000, sameSite: 'none', secure: true }) //secure: true
          res.json({
            accessToken,
            refreshToken,
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