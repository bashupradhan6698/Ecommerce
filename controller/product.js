const Product = require("../model/Product")
const Joi = require("joi")
const path = require("path")

const get = async (req, res, next) => {
  try {
    let products = await Product.find()
    res.send(products)
  } catch (err) {
    next(err)
  }
}

const productCreateschema = Joi.object({
  name: Joi.string().required(),
  price: Joi.required()
})

const create = async (req, res, next) => {

  // console.log(__dirname);
  // console.log(path.join(path.resolve(), "uploads"));

  try {
    let { error } = productCreateschema.validate(req.body,
      {
        abortEarly: false,
        stripUnknown: false,
        allowUnknown: true
      })

    if (error?.details) {
      res.status(400).send({
        errors: error?.details
      })
      return;
    }



    let images = [];
    req.files.images.forEach(img => {
      let img_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + img.name
      let img_res = img.mv(path.join(__dirname, "../uploads/" + img_name))
      // console.log(img_res);
      images.push(img_name)
      console.log(img);
    })


    let product = await Product.create({ ...req.body, created_by: req.user._id, images })
    res.send(product)
  } catch (err) {
    next(err)
  }
}

const fetchSingleProduct = async (req, res, next) => {
  try {

    let product = await Product.findById(req.params.slug)
    console.log(product);
    if (product) {
      res.send(product)
    }
    else {
      res.status(404).send({
        msg: "resource not found"
      })
    }
  }
  catch (err) {
    next(err)
  }
}

module.exports = {
  get,
  create,
  fetchSingleProduct
}