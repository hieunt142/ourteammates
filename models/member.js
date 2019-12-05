const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const memberSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: "{PATH} is required"
  },
  lastName: {
    type: String,
    required: "{PATH} is required"
  },
  email: {
    type: String,
    required: "{PATH} is required"
  },
  password: {
    type: String,
    required: "{PATH} is required"
  },
  is_sys_admin: {
    type: Boolean,
    default: false
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  role_in_scope: [
    {
      scope_type: {
        type: String
      },
      scope_id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "scope_type"
      },
      role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: "{PATH} is required"
      }
    }
  ],
  dob: {
    // Date of birth
    type: Date
  },
  position: {
    // Current position in team . Ex : Android developer, IOS developer,...
    type: String
  },
  level: {
    // Current level in team . Ex : Internship, Fresher, Junior or Senior ...
    type: String
  },
  doj: {
    // Date of joining company
    type: Date
  },
  avatar: {
    type: String
  },
  images: [{ type: String }],
  address: {
    address1: {
      type: String
    },
    address2: {
      type: String
    },
    city: {
      type: String
    }
  },
  phone: {
    type: String
  }
});

memberSchema.pre("save", function(next) {
  if (this.password && this.isModified("password")) {
    this.password = this.generateHash(this.password);
  }

  next();
});

memberSchema.methods.generateHash = password => {
  let hashPwd = bcrypt.hashSync(password, salt);

  return hashPwd;
};

memberSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("Member", memberSchema);
