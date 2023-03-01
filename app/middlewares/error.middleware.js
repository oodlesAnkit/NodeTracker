const { CustomValidationError } = require("../errors/custom_validation_error");
const { logger, errorLogger } = require("../utils/logger.util");

module.exports = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;


  console.log("asdasdasd");
  errorLogger.error(err.stack);


  if (err instanceof CustomValidationError) {
    return res.status(err.status).send({
      success: false,
      message: err.message.details,
      error: err.stack,
    });
  }

  return res.status(statusCode).json({
    message: err.message,
    stack: err.stack,
  });
};

