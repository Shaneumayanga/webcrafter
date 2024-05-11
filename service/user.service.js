const UserModel = require("../models/user.model");
const argon2 = require("argon2");
const mongoose = require("mongoose");
const logService = require("../service/log.service");

module.exports.createUser = async (body) => {
  const email = body.email;
  let password = body.password;
  password = await argon2.hash(password);
  const user_name = body.user_name;

  const existingUser = await UserModel.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("Please try a different email");
  }
  const UserModelSave = new UserModel({
    user_name,
    email,
    password,
  });

  const saveresult = await UserModelSave.save();

  return saveresult._id;
};

module.exports.login = async (body) => {
  const email = body.email;
  let password = body.password;
  let userByEmail = await this.getUserByEmail(email);

  const incorrectEmailOrPassword = "Incorrect email or password";

  if (!userByEmail) {
    throw new Error(incorrectEmailOrPassword);
  }

  if (!(await argon2.verify(userByEmail.password, password))) {
    throw new Error(incorrectEmailOrPassword);
  }

  return userByEmail;
};

module.exports.getUserById = async (id) => {
  const user = await UserModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  return user;
};

module.exports.getUserByEmail = async (email) => {
  let user = await UserModel.findOne({
    email: email,
  });

  return user;
};


module.exports.userLogs = async (user_id,automation_id)=>{
  const logs = await logService.getLogsForUser(user_id,automation_id);
  return logs;
}