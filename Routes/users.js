const express = require("express");
const router = express.Router();
const User = require('../Database/Modal/user')
const ConnectMongo = require("../Database/conn");
// Create a new user

ConnectMongo();
router.post("/", async (req, res) => {
const { name, email, password } = req.body;
console.log(req.body, "req.body");
try {
  const newUser = new User({
    name,
    email,
    password,
  });

  await newUser.save();
  const response = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };

  res
    .status(200)
    .json({ message: "User registered successfully", data: response });
} catch (error) {
  console.log(error)
  res.status(500).json({ error: "Error registering user" });
}
});

// Get all users
router.get("/", async (req, res) => {
   try {
    
     const users = await User.find();
     res.status(200).json(users);
   } catch (error) {
     res.status(500).json({ error: "Error retrieving users" });
   }
});

module.exports = router;
