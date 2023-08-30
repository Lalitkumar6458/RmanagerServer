const mongoose = require("mongoose");

const ExpensesSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true },
    userId: { type: String, required: true },
    staffId: { type: String, required: true },
    staffname: { type: String, required: true },
    Expense: { type: Number, required: true },
    date: { type: Date, required: true },
    node: { type: String, required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Expenses =
  mongoose.models.Expenses || mongoose.model("Expenses", ExpensesSchema);

module.exports = Expenses;
