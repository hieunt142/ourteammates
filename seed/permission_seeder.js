const seeder = require("mongoose-seed");
const CONFIG = require("../config");

let permissions = [];

permissions.push({
  name: "all",
  bit: 1
});

permissions.push({
  name: "view",
  bit: 2
});

permissions.push({
  name: "create-team",
  bit: 4
});

permissions.push({
  name: "edit-team",
  bit: 8
});

permissions.push({
  name: "disband-team",
  bit: 16
});

permissions.push({
  name: "add-member",
  bit: 32
});

permissions.push({
  name: "remove-member",
  bit: 64
});

// permissions.push({
//   name: "remove-member",
//   bit: 128
// });

let data = [
  {
    model: "Permission",
    documents: permissions
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
    seeder.loadModels(["./models/permission"]);

    seeder.clearModels(["Permission"], () => {
      seeder.populateModels(data, () => {
        seeder.disconnect();
      });
    });
  }
);
