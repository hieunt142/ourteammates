const fs = require("fs");
const path = require("path");
const baseName = path.basename(__filename);
const models = {};
const mongoose = require("mongoose");
const CONFIG = require("../config");

if (CONFIG.DB_HOST != "") {
  let files = fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf(".") !== 0 && file !== baseName && file.slice(-3) === ".js"
      );
    })
    .forEach(file => {
      let filename = file.split(".")[0];
      let modelName = filename.charAt(0).toUpperCase() + filename.slice(1);
      models[modelName] = require("./" + file);
    });

  mongoose
    .connect(
      "mongodb://" +
        CONFIG.DB_HOST +
        ":" +
        CONFIG.DB_PORT +
        "/" +
        CONFIG.DB_NAME
    )
    .catch(err => {
      console.log("Cannot connect to Mongo Server");
    });

  let db = mongoose.connection;
  module.exports = db;
  db.once("open", () => {
    console.log("Connected to Mongo DB");
  });

  db.on("error", error => {
    console.log("Error", error);
  });
} else {
  console.log("Cannot get DB config");
}

module.exports = models;
