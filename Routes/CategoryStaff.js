const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Rgroup = require("../Database/Modal/Rgroup");
const Staff = require("../Database/Modal/Staff");
const Expenses = require("../Database/Modal/Expenses");


// Define a route to get group-wise staff data and calculate total expenses by category
router.get("/", async (req, res) => {
   const { userId, groupId } = req.query;

  try {
    // Find the group based on the provided groupId
    let group = await Rgroup.find({ groupId, userId });
         group = group[0];
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Find staff members for the specified group
    const staffMembers = await Staff.find({userId, groupId });
console
    // Calculate total expenses by category for this group
    const categoryExpenses = [];
// const GruopByMap = staffMembers.groupBy((item) => item.category);
// console.log("GruopByMap", GruopByMap);

    for (const staff of staffMembers) {
       


        let staffId=staff._id.toString()
        let category = staff.category;
   const staffdataex = await Expenses.find({ staffId, groupId });
let staffEx = {
  totalEx: 0,
  staffname: staff.staffname,
  staffId: staffId,
  CategoryWise: {},
};

let catObj={

}
category.map((item)=>{
    catObj[item]=0
})

staffdataex.map((item)=>{
    if (category.includes(item.category)){
        catObj[item.category] = catObj[item.category] + item.Expense;
    }
     staffEx.totalEx = staffEx.totalEx + item.Expense; 
staffEx.staffname=item.staffname
})
staffEx["CategoryWise"] = catObj;
categoryExpenses.push(staffEx);

    }

    // Send the result to the frontend
    res.status(200).json({
      groupName: group.groupname,
      groupExpenses: categoryExpenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
