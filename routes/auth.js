const express = require("express");
const route = express.Router();
const passport = require("passport");
const authService = require("../services/AuthService");

module.exports = app => {
  app.use("/auth", route);
  route.post("/signin", async (req, res, next) => {
    console.log(req.body);
    const { email, password } = req.body;
    let result = await authService.signIn({
      email: email,
      password: password
    });
    res.json(result);
  });

  route.post(
    "/signout",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      if (req.user) {
        req.session.destroy();
        req.logout();
        res.json({
          code: 200,
          message: "Signout successful"
        });
      } else {
        res.json({
          code: 501,
          message: "Authorization failed"
        });
      }
    }
  );
};
