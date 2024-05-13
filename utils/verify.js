const jwt = require("jsonwebtoken");
const createError = require("./error");

// verify token
const verifyToken = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SK);

      req.user = { id: decoded.id };
      next();
    } catch (error) {
      next(createError(403, "Invalid Token"));
      console.log("invalid token");
    }
  } else {
    return next(createError(401, "You are not authenticated"));
  }
};

// verify token and admin
const verifyAdmin = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SK);

      req.user = { id: decoded.id, isAdmin: decoded.isAdmin };

      if (!req.user.isAdmin) return next(createError(401, "You are not admin"));

      next();
    } catch (error) {
      next(createError(403, "Invalid Token"));
      console.log("invalid token");
    }
  } else {
    return next(createError(401, "You are not authenticated"));
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
