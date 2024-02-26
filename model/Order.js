const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const OrderSchema = new Schema({
  products: {
    type: [
      {
        // product_id: {
        //   type: ObjectId,
        //   ref: "Product",
        //   required: true,
        // },
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
        }
      }
    ],
    required: true,
    validate: {
      validator: function (value) {
        console.log(value);
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

module.exports = mongoose.model("Order", OrderSchema); 