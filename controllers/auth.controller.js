const User = require(`../models/User.js`);
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const bcrypt = require("bcryptjs");
const authController = {};
authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // get data from request

  const { email, password } = req.body;

  // validation
  const user = await User.findOne({ email }, +"password");
  if (!user) throw new AppError(400, "Invalid credentials", "Login Error");
  // process
  const isMatch = await bcrypt.compare(password, user.password);
  // response
  if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");
  const accessToken = await user.generateToken();
  sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
});
module.exports = authController;
