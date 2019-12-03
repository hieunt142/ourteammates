const validator = require("validator");

module.exports = {
  validateNewUser: async userInfo => {
    let errors = [];
    if (validator.isEmpty(userInfo.firstName)) {
      errors.push({ field: "firstName", message: "First name is required" });
    }

    if (validator.isEmpty(userInfo.lastName)) {
      errors.push({ field: "lastName", message: "Last name is required" });
    }

    if (!validator.isEmail(userInfo.email)) {
      errors.push({ field: "email", message: "Email address is invalid" });
    }

    if (!validator.isLength(userInfo.password, { min: 6, max: 32 })) {
      errors.push({
        field: "password",
        message: "Password must be between 6 and 32 characters length"
      });
    }

    return errors;
  },
  validateUpdateUserInfo: async userInfo => {
    let errors = [];
    if (validator.isEmpty(userInfo.firstName)) {
      errors.push({ field: "firstName", message: "First name is required" });
    }

    if (validator.isEmpty(userInfo.lastName)) {
      errors.push({ field: "lastName", message: "Last name is required" });
    }

    return errors;
  },
  validateNewTeam: async teamInfo => {
    let errors = [];
    if (validator.isEmpty(teamInfo.name)) {
      errors.push({ field: "name", message: "Name is required" });
    }

    return errors;
  }
};
