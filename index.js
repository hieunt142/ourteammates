const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes");
const models = require("./models");
const passport = require("passport");
const path = require("path");

// app.use(express.static("public"));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);
app.use(bodyParser.json());
app.use("/api", routes(express));

app.use("/img", express.static(path.join(__dirname, "./public/uploads")));

app.listen(3000, () => {
  console.log("Server is listening at port 3000");
});
