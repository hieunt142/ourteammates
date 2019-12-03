const express = require("express");
const route = express.Router();
const passport = require("passport");
const Format = require("response-format");
const memberService = require("../services/MemberService");

module.exports = app => {
  app.use("/member", route);
  route.post("/signup", async (req, res, next) => {
    let registerUser = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    };
    let result = await memberService.createNewMember(registerUser);
    res.send(result);
  });

  route.get("/list", async (req, res, next) => {
    let result = await memberService.getMembers(
      {},
      req.query.page,
      req.query.limit
    );
    res.json(
      Format.success(null, {
        page: parseInt(req.query.page),
        limit: parseInt(req.query.limit),
        members: result
      })
    );
  });

  route.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      console.log("profile api");
      res.json(req.user);
    }
  );

  route.put(
    "/updateInfo/:memberId",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      if (req.user._id.toString() === req.params.memberId) {
        try {
          let result = await memberService.updateMemberInfo(
            req.params.memberId,
            req.body
          );
          switch (result.code) {
            case 200: {
              res.json(Format.success(result.data));
              break;
            }
            case 400: {
              res.json(Format.badRequest(result.error));
              break;
            }
            case 404: {
              res.json(Format.notFound(result.error));
              break;
            }
            case 500: {
              res.json(Format.internalError(result.message));
              break;
            }
            default:
              res.json(Format.unavailable("Error"));
          }
        } catch (err) {
          console.log("error at route");
          res.json(Format.internalError(result.message));
        }
      } else {
        res.json(
          Format.notAllowed(
            "You do not have permission to edit member's profile"
          )
        );
      }
    }
  );
};
