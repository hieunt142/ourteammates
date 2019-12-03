const express = require("express");
const route = express.Router();
const passport = require("passport");
const Format = require("response-format");
const teamService = require("../services/TeamService");
const permissionService = require("../services/PermissionService");
const multer = require("multer");
const fs = require("fs");

module.exports = app => {
  app.use("/team", route);

  console.log(process.cwd());

  let storageConfig = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, process.cwd() + "/public/uploads");
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });

  let uploadWorker = multer({ storage: storageConfig });

  route.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      let isAllowCreateTeam = await permissionService.isAllowCreateNewTeam(
        req.user.role_in_scope
      );
      if (isAllowCreateTeam) {
        let result = await teamService.addNewTeam(req.body);
        switch (result.code) {
          case 200: {
            res.json(Format.success(result.data));
            break;
          }
          case 400: {
            res.json(Format.badRequest(result.error));
            break;
          }
          case 500: {
            res.json(Format.internalError(result.error));
            break;
          }
          default:
            res.json(Format.unavailable("Error"));
        }
      } else {
        res.json(Format.notAllowed("Not allow"));
      }
    }
  );

  route.put(
    "/uploadavatar",
    [
      passport.authenticate("jwt", { session: false }),
      uploadWorker.single("avatar")
    ],
    async (req, res, next) => {
      let isAllowEditTeam = await permissionService.isAllowToEditTeam(
        req.user.role_in_scope,
        req.body.team_id
      );
      if (isAllowEditTeam) {
        let result = await teamService.uploadAvatar(req.file, req.body.team_id);
        switch (result.code) {
          case 200: {
            res.json(Format.success(result.data));
            break;
          }
          case 404: {
            res.json(Format.badRequest(result.error));
            break;
          }
          case 500: {
            res.json(Format.internalError(result.message));
            break;
          }
          default:
            res.json(Format.unavailable("Error"));
        }
      } else {
        try {
          fs.unlinkSync(req.file.path);
          res.json(Format.notAllowed("Not allow"));
        } catch (err) {
          res.json(Format.notAllowed("Not allow"));
        }
      }
    }
  );

  route.put(
    "/assignleader",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      let isAllowToAssignLeader = await permissionService.isAllowToAssignLeader(
        req.user.role_in_scope
      );
      if (isAllowToAssignLeader) {
        let result = await teamService.assignTeamLeader(
          req.body.team_id,
          req.body.member_id
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
      } else {
        res.json(
          Format.notAllowed(
            "You do not have permission to assign leader to a team"
          )
        );
      }
    }
  );
};
