const express = require("express");
const router = express.Router();
const Expenses = require("../Database/Modal/Expenses");

const ConnectMongo = require("../Database/conn");// Import your Expenses model

router.get("/:timeInterval", async (req, res) => {
  const { userId, groupId, staffId } = req.query;
  const { timeInterval } = req.params;

  try {
    // Calculate the start and end dates based on the timeInterval
    let startDate, endDate;

    if (timeInterval === "Daily") {
      startDate = new Date();
      endDate = new Date();

      endDate.setDate(endDate.getDate() + 1);
       // Set endDate to the next day
    startDate=startDate.toISOString().split("T")[0],
        endDate=endDate.toISOString().split("T")[0];
        startDate = new Date(startDate);
        endDate = new Date(endDate);

    } else if (timeInterval === "Weekly") {
        const currentDate = new Date();

        // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const currentDayOfWeek = currentDate.getDay();

        // Calculate the start date of the current week (Sunday)
        const starteDate = new Date(currentDate);
        starteDate.setDate(currentDate.getDate() - currentDayOfWeek);

        // Calculate the end date of the current week (Saturday)
        const endrDate = new Date(currentDate);
        endrDate.setDate(currentDate.getDate() + (6 - currentDayOfWeek));

        // Format the start and end dates as ISO 8601 strings
        startDate =new Date( starteDate.toISOString().split("T")[0]);
        endDate = new Date(endrDate.toISOString().split("T")[0]); // Set endDate to one week from now
    } else if (timeInterval === "Monthly") {
      const newDate = new Date();
      startDate = new Date(
        newDate.toISOString().split("T")[0].split("-")[0] +
          "-" +
          newDate.toISOString().split("T")[0].split("-")[1] +
          "-" +
          "01"
      );
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999); // Set endDate to the last millisecond of the month
    } else if (timeInterval === "Yearly") {
      const newDate = new Date();
      startDate = new Date(
        newDate.toISOString().split("T")[0].split("-")[0] +
          "-" +
          "01" +
          "-" +
          "01"
      );

      endDate = new Date(startDate.getFullYear() + 1, 0, 0);
      endDate.setHours(23, 59, 59, 999); // Set endDate to the last millisecond of the year
    } else {
      // For 'all' interval, do not set date filters
    }


    // Create a filter object based on userId, groupId, staffId, and date
    const filter = { userId, groupId };

    if (staffId && staffId !== "null") {
      filter.staffId = staffId;
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate.toISOString().split("T")[0]).toISOString(),
        $lte: new Date(endDate.toISOString().split("T")[0]).toISOString(),
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
