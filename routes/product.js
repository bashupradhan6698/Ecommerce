const express = require("express")
const { checkAuthentication, isSeller } = require("../middlewares/auth")

const { get, create, fetchSingleProduct } = require("../controller/product");

const router = express.Router();


router.get("", get) // GET /api/products
router.get("/:slug", fetchSingleProduct) //GET /api/products/product-id

router.post("", checkAuthentication, isSeller, create) //POST /api/products


module.exports = router
