const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!tokenHeader?.startsWith('Bearer ')) return res.sendStatus(401);

  const authToken = tokenHeader.split(" ")[1];

  jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //Invalid Token
    req._id = decoded._id;
    next();
  });
};

module.exports = verifyToken;
