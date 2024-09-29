const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const { asyncWrap, ExpressError } = require("../middleware/errorMiddleware");

// get all user's cart
exports.getAllCart = asyncWrap(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new ExpressError(404, "User Not Found"));
  const cart = await Cart.findOne(user).populate("products.product._id");
  if (!cart) {
    return next(new ExpressError(404, "Cart Not Found"));
  }
  res.status(200).json(cart);
});

//Add product to the user's cart
exports.addToCart = asyncWrap(async (req, res) => {
  const user = await Cart.findOne({ user_id: req.params.userId });
  if (!user) return next(new ExpressError(404, "user not found"));
});
//  Update the qauntity of a product in the user's cart
exports.updateCart = asyncWrap(async (req, res) => {});
// Remove a product from the user cart.

exports.deleteCart = asyncWrap(async (req, res) => {});
