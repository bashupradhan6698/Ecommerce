
const Order = require("../model/Order")
const joi = require("joi")
const Product = require("../model/Product")

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
    {
    "products":[
        {
            "product_id" : "658eff2b7c59390f8d73fa8d",
            "quantity" : 2
        },
        {
            "product_id" : "658eff2b7c59390f8d73fa8d",
            "quantity" : 2
        },
        {
            "product_id" : "658eff2b7c59390f8d73fa8d",
            "quantity" : 2
        }
    ]
}

      products = [
        {
          name: "product-1"
          price: ,
          quantity: 2
        },
          name: "product-2"
          price: ,
          quantity: 2
        },
          name: "product-3"
          price: ,
          quantity: 2
        }
      ]
    
    */

    // let req_products = req.body.products
    // let mapped_products = req.body.products.map(async (product) => {
    //   let db_product = await Product.findById(product.product_id)
    //   // console.log(db_product);
    //   return {
    //     name: db_product.name,
    //     price: db_product.price
    //   }
    // })

    let mapped_products = [];
    for (product of req.body.products) {
      let db_product = await Product.findById(product.product_id)
      mapped_products.push({
        product_id: db_product._id,
        name: db_product.name,
        price: db_product.price,
        quantity: product.quantity
      })
    }
    // console.log(mapped_products);
    // return;
    let order = await Order.create({ products: mapped_products, created_by: req.user._id })
    // console.log(order);
    for (product of order.products) {
      await Product.findByIdAndUpdate(product.product_id, {
        $inc: { stock: -(product.quantity) }
      })
    }
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