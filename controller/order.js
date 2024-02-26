
const Order = require("../model/Order")
const joi = require("joi")

const fetchOrders = (req, res) => {
  /* link order model and fetch from Order Model */
  res.send("fetch all orders")
}

const fetchSingleOrder = (req, res) => {
  /* link order model and fetch from Order Model */
  res.send("fetch single orders")
}

const createOrder = async (req, res, next) => {
  try {

    /* 
      products = [
        {
          name: "product-1"
          price: ,
          quantity: 2
        }
      ]
    
    */

    let order = await Order.create({ ...req.body, created_by: req.user._id })
    res.send(order)
  } catch (err) {
    next(err)
  }
}


module.exports = {
  fetchOrders,
  fetchSingleOrder,
  createOrder
}