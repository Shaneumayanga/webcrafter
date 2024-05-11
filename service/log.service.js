const LogModel = require("../models/log.model");
const { getUserById } = require("../service/user.service");
const { getAutomationId } = require("../service/automation.service");
const mongoose = require("mongoose");

module.exports.createLog = async (body) => {
  const user = await getUserById(body.user_id);
  if (!user) {
    throw new Error("invalid user_id");
  }

  const automation = await getAutomationId(body.automation_id);
  if (!automation) {
    throw new Error("invalid automation id");
  }

  const logSaveDb = new LogModel(body);
  return await logSaveDb.save();
};

module.exports.getLogsForUser = async (user_id, automation_id) => {
  const logsPerUser = await LogModel.find({
    user_id: new mongoose.Types.ObjectId(user_id),
    automation_id: new mongoose.Types.ObjectId(automation_id),
  })
    .sort({ created_at: -1 })
    .limit(15);
  return logsPerUser;
};
