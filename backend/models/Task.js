const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    entityName: {
      type: String,
      required: true,
      trim: true,
    },
    taskType: {
      type: String,
      enum: ["Call", "Meeting", "Video Call"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      hour: { type: Number, min: 1, max: 12, required: true },
      minute: { type: Number, min: 0, max: 59, required: true },
      period: { type: String, enum: ["AM", "PM"], required: true },
    },
    contactPerson: {
      type: String,
      default: "",
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
