const User = require("../models/User");
const { ExpressError, asyncWrap } = require("../middleware/errorMiddleware");

// create a user
exports.createUsers = asyncWrap(async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.status(201).json({ message: "User created successfully", user: newUser });
});
// Get all users
exports.getAllUsers = asyncWrap(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// Retrieve a specific user by userId
exports.getUserById = asyncWrap(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new ExpressError(404, "User Not Found"));
  }
  res.status(200).json(user);
});
// update an existing user by id
exports.updateUser = asyncWrap(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new ExpressError(404, "User Not Found"));
  }

  for (const key in req.body) {
    if (req.body.hasOwnProperty(key) && key !== "_id") {
      user[key] = req.body[key];
    }
  }
  await user.save();

  res.status(200).json({ message: "Updated successfully", user });
});

// Delete the existing user by id
exports.deleteUser = asyncWrap(async (req, res) => {
  const userId = req.params.userId;
  const result = await User.deleteOne({ _id: userId });
  if (result.deletedCount === 0) {
    return next(new ExpressError(404, "User Not Found"));
  }
  res.status(200).json({ message: "User deleted successfully" });
});
