const { number } = require('joi');
const mongoose = require('mongoose');
const User = require('./User');


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
  stock: {
    type: Number,
    min: 0,
    default: 0
  },
  description: {
    type: String
  },
  categories: [String],
  created_by: {
    required: true,
    type: ObjectId,
    ref: "User"
  },
  reviews: [
    {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      created_by: {
        type: ObjectId,
        ref: "User",
        required: true
      },
      comment: {
        type: String,
        maxlegth: 255
      }
    }
  ],

});

module.exports = mongoose.model('Product', ProductSchema);