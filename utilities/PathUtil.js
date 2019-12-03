const os = require("os");

module.exports = {
  generatePublicImageLink: async (req, filename) => {
    return req.hostname + ":" + req.port + "/img/" + filename;
  },
  getFileNameAndExt: async filename => {
    let tmpFilename = filename
      .split(".")
      .slice(0, -1)
      .join(".");
    let fileExt = filename.split(".").slice(-1);
    return { fullname: filename, name: tmpFilename, ext: fileExt };
  }
};
