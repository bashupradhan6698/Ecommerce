
const handleResourceNotFound = (req, res) => {
  res.status(404).send({
    msg: "resource not found"
  })
}

const handleServerError = ((err, req, res, next) => {
  let statuscode = 500;
  let message = "Server error";
  let errors = [];

  if (err.name == "ValidationError") {
    statuscode = 400;
    message: "Bad request"
    errors = Object.entries(err.errors).map(error => {
      return {
        params: error[0],
        msg: error[1].message
      }
    })
  }
  res.status(statuscode).send({
    msg: message + " " + err.message,
    errors
  })
})

module.exports = {
  handleResourceNotFound,
  handleServerError
}