const jwt = require("jsonwebtoken");
const { tokenKey } = require("../config/config");

module.exports.tokenResponse = (user, res) => {
  const token = jwt.sign({ user_id: user._id }, tokenKey);
  res.status(200).send({
    token: token,
  });
};

module.exports.successResponse = (data, res) => {
  res.status(200).send(data);
};

module.exports.errorResponse = (error, res) => {
  res.status(422).send(`${error}`);
};
