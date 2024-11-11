require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./src/Router/Auth");
const app = express();
const cors = require("cors");


app.use(cors());
app.use (express.json());
app.use("/api/v1/auth", router);

// Route middleware
// app.get("/api/v1/", (req, res) => {
//   res.send("API is running");
// });

// Connect to MongoDB
const mongoApiConnect = process.env.mongoURL;

let PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    const conn = await mongoose.connect(mongoApiConnect);
    console.log("Connected to MongoDB");
    if (conn) {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.log(error);
  }
};
start();
