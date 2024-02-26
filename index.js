const express = require("express");
const fileUpload = require("express-fileupload")

const product_routes = require("./routes/product")
const auth_routes = require("./routes/auth")
const order_routes = require("./routes/order")
const todo_routes = require("./routes/todo")
const { handleResourceNotFound, handleServerError } = require("./middlewares/error");

require("./config/database")
require('dotenv').config()

const app = express();
app.use(express.json()) //global middleware //runs for every api routes
app.use(fileUpload()); //when data is sent as form data instead of raw from postman --> sets up req.files for images

app.use((req, res, next) => {
  function changeRequest(field) {
    let temp = {};

    if (req[field]) {

      let temp_arr = Object.entries(req[field])

      temp_arr.forEach(element => {
        if (element[0].endsWith("[]")) {
          temp[element[0].slice(0, -2)] = Array.isArray(element[1]) ? element[1] : [element[1]]
        } else {
          temp[element[0]] = element[1]
        }
      })
    }
    req[field] = temp

  }
  changeRequest("body")
  changeRequest("files")
  next();
})

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


