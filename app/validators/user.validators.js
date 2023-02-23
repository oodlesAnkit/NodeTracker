const Joi = require("joi");

function validateCreateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    password: Joi.string().min(8).max(30).required(),
    isBlocked: Joi.boolean().required(),
    role: Joi.string().valid("user", "admin").required(),
    email: Joi.string().email().required(),
  });
  const result = schema.validate(user);
  return result;
}

function valiateLoginDetails(loginUser) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(10).required(),
    ip: Joi.string().optional(),
  });

  const result = schema.validate(loginUser);
  return result;
}

function validateBlockUserDetails(blockUser) {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    ip: Joi.string().required(),
  });

  const result = schema.validate(blockUser);
  return result;
}

function validateLoginHistoryIpBased(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    // user_id: Joi.string().required(),

  });

  return schema.validate(user);
}

module.exports = {
  validateCreateUser,
  valiateLoginDetails,
  validateBlockUserDetails,
  validateLoginHistoryIpBased,
};
