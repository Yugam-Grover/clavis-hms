const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB via Mongoose successfully!"))
  .catch((err) => console.error("Mongoose connection error:", err));
