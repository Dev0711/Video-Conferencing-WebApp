const router = require('express').Router();
const User = require("../models/user");

router.get("/logout", (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(206);

  console.log(cookies.jwt);

  const refreshToken = cookies.jwt;

  User.findOne({ refreshToken: refreshToken })
    .then(async (savedUser) => {
      if (!savedUser) {
        res.clearCookie("jwt", { httpOnly: true, maxAge: 5 * 60 * 60 * 1000 });
        return res.sendStatus(204);
      }

      //Delete the refresh Token
      savedUser.refreshToken = '';
      const result = await savedUser.save();
      console.log(result);

    })
    .catch((err) => {
      res.clearCookie("jwt", { httpOnly: true, sameSite: 'none', secure: true }); // in production option secure: true - only serves on https
      res.sendStatus(204);
      console.log(err);
    });

  res.clearCookie("jwt", { httpOnly: true, sameSite: 'none', secure: true }); // in production option secure: true - only serves on https
  res.sendStatus(204);
});

module.exports = router;
