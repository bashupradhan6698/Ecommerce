const express = require("express")
const { checkAuthentication, isSeller, isBuyer } = require("../middlewares/auth")

const { get, create, fetchSingleProduct, updateReview, updateProduct } = require("../controller/product");

const router = express.Router();


router.get("", get) // GET /api/products
router.get("/:slug", fetchSingleProduct) //GET /api/products/product-id
router.post("", checkAuthentication, isSeller, create) //POST /api/products
router.put("/:slug", checkAuthentication, isSeller, updateProduct)// put /api/products/
router.put("/:slug/reviews", checkAuthentication, isBuyer, updateReview) //put /api/products/:slug/reviews

module.exports = router
