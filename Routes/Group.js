const express = require("express");
const router = express.Router();
const Rgroup = require("../Database/Modal/Rgroup");
const Staff=require("../Database/Modal/Staff")
const ConnectMongo = require("../Database/conn");


ConnectMongo();

router.post("/", async (req, res) => {
 const { groupname, category, userId,password } = req.body;
console.log(req.body, "req.body");
  try {
    const newUser = new Rgroup({
      userId,
      groupname,
      category,
      password
    });

    await newUser.save();
    console.log(newUser, "newUser");


    res
      .status(200)
      .json({ message: "Group registered successfully", data: {"status":200} });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error registering user" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  const { userId } = req.query;

  try {
    // Find posts by userId
    const posts = await Rgroup.find({ userId });
    console.log("posts", posts);
    let data = [];
    if (posts.length > 0) {
      for (const post of posts) {
        const groupId = post._id.toString();
        const staff = await Staff.find({ userId, groupId });
        const postData = {
          group: post,
          staff: staff,
        };
        data.push(postData);
      }

      console.log(posts, "data", data);
      res.status(200).json({ data: posts, allData: data });
    } else {
      res
        .status(404)
        .json({ error: "No posts found for the user", allData: [] });
    }
  } catch (error) {
    res.status(500).json({ error: "Error retrieving posts", allData: [] });
  }
});

router.put("/", async (req, res) => {
 const { id, groupname, password, userId, category } = req.body;
 try {
   // Find the user document based on the unique identifier (e.g., user ID)
   const user = await Rgroup.findById(id);

   if (!user) {
     return res.status(404).json({ error: "User not found" });
   }

   // Update the user document with the new data
   user.groupname = groupname;
   user.password = password;
   user.category = category;

   // Save the updated user document
   await user.save();

   res.status(200).json({ message: "Group updated successfully" });
 } catch (error) {
   res.status(500).json({ error: "Error updating user" });
 }
})
router.delete("/", async (req, res) => {
try {
  const { id, userId } = req.body;

  // Find the group by its ID
  const group = await Rgroup.findById(id);

  // Check if the group exists
  if (!group) {
    return res.status(404).json({ error: "Group not found" });
  }

  // Find and delete associated staff members
  const staffToDelete = await Staff.find({ groupId: id });
  for (const staffMember of staffToDelete) {
    await staffMember.deleteOne();
  }

  // Delete the group
  await group.deleteOne();

  return res
    .status(200)
    .json({ message: "Group and associated staff deleted successfully" });
} catch (error) {
  console.error("Error deleting group and staff:", error);
  return res.status(500).json({ error: "Internal server error" });
}
})

module.exports = router;