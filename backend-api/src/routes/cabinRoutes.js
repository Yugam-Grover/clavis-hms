const express = require("express");
const sharp = require("sharp");
const Cabin = require("../models/cabin");
const { catchAsync, AppError } = require("../utils/errorHandlers");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(auth);

router.get(
  "/",
  catchAsync(async (req, res) => {
    const { filter, sortBy } = req.query;

    const filterObj = {};
    const sort = {};

    if (filter && filter !== "all") {
      if (filter === "no-discount") {
        filterObj.discount = 0;
      }
      if (filter === "with-discount") {
        filterObj.discount = { $gt: 0 };
      }
    }

    if (sortBy) {
      const [field, direction] = sortBy.split("-");

      const allowedFields = ["name", "regularPrice", "maxCapacity"];

      if (
        allowedFields.includes(field) &&
        (direction === "asc" || direction === "desc")
      ) {
        sort[field] = direction === "asc" ? 1 : -1;
      }
    }

    const cabins = await Cabin.find(filterObj).sort(sort);
    res.send(cabins);
  }),
);

router.post(
  "/",
  upload.single("image"),
  catchAsync(async (req, res) => {
    let cabin;
    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 256, height: 256 })
        .png()
        .toBuffer();
      cabin = new Cabin({ ...req.body, image: buffer });
    } else {
      cabin = new Cabin(req.body);
    }

    await cabin.save();
    res.status(201).send(cabin);
  }),
);

router.patch(
  "/:id",
  upload.single("image"),
  catchAsync(async (req, res, next) => {
    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 256, height: 256 })
        .png()
        .toBuffer();
      req.body.image = buffer;
    }

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

router.get(
  "/:id/image",
  catchAsync(async (req, res, next) => {
    const cabin = await Cabin.findById(req.params.id);

    if (!cabin || !cabin.image)
      return next(new AppError("No image found for this cabin", 404));

    res.set("Content-Type", "image/png");
    res.send(cabin.image);
  }),
);
