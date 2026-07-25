const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/authMiddleware");
const { catchAsync, AppError } = require("../utils/errorHandlers");
const upload = require("../middleware/uploadMiddleware");
const sharp = require("sharp");

const router = express.Router();

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    data: { user },
  });
};

router.post(
  "/signup",
  auth,
  catchAsync(async (req, res, next) => {
    if (req.user.role !== "admin")
      return next(new AppError("Only admins can create new users.", 403));

    const { fullName, email, password } = req.body;
    const user = new User({ fullName, email, password, role: "staff" });
    await user.save();

    sendTokenResponse(user, 201, res);
  }),
);

router.post(
  "/login",
  catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("please provide email and password", 400));
    }
    const user = await User.findByCredentials(email, password);
    sendTokenResponse(user, 200, res);
  }),
);

router.get(
  "/me",
  auth,
  catchAsync(async (req, res) => {
    res.send(req.user);
  }),
);

router.patch(
  "/update-me",
  auth,
  upload.single("avatar"),
  catchAsync(async (req, res, next) => {
    if (req.file) {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 256, height: 256 })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ["fullName", "password", "avatar"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update),
    );

    if (!isValidUpdate) return next(new AppError("invalid update!", 400));

    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  }),
);

router.post(
  "/logout",
  catchAsync(async (req, res) => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).send({ status: "success" });
  }),
);

router.get(
  "/:id/avatar",
  auth,
  catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar)
      return next(new AppError("No avatar found", 404));

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  }),
);
module.exports = router;
