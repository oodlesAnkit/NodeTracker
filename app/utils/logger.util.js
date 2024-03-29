const winston = require("winston");
const {format}=require('winston');
const {errors}=format;

const CATEGORY = "index";

const logConfiguration = {
  transports: [
    new winston.transports.File({
      name: "info",
      filename: __dirname + "../../../logs/winston2.log",
    }),
  ],
  format: winston.format.combine(
    winston.format.label({
      label: CATEGORY,
    }),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `[${info.timestamp}] [${info.label}] : [${info.level}] ${info.message}`;
    })
  ),
};

const errorLogConfiguration = {
  transports: [
    new winston.transports.File({
      name: "error",
      filename: __dirname + "../../../logs/error.log",
    }),
  ],
  format: winston.format.combine(
    // errors({ stack: true }),
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.printf((error) => {
      return `[${error.timestamp}] [${error.level}] ${error.message} ${error.stack}`;
    })
  ),
};

// winston.format.printf((error)=>{
//     return `${error.timestamp} - [${error.level}] ${error.message}`;
// })

const errorLogger = winston.createLogger(errorLogConfiguration);
const logger = winston.createLogger(logConfiguration);

module.exports = { logger, errorLogger };
