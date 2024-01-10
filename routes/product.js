const express = require("express")
const { checkAuthentication } = require("../middlewares/auth")

const { get, create } = require("../controller/product");

const router = express.Router();


router.get("", get)

router.post("", checkAuthentication, create)


module.exports = router
