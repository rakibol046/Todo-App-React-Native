const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    is_complete: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "People",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const People = mongoose.model("Task", taskSchema);

module.exports = People;
