const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports.getTokenFromHeader = (req) => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }

  return null;
};

module.exports.validateBody = (schema) => (req, res, next) => {
  try {
    const result = schema.validate(req.body);

    if (result.error) {
      return res.status(400).send(result.error.details[0].message);
    }
  } catch (error) {
    return res.status(500).send(`${error}`);
  }
  next();
};

module.exports.validateHeader = () => async (req, res, next) => {
  try {
    const token = this.getTokenFromHeader(req);
    res.locals.user = jwt.verify(token, config.tokenKey);

    next();
  } catch (error) {
    return res.status(500).send(`${error}`);
  }
};
