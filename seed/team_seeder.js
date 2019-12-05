const seeder = require("mongoose-seed");
const CONFIG = require("../config");

let teams = [];

teams.push({
  name: "System Integration 1",
  codeName: "SI-1"
});

teams.push({
  name: "System Integration 2",
  codeName: "SI-2"
});

teams.push({
  name: "System Integration 3",
  codeName: "SI-3"
});

teams.push({
  name: "System Integration 4",
  codeName: "SI-4"
});

teams.push({
  name: "System Integration 5",
  codeName: "SI-5"
});

teams.push({
  name: "System Integration 6",
  codeName: "SI-6"
});

teams.push({
  name: "HR Technology",
  codeName: "HR-Tech"
});

teams.push({
  name: "MI1",
  codeName: "MI-1"
});

teams.push({
  name: "MI2",
  codeName: "MI-2"
});

teams.push({
  name: "CP1",
  codeName: "CP-1"
});

teams.push({
  name: "CP2",
  codeName: "CP-2"
});

let data = [
  {
    model: "Team",
    documents: teams
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
    seeder.loadModels(["./models/team"]);

    seeder.clearModels(["Team"], () => {
      seeder.populateModels(data, () => {
        seeder.disconnect();
      });
    });
  }
);
