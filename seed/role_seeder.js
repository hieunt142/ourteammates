const seeder = require("mongoose-seed");
const CONFIG = require("../config");

let roles = [];

roles.push({
  name: "SysAdmin",
  bit: 1
});

roles.push({
  name: "Director",
  bit: 1
});

roles.push({
  name: "Manager",
  bit: 2 + 8 + 32 + 64
});

roles.push({
  name: "Member",
  bit: 2
});

let data = [
  {
    model: "Role",
    documents: roles
  }
];

// connect to mongodb
seeder.connect(
  "mongodb://" +
    CONFIG.DB_HOST_DOCKER +
    ":" +
    CONFIG.DB_PORT +
    "/" +
    CONFIG.DB_NAME,
  () => {
    seeder.loadModels(["./models/role"]);

    seeder.clearModels(["Role"], () => {
      seeder.populateModels(data, () => {
        seeder.disconnect();
      });
    });
  }
);
