const { Role, Permission } = require("../models");

module.exports = {
  isAllowCreateNewTeam: async role_in_scope => {
    if (role_in_scope.length > 0) {
      const allPermission = await Permission.find({ name: "all" });
      const creatTeamPermission = await Permission.find({
        name: "create-team"
      });
      let result = false;
      let resultRole = await role_in_scope.filter(async role => {
        const roleData = await Role.findById(role.role);
        result =
          (parseInt(roleData.permission) & parseInt(allPermission.bit)) ==
            parseInt(allPermission.bit) ||
          (parseInt(roleData.permission) & parseInt(creatTeamPermission.bit)) ==
            parseInt(creatTeamPermission.bit);
        return result;
      });
      return resultRole.length > 0;
    } else {
      return false;
    }
  },
  isAllowToEditTeam: async (role_in_scope, teamId) => {
    if (role_in_scope.length > 0) {
      const allPermission = await Permission.find({ name: "all" });
      const editTeamPermission = await Permission.find({
        name: "edit-team"
      });
      let result = false;
      let resultRole = await role_in_scope.filter(async role => {
        const roleData = await Role.findById(role.role);
        result =
          (parseInt(roleData.permission) & parseInt(allPermission.bit)) ==
            parseInt(allPermission.bit) ||
          (role.scope_type === "Team" &&
            role.scope_id.toString() === teamId &&
            (parseInt(roleData.permission) &
              parseInt(editTeamPermission.bit)) ==
              parseInt(editTeamPermission.bit));
        return result;
      });
      return resultRole.length > 0;
    } else {
      return false;
    }
  },
  isAllowToAssignLeader: async role_in_scope => {
    if (role_in_scope.length > 0) {
      const allPermission = await Permission.find({ name: "all" });
      let result = false;
      let resultRole = await role_in_scope.filter(async role => {
        const roleData = await Role.findById(role.role);
        result =
          (parseInt(roleData.permission) & parseInt(allPermission.bit)) ==
          parseInt(allPermission.bit);
        return result;
      });
      return resultRole.length > 0;
    } else {
      return false;
    }
  }
};
