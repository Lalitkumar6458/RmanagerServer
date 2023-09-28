const express = require("express");
const router = express.Router();
const Rgroup = require("../Database/Modal/Rgroup");
const ConnectMongo = require("../Database/conn");
const Staff = require("../Database/Modal/Staff");
const nodemailer = require("nodemailer");
const fs = require("fs"); 
ConnectMongo();

router.post("/", async (req, res) => {
 const { staffemail } = req.body;

 const apppass = "nsaqtlxtwmzzpbep";
 const email = "lalitkumar6458@gmail.com";
 try {
   const newUser = new Staff(req.body);
   await newUser.save();

   const group = await Rgroup.findById(newUser.groupId);
   const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
       user: email,
       pass: apppass,
     },
   });
   const mailOptions = {
     from: "lalitkumar6458@gmail.com",
     to: staffemail,
     subject: `Welcome to the Expense Management Portal for ${group.groupname}`,
     html: ` <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f7f7f7;
    }
    .header {
      background-color: #007bff;
      color: #fff;
      padding: 10px 0;
      text-align: center;
    }
    .group-details {
      margin-top: 20px;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    .login-link {
      display: block;
      margin-top: 20px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Expense Management Portal</h1>
    </div>
    <div class="group-details">
      <h2>Group Information</h2>
      <p>Group Name: ${group.groupname}</p>
      <p>Group Password: ${group.password}</p>
      <p>Your Email: ${staffemail}</p>
    </div>
    <div class="login-link">
      <h3>Login to Your Account</h3>
      <p>Use the provided group name and password to log in to the Expense Management Portal.</p>
      <a href="https://rmanager.vercel.app/">Access the Portal</a>
    </div>
    <div class="message">
      <p>Start managing your expenses with ease. Simply log in, add your expenses, and stay on top of your finances.</p>
    </div>
  </div>
</body>
</html>
`,
   };

   try {
     const info = await transporter.sendMail(mailOptions);
     console.log("Email sent:", info.response);
     res
       .status(200)
       .json({ message: "Email sent successfully. and save successfully" });
   } catch (error) {
     console.error("Error:", error);
     res
       .status(500)
       .json({ error: "An error occurred while sending the email." });
   }
 } catch (error) {
   console.log(error);
   res.status(500).json({ error: "Error registering user" });
 }
})
  router.get("/", async (req, res) => {
        const { userId, groupId } = req.query;
        console.log("groupId", groupId);
        try {
          // Find posts by userId
          const posts = await Staff.find({ userId, groupId });

          if (posts.length > 0) {
            res.status(200).json({ data: posts });
          } else {
            res
              .status(404)
              .json({ error: "No posts found for the user", data: [] });
          }
        } catch (error) {
          res.status(500).json({ error: "Error retrieving posts", data: [] });
        }
  });
router.put("/", async (req, res) => {
     const { id, groupId, userId, staffname, category, staffemail } = req.body;
     try {
       // Find the user document based on the unique identifier (e.g., user ID)
       const user = await Staff.findById(id);
       if (!user) {
         return res.status(404).json({ error: "User not found" });
       }
       // Update the user document with the new data
       user.staffname = staffname;
       user.staffemail = staffemail;
       user.category = category;
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
       const group = await Staff.findById(id);

       // Check if the group exists
       if (!group) {
         return res.status(404).json({ error: "Group not found" });
       }
       await group.deleteOne();

       return res.status(200).json({ message: "staff deleted successfully" });
     } catch (error) {
       console.error("Error deleting group and staff:", error);
       return res.status(500).json({ error: "Internal server error" });
     }
});


module.exports = router;