const routes_users = require("./user.routes");
const routes_loginHistory = require("./loginHistory.routes");
const express = require("express");

const errorHandleer = require("../middlewares/error.middleware");
require("express-async-errors");
module.exports = function (server) {
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  server.use("/api/v1/users", routes_users);
  server.use("/api/v1/login-history", routes_loginHistory);

  server.use(errorHandleer);
};
