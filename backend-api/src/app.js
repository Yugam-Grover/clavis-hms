const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

const errorMiddleware = require("./middleware/errorMiddleware");
const cabinRoutes = require("./routes/cabinRoutes");
const authRoutes = require("./routes/authRoutes");
const guestRoutes = require("./routes/guestRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const { AppError } = require("./utils/errorHandlers");
const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cabins", cabinRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/settings", settingsRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorMiddleware);
module.exports = app;
