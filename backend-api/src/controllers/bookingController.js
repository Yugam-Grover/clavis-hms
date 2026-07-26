const { catchAsync, AppError } = require("../utils/errorHandlers");
const Booking = require("../models/booking");

const PAGE_SIZE = 10;

exports.getAllBookings = catchAsync(async (req, res) => {
  const { status, sortBy, page = 1 } = req.query;

  const filterObj = {};
  let sort = { startDate: -1 };

  if (status && status !== "all") filterObj.status = status;

  if (sortBy) {
    const [field, direction] = sortBy.split("-");

    const allowedFields = [
      "startDate",
      "totalPrice",
      "created_at",
      "createdAt",
    ];

    if (
      allowedFields.includes(field) &&
      (direction === "asc" || direction === "desc")
    ) {
      const sortField = field === "created_at" ? "createdAt" : field;
      sort = { [sortField]: direction === "asc" ? 1 : -1 };
    }
  }

  const skip = (Number(page) - 1) * PAGE_SIZE;

  const total = await Booking.countDocuments(filterObj);

  const bookings = await Booking.find(filterObj)
    .sort(sort)
    .skip(skip)
    .limit(PAGE_SIZE)
    .populate([
      {
        path: "cabin",
        select: "name",
      },
      {
        path: "guest",
        select: "name email nationality countryFlag",
      },
    ]);

  res.json({
    totalCount: total,
    data: { bookings },
  });
});

exports.bookingsAfterDate = catchAsync(async (req, res) => {
  const { date } = req.query;

  const endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);

  const bookings = await Booking.find({
    startDate: {
      $gte: date,
      $lte: endDate,
    },
  }).select("createdAt startDate totalPrice extraPrice");

  res.send(bookings);
});

exports.staysAfterDate = catchAsync(async (req, res) => {
  const { date } = req.query;

  const endDate = new Date();
  endDate.setUTCHours(23, 59, 59, 999);

  const stays = await Booking.find({
    startDate: {
      $gte: date,
      $lte: endDate,
    },
  }).populate({
    path: "guest",
    select: "name",
  });

  res.send(stays);
});

exports.staysTodayActivity = catchAsync(async (req, res) => {
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayEnd = new Date();
  dayEnd.setUTCHours(23, 59, 59, 999);

  const activities = await Booking.find({
    $or: [
      {
        status: "unconfirmed",
        startDate: { $gte: dayStart, $lte: dayEnd },
      },
      {
        status: "checked-in",
        endDate: { $gte: dayStart, $lte: dayEnd },
      },
    ],
  })
    .sort({ createdAt: 1 })
    .populate({
      path: "guest",
      select: "name nationality countryFlag",
    });

  res.send(activities);
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate([
    "cabin",
    "guest",
  ]);
  if (!booking)
    return next(new AppError("No booking found with that ID.", 404));
  res.send(booking);
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "startDate",
    "endDate",
    "numNights",
    "numGuests",
    "cabinPrice",
    "extraPrice",
    "totalPrice",
    "status",
    "hasBreakfast",
    "isPaid",
    "observations",
    "cabin",
    "guest",
  ];

  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update),
  );
  if (!isValidUpdate) return next(new AppError("invalid update!", 400));

  const booking = await Booking.findById(req.params.id);

  if (!booking) return next(new AppError("Booking not found", 404));

  updates.forEach((key) => (booking[key] = req.body[key]));
  await booking.save();
  res.send(booking);
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return next(new AppError("No booking found with that ID", 404));
  res.status(204).json();
});
