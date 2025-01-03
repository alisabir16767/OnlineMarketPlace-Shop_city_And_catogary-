const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const { asyncWrap, ExpressError } = require("../middleware/errorMiddleware");

// Get all user's cart
exports.getAllCart = asyncWrap(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new ExpressError(404, "User Not Found"));

  const cart = await Cart.findOne({ user_id: req.params.userId }).populate(
    "products.product_id"
  );
  if (!cart) {
    return next(new ExpressError(404, "Cart Not Found"));
  }

  res.status(200).json(cart);
});

// Add product to the user's cart
exports.addToCart = asyncWrap(async (req, res, next) => {
  const { product_id, quantity } = req.body;
  console.log(req.body);
  console.log(product_id);

  const product = await Product.findById(product_id);
  if (!product) return next(new ExpressError(404, "Product Not Found"));

  let cart = await Cart.findOne({ user_id: req.params.userId });

  if (!cart) {
    cart = new Cart({
      user_id: req.params.userId,
      products: [{ product_id, quantity, price: product.price }],
    });
  } else {
    const productIndex = cart.products.findIndex(
      (p) => p.product_id.toString() === product_id
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product_id, quantity, price: product.price });
    }
  }

  cart.last_updated = Date.now();
  await cart.save();
  res.status(200).json(cart);
});

// Update the cart
exports.updateCart = asyncWrap(async (req, res, next) => {
  const { product_id, quantity } = req.body;
  const cart = await Cart.findOne({ user_id: req.params.userId });
  if (!cart) return next(new ExpressError(404, "Cart Not Found"));

  const productIndex = cart.products.findIndex(
    (p) => p.product_id.toString() === product_id
  );

  if (productIndex > -1) {
    cart.products[productIndex].quantity = quantity;
    cart.last_updated = Date.now();
    await cart.save();
    res.status(200).json(cart);
  } else {
    return next(new ExpressError(404, "Product not found in cart"));
  }
});

// Remove a product from the user cart
exports.deleteCart = asyncWrap(async (req, res, next) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user_id: req.params.userId });
  if (!cart) return next(new ExpressError(404, "Cart not found"));

  cart.products = cart.products.filter(
    (p) => p.product_id.toString() !== productId
  );
  cart.last_updated = Date.now();
  await cart.save();
  res.status(200).json(cart);
});
