let errors = {
  "name": {
    "name": "ValidatorError",
    "message": "Path `name` is required.",
    "properties": {
      "message": "Path `name` is required.",
      "type": "required",
      "path": "name",
      "value": ""
    },
    "kind": "required",
    "path": "name",
    "value": ""
  },
  "email": {
    "name": "ValidatorError",
    "message": "Already used",
    "properties": {
      "message": "Already used",
      "type": "user defined",
      "path": "email",
      "value": "buddys@email.com"
    },
    "kind": "user defined",
    "path": "email",
    "value": "buddys@email.com"
  }
}

// console.log(Object.entries(errors)); //coverts object to array

// let converted = Object.entries(errors).map(error => {
//   return {
//     params: error[0],
//     msg: error[1].message
//   }
// })

console.log(converted);



db.products.updateMany({}, {
  $set: { stock: 10 }
})