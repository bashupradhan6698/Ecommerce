const express = require("express");


const product_routes = require("./routes/product")
const auth_routes = require("./routes/auth")
const order_routes = require("./routes/order")
const todo_routes = require("./routes/todo")
const { handleResourceNotFound, handleServerError } = require("./middlewares/error");
const fileUpload = require("express-fileupload")
require("./config/database")
require('dotenv').config()

const app = express();
app.use(express.json()) //global middleware //runs for every api routes
app.use(fileUpload()); //when data is sent as form data instead of raw from postman --> sets up req.body for images
app.use(express.static('uploads')) //to load static images from localhost url

app.use("/api", auth_routes)
app.use("/api/products", product_routes)
app.use("/api/orders", order_routes)


app.use("/api/todos", todo_routes)

/* error */
app.use(handleResourceNotFound)
app.use(handleServerError);



app.listen(8000, () => {
  console.log("server started");
});


