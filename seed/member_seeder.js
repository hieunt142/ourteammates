const seeder = require("mongoose-seed");
const CONFIG = require("../config");
// const { Member, Role } = require("../models");
const MongoClient = require("mongodb").MongoClient;
const dbUrl = "mongodb://" + CONFIG.DB_HOST_DOCKER + ":" + CONFIG.DB_PORT;

MongoClient.connect(dbUrl, async (err, db) => {
  if (err) throw err;
  let dbo = db.db(CONFIG.DB_NAME);
  console.log("Connect successful");
  let role = await dbo.collection("roles").findOne({ name: "SysAdmin" });
  db.close();
  if (role) {
    let members = [];
    let memberModel = {
      firstName: "admin",
      lastName: "admin",
      email: "admin@ourteam.vn"
    };

    members.push({
      firstName: memberModel.firstName,
      lastName: memberModel.lastName,
      email: memberModel.email,
      password: "admin@2019",
      is_sys_admin: true,
      role_in_scope: [
        {
          role: role._id
        }
      ]
    });

    let testMemberModel = {
      firstName: "test",
      lastName: "member",
      email: "test@ourteam.vn"
    };

    members.push({
      firstName: testMemberModel.firstName,
      lastName: testMemberModel.lastName,
      email: testMemberModel.email,
      password: "test@2019",
      is_sys_admin: false,
      role_in_scope: []
    });

    let data = [
      {
        model: "Member",
        documents: members
      }
    ];

    // connect to mongodb
    seeder.connect(
      "mongodb://" +
        CONFIG.DB_HOST_DOCKER +
        ":" +
        CONFIG.DB_PORT +
        "/" +
        CONFIG.DB_NAME,
      () => {
        seeder.loadModels(["./models/member"]);

        seeder.clearModels(["Member"], () => {
          seeder.populateModels(data, () => {
            seeder.disconnect();
          });
        });
      }
    );
  } else {
    console.log("Cannot find any role");
  }
});

// let sysRole = Role.findOne({ name: "SysAdmin" }).exec(function(err, roleData) {
//   if (err) return false;
//   let members = [];
//   let memberModel = new Member({
//     firstName: "admin",
//     lastName: "admin",
//     email: "admin@ourteam.vn"
//   });

//   members.push({
//     firstName: memberModel.firstName,
//     lastName: memberModel.lastName,
//     email: memberModel.email,
//     password: memberModel.generateHash("admin@2019"),
//     is_sys_admin: true,
//     role_in_scope: [
//       {
//         role: roleData._id
//       }
//     ]
//   });

//   let testMemberModel = new Member({
//     firstName: "test",
//     lastName: "member",
//     email: "test@ourteam.vn"
//   });

//   members.push({
//     firstName: testMemberModel.firstName,
//     lastName: testMemberModel.lastName,
//     email: testMemberModel.email,
//     password: memberModel.generateHash("test@2019"),
//     is_sys_admin: false,
//     role_in_scope: []
//   });

//   let data = [
//     {
//       model: "Member",
//       documents: members
//     }
//   ];

//   // connect to mongodb
//   seeder.connect(
//     "mongodb://" +
//       CONFIG.DB_HOST_DOCKER +
//       ":" +
//       CONFIG.DB_PORT +
//       "/" +
//       CONFIG.DB_NAME,
//     () => {
//       seeder.loadModels(["./models/member"]);

//       seeder.clearModels(["Member"], () => {
//         seeder.populateModels(data, () => {
//           seeder.disconnect();
//         });
//       });
//     }
//   );
// });
