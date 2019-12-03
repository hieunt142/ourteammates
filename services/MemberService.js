const { Member, Team } = require("../models");
const ObjectId = require("mongoose").Types.ObjectId;
const Format = require("response-format");
const CONFIG = require("../config");
const validator = require("./ValidatorService");

async function getMemberByEmail(email) {
  let member = await Member.findOne({ email: email });
  if (member) return member;
  else return null;
}

async function getMembers(query = {}, page = 1, limit = CONFIG.LIMIT_DATA) {
  let currentPage = parseInt(page) > 0 ? parseInt(page) : 1;
  const count = await Member.countDocuments({});
  const members = await Member.find(query)
    .select("-password")
    .skip((currentPage - 1) * parseInt(limit))
    .limit(parseInt(limit));
  return members;
}

async function getMembersByTeam(teamId, page = 1, limit = CONFIG.LIMIT_DATA) {
  return getMembers({ team: teamId }, page, limit);
}

module.exports = {
  getMemberByEmail: getMemberByEmail,
  getMembers: getMembers,
  getMembersByTeam: getMembersByTeam,
  createNewMember: async userInfo => {
    let checkMember = await getMemberByEmail(userInfo.email);
    if (checkMember) {
      return Format.badRequest("Email has been used by other user");
    } else {
      let errors = await validator.validateNewUser(userInfo);
      if (errors.length !== 0) {
        return Format.badRequest("Bad request", errors);
      } else {
        let newMember = Member({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          password: userInfo.password
        });
        newMember.password = newMember.generateHash(userInfo.password);

        await Member.create(newMember);
        let result = await Member.findOne({ email: newMember.email }).select(
          "-password"
        );
        return Format.success(
          "New member is added to system successful",
          result
        );
      }
    }
  },
  updateMemberInfo: async (memberId, userInfo) => {
    try {
      let isIdValid = ObjectId.isValid(memberId);
      if (isIdValid) {
        let checkUser = await Member.findById(memberId);
        if (checkUser) {
          const forbiddenField = [
            "email",
            "password",
            "is_sys_admin",
            "team",
            "role_in_scope",
            "images",
            "avatar"
          ];
          Object.keys(userInfo).forEach(function(key) {
            if (!forbiddenField.includes(key)) {
              checkUser[key] = userInfo[key];
            }
          });
          let errors = await validator.validateUpdateUserInfo(checkUser);
          if (errors.length > 0) {
            return { code: 400, message: "Bad request", error: errors };
          }
          await checkUser.save();
          let result = await Member.findById(memberId).select("-password");
          return { code: 200, message: "Succeed", data: result };
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
    } catch (err) {
      return { code: 500, message: "Internal server error", data: err };
    }
  },
  changeTeam: async (teamId, memberId) => {
    let isTeamIdValid = ObjectId.isValid(teamId);
    if (isTeamIdValid) {
      let isMemberIdValid = ObjectId.isValid(memberId);
      if (isMemberIdValid) {
        let checkUser = await Member.findById(memberId);
        checkUser.team = teamId;
        await checkUser.save();
        let result = await Member.findById(memberId).select("-password");
        return { code: 200, message: "Succeed", data: result };
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
