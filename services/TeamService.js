const { Team, Member } = require("../models");
const fs = require("fs");
const CONFIG = require("../config");
const ValidatorService = require("./ValidatorService");
const MemberService = require("./MemberService");
const PathUtil = require("../utilities/PathUtil");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  addNewTeam: async teamInfo => {
    let errors = await ValidatorService.validateNewTeam(teamInfo);
    if (errors.length != 0) {
      return { code: 400, error: errors };
    } else {
      let checkTeam = await Team.findOne({ name: teamInfo.name.trim() });
      if (checkTeam) {
        return { code: 400, error: "Team's name has been used" };
      } else {
        let newTeam = Team({
          name: teamInfo.name
        });
        if (teamInfo.codeName) newTeam.codeName = teamInfo.codeName;
        if (teamInfo.avatar) newTeam.avatar = teamInfo.avatar;
        if (teamInfo.leader) newTeam.leader = teamInfo.leader;
        try {
          await Team.create(newTeam);
          checkTeam = await Team.findOne({ name: teamInfo.name.trim() });
          return { code: 200, message: "Succeed", data: checkTeam };
        } catch (err) {
          return { code: 500, message: "Internal server error", data: err };
        }
      }
    }
  },
  assignTeamLeader: async (teamId, memberId) => {
    let isValidId = ObjectId.isValid(teamId);
    if (isValidId) {
      let isValidMemberId = ObjectId.isValid(memberId);
      if (isValidMemberId) {
        try {
          let isMemberHasManagedOneTeam = await Team.findOne({
            leader: memberId
          });
          if (isMemberHasManagedOneTeam) {
            return {
              code: 500,
              message: "One member should be leader of one team only",
              data: null
            };
          } else {
            await Team.findByIdAndUpdate(teamId, {
              leader: memberId
            });

            await MemberService.changeTeam(teamId, memberId);
            let result = await Team.findById(teamId);
            return { code: 200, message: "Succeed", data: result };
          }
        } catch (err) {
          return { code: 500, message: "Internal server error", data: err };
        }
      } else {
        return {
          code: 404,
          message: "Member not found",
          error: "Member not found"
        };
      }
    } else {
      return {
        code: 404,
        message: "Team not found",
        error: "Team not found"
      };
    }
  },
  uploadAvatar: async (file, teamId) => {
    let isValidId = ObjectId.isValid(teamId);
    if (isValidId) {
      let checkTeam = await Team.exists({ _id: teamId });
      try {
        if (checkTeam) {
          let teamInfo = await Team.findById(teamId);
          let { ext } = await PathUtil.getFileNameAndExt(file.originalname);
          let avatarFileName =
            teamInfo.name
              .trim()
              .split(" ")
              .join("_") +
            "_avatar" +
            "." +
            ext;
          let newFilePath = file.path.replace(
            file.originalname,
            avatarFileName
          );
          fs.renameSync(file.path, newFilePath);

          await Team.findByIdAndUpdate(teamId, {
            avatar: {
              data: avatarFileName,
              contentType: file.mimetype
            }
          });

          let result = await Team.findById(teamId);
          return { code: 200, message: "Succeed", data: result };
        } else {
          return {
            code: 404,
            message: "Team not found",
            error: "Team not found"
          };
        }
      } catch (err) {
        return { code: 500, message: "Internal server error", data: err };
      }
    } else {
      return {
        code: 404,
        message: "Team not found",
        error: "Team not found"
      };
    }
  },
  addMemberToTeam: async (teamId, memberId) => {
    let isValidId = ObjectId.isValid(teamId);
    if (isValidId) {
      let team = await Team.findById(teamId);
      if (team) {
        let isValidMemberId = ObjectId.isValid(memberId);
        if (isValidMemberId) {
          let tmpMember = await Member.findById(memberId);
          if (tmpMember) {
            team.members.push(tmpMember._id);
          } else {
            return {
              code: 404,
              message: "Member not found",
              error: "Member not found"
            };
          }
        } else {
          return {
            code: 404,
            message: "Member not found",
            error: "Member not found"
          };
        }
      } else {
        return {
          code: 404,
          message: "Team not found",
          error: "Team not found"
        };
      }
    } else {
      return {
        code: 404,
        message: "Team not found",
        error: "Team not found"
      };
    }
  }
};
