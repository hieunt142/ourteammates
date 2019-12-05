const { Member, Team } = require("../models");
const MemberService = require("./MemberService");
const jwtWTK = require("jsonwebtoken");
const CONFIG = require("../config");

module.exports = {
  signIn: async authInfo => {
    const { email, password } = authInfo;
    let checkMember = await MemberService.getMemberByEmail(email);
    if (checkMember) {
      if (checkMember.validatePassword(password)) {
        let signInfo = {
          id: checkMember._id,
          email: checkMember.email
        };
        let token = jwtWTK.sign(signInfo, CONFIG.SECRET, {
          expiresIn: 604800 // expire in 1 wk
        });
        return {
          code: 200,
          message: "Signin successful",
          data: {
            token: "Bearer " + token
          }
        };
      } else {
        return { code: 501, message: "Signin failed" };
      }
    } else {
      return { code: 404, message: "Member not found" };
    }
  },
  signOut: async userModel => {
    console.log("signout");
    return true;
  },
  createNewTeam: async teamInfo => {
    let newTeam = await Team.create(teamInfo);
  }
};
