const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true },
    userId: { type: String, required: true },
    staffname: { type: String, required: true },
    staffemail: { type: String, required: true },
    category: { type: Array, required: true },
  },
  { timestamps: true }
);

const Staff = mongoose.models.Staff || mongoose.model("Staff", StaffSchema);

module.exports = Staff;

