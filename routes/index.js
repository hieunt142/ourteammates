const auth = require("./auth");
const member = require("./member");
const team = require("./team");

module.exports = expressApp => {
  const router = expressApp.Router();
  auth(router);
  member(router);
  team(router);
  return router;
};
