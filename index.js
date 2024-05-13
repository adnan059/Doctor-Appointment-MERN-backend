require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

/////////////////////////////////////

const PORT = process.env.PORT || 8080;
const DB_URL = process.env.DB_URL;

/////////////////////////////////////

const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");

/////////////////////////////////////

const app = express();
app.use(express.json());
app.use(cors());

/////////////////////////////////////

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(DB_URL);
    console.log("database connected successfully");
    app.listen(PORT, () => console.log(`server listening to port ${PORT}`));
  } catch (error) {
    console.log("MongoDB Error => ", error);
  }
};

connectDB();
/////////////////////////////////////

app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);

/////////////////////////////////////

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something Went Wrong!";
  const stack = err.stack;
  return res.status(status).json({
    status,
    message,
    stack,
    success: false,
  });
});
