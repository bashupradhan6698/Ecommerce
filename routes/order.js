const express = require("express")
const { fetchOrders, fetchSingleOrder, createOrder } = require("../controller/order")
const { checkAuthentication, isBuyer } = require("../middlewares/auth")

const router = express.Router()




router.get("", checkAuthentication, isBuyer, fetchOrders)

router.get("/order-id", fetchSingleOrder)

router.post("", checkAuthentication, isBuyer, createOrder)

module.exports = router 
