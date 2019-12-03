const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { Member } = require("../models");
const CONFIG = require("../config");

module.exports = passport => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken("jwt");
  opts.secretOrKey = CONFIG.SECRET;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        let requestMember = await Member.findOne({
          _id: jwt_payload.id
        }).select("-password");
        done(null, requestMember);
      } catch (err) {
        done(err, null);
      }
    })
  );
};
