const express = require("express");

const Setting = require("../models/settings");
const { catchAsync, AppError } = require("../utils/errorHandlers");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(auth);

router.get(
  "/",
  catchAsync(async (req, res) => {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting();
      await setting.save();
    }
    res.send(setting);
  }),
);

router.patch(
  "/",
  catchAsync(async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "minBookingLength",
      "maxBookingLength",
      "maxGuestsPerBooking",
      "breakfastPrice",
    ];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) return next(new AppError("invalid update!", 400));

    const setting = await Setting.findOne();

    if (!setting)
      return next(
        new AppError(
          "Settings not found. Please load the settings page first to initialize them.",
          404,
        ),
      );

    updates.forEach((key) => (setting[key] = req.body[key]));
    await setting.save();
    res.send(setting);
  }),
);
module.exports = router;
