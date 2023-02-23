const express = require("express");
const { JWT_SECERT } = require("../config/envs");

const server = express();

require("./routes/index")(server);

if (!JWT_SECERT) {
  console.error("Fatal Error: JWT Token is not define in ENV");
}

module.exports = server;
