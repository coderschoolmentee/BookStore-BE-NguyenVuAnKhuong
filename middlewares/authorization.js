const jwt = require("jsonwebtoken");
const { sendResponse } = require("../helpers/utils");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = require("../models/User");

const authorize = (roles) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return sendResponse(
        res,
        401,
        false,
        null,
        "Authorization token not provided",
        "Unauthorized"
      );
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET_KEY);
      const userId = payload._id;
      const user = await User.findOne({ _id: userId, isDeleted: false });
      const userRole = user.role;

      if (!roles.includes(userRole)) {
        return sendResponse(
          res,
          403,
          false,
          null,
          "Unauthorized",
          "Authorization Error"
        );
      }

      next();
    } catch (error) {
      return sendResponse(
        res,
        401,
        false,
        null,
        "Invalid token",
        "Unauthorized"
      );
    }
  };
};

module.exports = authorize;
