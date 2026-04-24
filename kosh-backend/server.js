const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
require("dotenv").config();


app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("KOSH backend is running 🚀");
});
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


const Expense = require("./models/Expense");



app.post("/expenses", async (req, res) => {
  try {
    let newExpense = new Expense(req.body);
    await newExpense.save();
    res.json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/expenses", async (req, res) => {
  try {
    let data = await Expense.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const authMiddleware = require("./middleware/authMiddleware");

app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    msg: "Welcome to KOSH Dashboard 🔐",
    user: req.user
  });
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});