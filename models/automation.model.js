const mongoose = require("mongoose");

const AutomationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bot_type: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  website_url: {
    type: String,
    required: true,
  },
  is_running: {
    type: Boolean,
    required: true,
    default: false,
  },
  is_locked: {
    type: Boolean,
    required: true,
    default: false,
  },
  keep_running: {
    type: Boolean,
    required: true,
    default: false,
  },
  last_ran_ended:{
    type:Date,
  },
  steps: {
    type: [
      {
        step_type: {
          type: Number,
          required: true,
        },
        selector: {
          type: String,
        },
        sub_steps: [
          {
            step_type: {
              type: Number,
            },
            data: {
              type: String,
            },
            wait_for_new_page: {
              type: Boolean,
              required: true,
              default: false,
            },
          },
        ],
      },
    ],
  },
});

const Automation = mongoose.model("Automation", AutomationSchema);

module.exports = Automation;
