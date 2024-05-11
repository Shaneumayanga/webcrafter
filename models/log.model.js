const mongoose = require("mongoose");
const { DelegatedLocator } = require("puppeteer");

const LogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    automation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Automation",
      required: true,
    },
    log_text: {
      type: String,
      required: true,
    },
    log_type: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    autoCreate: true,
  }
);

const Log = mongoose.model("log", LogSchema);

module.exports = Log;
