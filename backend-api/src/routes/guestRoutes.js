const express = require("express");

const Guest = require("../models/guest");
const { catchAsync, AppError } = require("../utils/errorHandlers");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(auth);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const guests = await Guest.find({});
    res.send(guests);
  }),
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const guest = await Guest.findById(req.params.id);
    if (!guest) return next(new AppError("guest doesn't exist", 404));
    res.send(guest);
  }),
);

module.exports = router;
