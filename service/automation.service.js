const AutomationModel = require("../models/automation.model");
const userService = require("../service/user.service");
const mongoose = require("mongoose");

module.exports.createAutomation = async (body, userFromToken) => {
  const user = await userService.getUserById(userFromToken.user_id);
  if (!user) {
    throw new Error("invalid user_id");
  }

  body.user_id = userFromToken.user_id;

  const AutomationModelSave = new AutomationModel(body);
  return await AutomationModelSave.save();
};

module.exports.getAutomationId = async (id) => {
  const automation = await AutomationModel.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  return automation;
};

module.exports.getAutomations = async (userFromToken) => {
  const user_id = userFromToken.user_id;
  const automations = await AutomationModel.find({
    user_id: new mongoose.Types.ObjectId(user_id),
  });

  return automations;
};

module.exports.runAutomation = async (automation_id) => {
  const result = await AutomationModel.updateOne(
    {
      _id: new mongoose.Types.ObjectId(automation_id),
    },
    {
      is_running: true,
    },
    {
      new: true,
    }
  );
  if (result) {
    return "automation started";
  }
  return "not started";
};

module.exports.toggleAutomationKeepRunning = async (automation_id) => {
  const automation = await this.getAutomationId(automation_id);

  if (!automation) {
    throw new Error("automation not found");
  }

  const result = await AutomationModel.updateOne(
    {
      _id: new mongoose.Types.ObjectId(automation_id),
    },
    {
      keep_running: !automation.keep_running,
    },
    {
      new: true,
    }
  );

  if (result) {
    return "setting changed";
  }

  return "not changed";
};

module.exports.updateAutomationSteps = async (automation_id, new_steps) => {
  const result = await AutomationModel.updateOne(
    {
      _id: new mongoose.Types.ObjectId(automation_id),
    },
    {
      steps: new_steps
    },
    {
      new: true,
    }
  );
  if(result){
    return "succesfully updated"
  }
  return "not updated"
};
