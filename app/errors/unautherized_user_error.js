const { CustomValidationError } = require("./custom_validation_error");

class UnauthorizedUserError extends CustomValidationError {
  constructor(
    message,
    status,
    code,
    request_user = null,
    request_params = null,
    request_body = null
  ) {
    super(
      message,
      522,
      '',
      request_user,
      request_params,
      request_body
    );

    this.name = "UnauthorizedUserError";
    this.status = 522;
    this.code = unautherized_access;
  }
}

module.exports = { UnauthorizedUserError };





/**
 * Today's Task
 * - Understand Docker, docker image and docker composer file 
 * - Resolved not getting error stack in error logs and in API response, made changes in winston config & middleware
 * - Understading bull queue, simple queues, producers, and consumers
 * 
 * 
 * 
 * 
 * 
 */