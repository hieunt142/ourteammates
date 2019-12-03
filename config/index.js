require("dotenv").config();

let CONFIG = {};

CONFIG.app = process.env.APP || "dev";
CONFIG.port = process.env.PORT || "3000";
CONFIG.DB_DIALECT = process.env.DB_DIALECT || "mongo";
CONFIG.DB_HOST = process.env.DB_HOST || "localhost";
CONFIG.DB_PORT = process.env.DB_PORT || "27017";
CONFIG.DB_NAME = process.env.DB_NAME || "ourteammates";
CONFIG.DB_USER = process.env.DB_USER || "root";
CONFIG.DB_PASSWORD = process.env.DB_PASSWORD;
CONFIG.SECRET = process.env.SECRET;
CONFIG.LIMIT_DATA = 10;

module.exports = CONFIG;
