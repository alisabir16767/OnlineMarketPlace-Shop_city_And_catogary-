const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrder);
router.get("/:orderId", orderController.getById);
router.put("/:orderId", orderController.updateOrder);
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
