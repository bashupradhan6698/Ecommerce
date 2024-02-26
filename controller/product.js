const Product = require("../model/Product")
const Joi = require("joi")
const path = require("path")

const get = async (req, res, next) => {
  try {
    let products = await Product.find({}, { reviews: 0 })
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
    // console.log(req.body);
    // console.log(req.files);
    /* req.files.images[] ---> req.files.images */
    // return;


    req.files.images?.forEach(img => {
      let img_name = Date.now() + '-' + Math.round(Math.random() * 1E9) + img.name
      let img_res = img.mv(path.join(__dirname, "../uploads/" + img_name))
      // console.log(img_res);
      images.push(img_name)
      // console.log(img);
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

const updateProduct = (async (req, res, next) => {
  console.log(req.params.slug);

  try {
    let product = await Product.findByIdAndUpdate(req.params.slug, {
      name: req.body.name,
      price: req.body.price
    }, { new: true, runValidators: true }) //price cannot be null -- runValidator - follow mongoose validator

    res.send(product)
  }
  catch (err) {
    next(err)
  }

})

const updateReview = (async (req, res, next) => {

  /*1. find if user has already given ratings
  
  if yes -> update old
  else ->  create new*/


  try {
    let exists = await Product.findOne({ _id: req.params.slug, "reviews.created_by": req.user._id })

    if (exists) {
      /* update old data */
      let product = await Product.findOneAndUpdate({ _id: req.params.slug, "reviews.created_by": req.user._id }, {
        "reviews.$.rating": req.body.rating,
        "reviews.$.comment": req.body.comment,
      }, { new: true }, { runValidators: true })

      /* 
            let product = Product.find(product_id)
            let old_reviews = product.reviews
            old_reviews.map(reviews=>{
              if(reviews.created_by == req.user._id){
                return{
                  rating : req.body.rating,
                  comment : req.body.comment
                }
              }
              return reviews
            })
      */


      res.send(product)
    }
    else {
      let product = await Product.findByIdAndUpdate(req.params.slug, {

        $push: {
          "reviews": {
            rating: req.body.rating,
            comment: req.body.comment,
            created_by: req.user._id
          }
        }
      }, { new: true, runValidators: true }) //price cannot be null -- runValidator - follow mongoose validator

      res.send(product)
    }
  }
  catch (err) {
    next(err)
  }
})

module.exports = {
  get,
  create,
  fetchSingleProduct,
  updateProduct,
  updateReview
}