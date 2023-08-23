const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decode = jwt.verify(token, process.env.SECRET);
      if (decode) {
        req.body.userID = decode.id;
        req.body.user = decode.name;
        req.body.organizationName = decode.organizationName;
        next();
      } else {
        res.status(403).json("Not Authorized");
      }
    } catch (error) {
      if (error.expiredAt) {
        res.status(401).json({ msg: "token expired" });
      }
      res.json({ err: error });
    }
  } else {
    res.json({ msg: "please Login" });
  }
};

module.exports = auth;
