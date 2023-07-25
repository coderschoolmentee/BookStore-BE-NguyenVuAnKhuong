const User = require(`../models/User.js`);
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }, +"password");
  if (!user) throw new AppError(400, "Invalid credentials", "Login Error");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");
  const accessToken = await user.generateToken();
  sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
});

module.exports = authController;
