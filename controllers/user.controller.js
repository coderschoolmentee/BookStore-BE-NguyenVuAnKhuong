const User = require(`../models/User.js`);
const Cart = require(`../models/Cart.js`);
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const bcrypt = require("bcryptjs");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  // get data from request

  let { name, email, password } = req.body;

  // validation

  let user = await User.findOne({ email });

  if (user)
    throw new AppError(400, "User allready exists", "Registration Error");

  // process

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  //Create user
  user = await User.create({ name, email, password });
  //Create cart
  const cart = await Cart.create({ userId: user._id, books: [] });
  const accessToken = await user.generateToken();
  // response

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);

  if (!user)
    throw new AppError(400, "User not found", "Get Current user error");

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Current User successfully"
  );
});

userController.getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found", "Profile Error");
  }

  sendResponse(res, 200, true, user, null, "Get User profile successfully");
});

userController.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const {
    name,
    email,
    password,
    sex,
    birthday,
    address,
    city,
    state,
    zipcode,
  } = req.body;

  // Fetch user from the database
  const user = await User.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found", "Profile Update Error");
  }

  // Update user profile fields

  user.name = name || user.name;
  user.email = email || user.email;
  user.sex = sex || user.sex;
  user.birthday = birthday || user.birthday;
  user.address = address || user.address;
  user.city = city || user.city;
  user.state = state || user.state;
  user.zipcode = zipcode || user.zipcode;

  // Update password if provided
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  // Save the updated user profile
  user = await user.save();

  sendResponse(res, 200, true, user, null, "User profile updated successfully");
});

userController.getAllUsers = catchAsync(async (req, res, next) => {
  // Fetch all users from the database
  const users = await User.find({ isDeleted: false });

  sendResponse(res, 200, true, users, null, "Users retrieved successfully");
});

userController.deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  // Find the user by ID
  const user = await User.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found", "Delete User Error");
  }

  // Mark the user as deleted
  user.isDeleted = true;
  await user.save();

  sendResponse(res, 200, true, null, null, "User deleted successfully");
});

module.exports = userController;
