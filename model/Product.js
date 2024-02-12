const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
  name: {
    required: true,
    type: String,
    minlength: 3,
    maxlegth: 255
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },

  images: {
    type: [String],

  },

  description: {
    type: String
  },
  categories: [String],
  created_by: {
    required: true,
    type: ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model('Product', ProductSchema);