const fetchOrders = (req, res) => {
  /* link order model and fetch from Order Model */
  res.send("fetch all orders")
}

const fetchSingleOrder = (req, res) => {
  /* link order model and fetch from Order Model */
  res.send("fetch single orders")
}

const createOrder = (req, res) => {
  res.send("create orders")
}


module.exports = {
  fetchOrders,
  fetchSingleOrder,
  createOrder
}