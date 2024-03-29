const mongoose = require("mongoose");
const { PENDING, COMPLETED, REJECTED } = require("../constants/order_status");
const Product = require("./Product")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const OrderSchema = new Schema({
  products: {
    type: [
      {
        product_id: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          min: 0,
          required: true
        },
        quantity: {
          type: Number,
          min: 0,
          required: true
        },
        status: {
          type: String,
          enum: [PENDING, COMPLETED, REJECTED],
          required: true,
          default: PENDING
        }
      }
    ],
    required: true,
    validate: {
      validator: function (value) {
        if (value.length == 0) return false
      },
      message: "at least one product needed"
    }
  },
  created_by: {
    type: ObjectId,
    ref: "User",
    required: true
  }

}, {
  timestamps: true
});

// OrderSchema.post("save", async function (order) {
//   // console.log("saved order");
//   // console.log(order);
//   for (product of order.products) {
//     await Product.findByIdAndUpdate(product.product_id, {
//       $inc: { stock: -(product.quantity) }
//     })
//   }
// })     // mongoose middle ware

module.exports = mongoose.model("Order", OrderSchema); 