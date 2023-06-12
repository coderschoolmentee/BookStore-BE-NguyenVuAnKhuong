const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { AppError } = require("../helpers/utils");

const authentication = {};

authentication.loginRequire = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString)
      throw new AppError(401, "Login require", "Authentication error");
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err)
        throw new AppError(401, "Token is invalid", "Authentication error");

      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
