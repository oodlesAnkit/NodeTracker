module.exports = {
  development: {
    username: "root",
    password: "Test@123",
    database: "trackingDB",
    host: "localhost",
    dialect: "mysql",
    dialectModule: require('mysql2'),

  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
