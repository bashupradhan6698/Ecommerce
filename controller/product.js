const Product = require("../model/Product")
const Joi = require("joi")
const path = require("path")

const get = async (req, res, next) => {
  try {
    let search_term = req.query.search_term || ""
    let price_from = parseFloat(req.query.price_from) || 0
    let price_to = parseFloat(req.query.price_to) || 999999999999
    let per_page = parseInt(req.query.per_page) || 2
    let page = parseInt(req.query.page) || 1
    // console.log(price_from);
    // return

    // let products = await Product.find({
    //   $or: [
    //     { name: RegExp(search_term, "i") },
    //     { categories: RegExp(search_term, "i") }
    //   ],
    //   $and: [
    //     { price: { $gte: price_from } },
    //     { price: { $lte: price_to } }
    //   ]
    // }, {})

    /* find method --> aggregation
    aggregation pipeline
    aggregation framework 
    aggregation--> advancved find method*/
    let products = await Product.aggregate(
      [
        {
          $match: {
            $or: [
              { name: RegExp(search_term, "i") },
              { categories: RegExp(search_term, "i") }
            ]
          }
        },
        {
          $match: {
            $and: [
              { price: { $gte: price_from } },
              { price: { $lte: price_to } },
            ]
          }
        },
        {
          $addFields: { avg_Rating: { $avg: "$reviews.rating" } }
        },
        {
          $lookup: {
            from: "users",
            localField: "created_by",
            foreignField: "_id",
            as: "created_by"
          }
        },
        {
          $unwind: "$created_by"
        },
        {
          $project: {
            "reviews": 0,
            "created_by.password": 0,
            "created_by.role": 0,
            "created_by.updatedAt": 0,
            "created_by.createdAt": 0,
          }
        },
        {
          $skip: ((page - 1) * per_page)
        },
        {
          $limit: per_page
        }
      ]
    )

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

    let product = await Product.findById(req.params.slug).populate("created_by", "name email")
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
  // console.log(req.params.slug);

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