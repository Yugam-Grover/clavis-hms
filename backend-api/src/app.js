const express = require("express");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/errorMiddleware");
const cabinRoutes = require("./routes/cabinRoutes");
const authRoutes = require("./routes/authRoutes");
const guestRoutes = require("./routes/guestRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cabins", cabinRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/settings", settingsRoutes);

app.use(errorMiddleware);
module.exports = app;
