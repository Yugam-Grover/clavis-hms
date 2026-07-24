const express = require("express");
const router = express.Router();
const Cabin = require("../models/cabin");
const { catchAsync, AppError } = require("../utils/errorHandlers");
const auth = require("../middleware/authMiddleware");

router.use(auth);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const cabins = await Cabin.find();
    res.send(cabins);
  }),
);

router.post(
  "/",
  catchAsync(async (req, res) => {
    const cabin = new Cabin(req.body);
    await cabin.save();
    res.status(201).send(cabin);
  }),
);

router.patch(
  "/:id",
  catchAsync(async (req, res, next) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "name",
      "maxCapacity",
      "regularPrice",
      "discount",
      "description",
      "image",
    ];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update),
    );
    if (!isValidUpdate) return next(new AppError("invalid update!", 400));

    const cabin = await Cabin.findById(req.params.id);
    if (!cabin) return next(new AppError("No cabin found with that ID", 404));
    updates.forEach((key) => (cabin[key] = req.body[key]));
    await cabin.save();
    res.send(cabin);
  }),
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const cabin = await Cabin.findByIdAndDelete(req.params.id);
    if (!cabin) {
      return next(new AppError("No cabin found with that ID to delete", 404));
    }
    res.status(204).json({ status: "success" });
  }),
);
module.exports = router;
