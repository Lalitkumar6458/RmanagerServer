const express = require("express");
const router = express.Router();
const Expenses = require("../Database/Modal/Expenses");

const ConnectMongo = require("../Database/conn");// Import your Expenses model

router.get("/:timeInterval", async (req, res) => {
  const { userId, groupId, staffId } = req.query;
  const { timeInterval } = req.params;
  const { dateRange } = req.query;
  const { startDate, endDate } = JSON.parse(dateRange);
console.log(JSON.parse(dateRange), "req.query");
  try {
    // Calculate the start and end dates based on the timeInterval
  
    // Create a filter object based on userId, groupId, staffId, and date
    const filter = { userId, groupId };

    if (staffId && staffId !== "null") {
      filter.staffId = staffId;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }
    console.log("filter", filter);
    // Find expenses matching the filter
    const expenses = await Expenses.find(filter).sort({ date: -1 });
    if (expenses.length > 0) {
      const totalExpenseAmount = expenses.reduce(
        (total, expense) => total + expense.Expense,
        0
      );
      res
        .status(200)
        .json({ data: expenses, totalExpenseGroupAmount: totalExpenseAmount });
    } else {
      res
        .status(404)
        .json({ error: "No expenses found for the user", data: [] });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error retrieving expenses", data: [] });
  }
});

module.exports = router;
