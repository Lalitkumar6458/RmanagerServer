const express = require("express");
const router = express.Router();
const Expenses = require("../Database/Modal/Expenses");

const ConnectMongo = require("../Database/conn");

ConnectMongo();

router.post("/", async (req, res) => {
 const { groupname, category, userId, password } = req.body;
 console.log(req.body, "req.body");
 try {
   const newUser = new Expenses(req.body);

   await newUser.save();
   console.log(newUser, "newUser");
   res
     .status(200)
     .json({ message: "post registered successfully", data: { status: 200 } });
 } catch (error) {
   console.log(error);
   res.status(500).json({ error: "Error registering user" });
 }
})
router.get("/", async (req, res) => {
  console.log("req.query", req.query);
  const { userId, groupId, staffId } = req.query;
  console.log("groupId", groupId);
  const newDate = new Date();
      let startDate = new Date(
        newDate.toISOString().split("T")[0].split("-")[0] +
          "-" +
          newDate.toISOString().split("T")[0].split("-")[1] +
          "-" +
          "01"
      );
      let endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );
      endDate.setHours(23, 59, 59, 999);
  try {
    // Find posts by userId
    let Expense = [];
    let TotalAmount=0
    if (staffId == "null") {
      Expense = await Expenses.find({ userId, groupId }).sort({ date: -1 }).limit(10);
      

      TotalAmount = await Expenses.find({
        userId,
        groupId,
        date: {
          $gte: new Date(startDate.toISOString().split("T")[0]).toISOString(),
          $lte: new Date(endDate.toISOString().split("T")[0]).toISOString(),
        },
      }).sort({ date: -1 });
    } else {
      Expense = await Expenses.find({ userId, groupId, staffId }).sort({ date: -1 });
      TotalAmount = await Expenses.find({
        userId,
        groupId,
        staffId,
        date: {
          $gte: new Date(startDate.toISOString().split("T")[0]).toISOString(),
          $lte: new Date(endDate.toISOString().split("T")[0]).toISOString(),
        },
      }).sort({
        date: -1,
      });

    }
     
    const totalStaff = await Expenses.find({ userId, groupId, staffId }).sort({
      date: -1,
    });


    if (Expense.length > 0) {
      const totalExpenseAmount = TotalAmount.reduce(
        (total, post) => total + post.Expense,
        0
      );
      console.log("totalExpenseAmount", totalExpenseAmount);
      res
        .status(200)
        .json({ data: Expense, totalExpenseGroupAmount: totalExpenseAmount });
    } else {
      res.status(404).json({ error: "No posts found for the user", data: [] });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts", data: [] });
  }

});
router.put("/", async (req, res) => {
    const { id, Expense, date, staffname, category, node } = req.body;
    try {
      // Find the user document based on the unique identifier (e.g., user ID)
      const user = await Expenses.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Update the user document with the new data
      user.Expense = Expense;
      user.date = date;
      user.category = category;
      user.node = node;

      // Save the updated user document
      await user.save();
      res.status(200).json({ message: "Staff updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error updating user" });
    }
});
router.delete("/", async (req, res) => {
     try {
       const { id, userId } = req.body;

       // Find the group by its ID
       const group = await Expenses.findById(id);

       // Check if the group exists
       if (!group) {
         return res.status(404).json({ error: "Group not found" });
       }
       await group.deleteOne();

       return res
         .status(200)
         .json({ message: "Expenses deleted successfully" });
     } catch (error) {
       console.error("Error deleting Expenses and staff:", error);
       return res.status(500).json({ error: "Internal server error" });
     }
});

module.exports = router;

