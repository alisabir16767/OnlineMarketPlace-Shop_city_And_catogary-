const Order = require("../models/Order");
const Shop = require("../models/Shop");
const { ExpressError, asyncWrap } = require("../middleware/errorMiddleware");

// Create a new order
exports.createOrder = asyncWrap(async (req, res, next) => {
  const { shop_id } = req.body;

  // Check if the shop exists
  const shop = await Shop.findById(shop_id);
  if (!shop) {
    return next(new ExpressError(404, "Shop not found"));
  }

  // Create a new order
  const newOrder = new Order(req.body);
  await newOrder.save();

  // Add the order ID to the shop's orders array
  shop.orders.push(newOrder._id);
  await shop.save(); // Save the updated shop document

  res.status(201).json({ message: "New order created", order: newOrder });
});

// Get all orders
exports.getAllOrder = asyncWrap(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json(orders);
});

// Get order by ID
exports.getById = asyncWrap(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new ExpressError(404, "Order Not found"));
  }
  res.status(200).json(order);
});

// Update an existing order
exports.updateOrder = asyncWrap(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new ExpressError(404, "order Not found"));
  }
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key) && key !== "_id") {
      order[key] = req.body[key];
    }
  }
  await order.save();
  res.status(200).json({ message: "Order updated successfully", order });
});

// Delete an order
exports.deleteOrder = asyncWrap(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new ExpressError(404, "order Not found"));
  }
  await order.deleteOne();
  res.status(200).json({ message: "Order deleted successfully" });
});
