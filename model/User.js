const { default: mongoose } = require("mongoose");
const { BUYER, SELLER } = require("../constants/role");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: async function (req_value_email) {

        let count = await mongoose.models.User.countDocuments({ email: req_value_email })
        if (count) {
          return false;
        }
        return true;
      }, message: "Already used"
    }

  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: [BUYER, SELLER],
    required: true,
    set: function (value) {
      return value.toLowerCase();
    }
  },
  user: {
    type: ObjectId
  }
},

  {
    timestamps: true,
  })

module.exports = mongoose.model("User", UserSchema)