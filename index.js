require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const userRoutes = require("./Routes/users");
const loginRoutes = require("./Routes/login");
const GroupRoutes = require("./Routes/Group");
const StaffRoutes = require("./Routes/Staff");
const ExpensesRoutes = require("./Routes/Expenses");
const StaffLoginRoutes = require("./Routes/StaffLogin");
const FilterExpensesRoutes = require("./Routes/FIlterExpenses");

const cors = require("cors");
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/login", loginRoutes);
app.use("/Group", GroupRoutes);
app.use("/Staff", StaffRoutes);
app.use("/Expenses", ExpensesRoutes);
app.use("/StaffLogin", StaffLoginRoutes);
app.use("/FilterExpenses", FilterExpensesRoutes);



app.listen(PORT, () => {
  // ConnectMongo();

  console.log(`Server is running on port ${PORT}`);
});
