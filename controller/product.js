const Product = require("../model/Product")
const Joi = require("joi")

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

    let product = await Product.create({ ...req.body, created_by: req.user._id })
    res.send(product)
  } catch (err) {
    next(err)
  }
}

const fetchSingleProduct = async (req, res) => {
  console.log(req.params)
  console.log(req.query);
  let product = await Product.findById(req.params.id)
  res.send(product)

}

module.exports = {
  get,
  create,
  fetchSingleProduct
}