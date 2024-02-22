const express = require("express");
const router = express.Router();
const User = require("../models/user");

const jwt = require("jsonwebtoken");

router.get("/refresh", (req, res) => {
  const cookies = req.cookies;

  // console.log(cookies);

  if (!cookies?.jwt) return res.sendStatus(401);

  // console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  User.findOne({ refreshToken: refreshToken })
    .then((savedUser) => {
      if (!savedUser) {
        return res.sendStatus(422);
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || savedUser._id.toString() !== decoded._id) return res.sendStatus(403); // Invalid Token
          const accessToken = jwt.sign(
            { _id: decoded._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
          );
          const { _id, username, email } = savedUser;
          // res.json({ accessToken });
          res.json({
            accessToken,
            user: { _id, username, email }
          });
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(403);
    });
});

module.exports = router;
