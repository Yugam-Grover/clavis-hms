const Guest = require("../models/guest");
const { catchAsync, AppError } = require("../utils/errorHandlers");

exports.getAllGuests = catchAsync(async (req, res) => {
  const guests = await Guest.find({});
  res.send(guests);
});

exports.getGuest = catchAsync(async (req, res, next) => {
  const guest = await Guest.findById(req.params.id);
  if (!guest) return next(new AppError("guest doesn't exist", 404));
  res.send(guest);
});
