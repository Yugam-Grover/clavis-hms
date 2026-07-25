const { catchAsync, AppError } = require("../utils/errorHandlers");
const Booking = require("../models/booking");

const PAGE_SIZE = 10;

exports.getAllBookings = catchAsync(async (req, res) => {
  const { status, sortBy, page = 1 } = req.query;

  const filterObj = {};
  const sort = { startDate: -1 };

  if (status && status !== "all") filterObj.status = status;

  if (sortBy) {
    const [field, direction] = sortBy.split("-");

    const allowedFields = ["startDate", "totalPrice"];

    if (
      allowedFields.includes(field) &&
      (direction === "asc" || direction === "desc")
    ) {
      sort[field] = direction === "asc" ? 1 : -1;
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
    results: bookings.length,
    totalCount: total,
    data: { bookings },
  });
});

// router.get('/stays-after-date', catchAsync(async (req, res)=>{

// }))
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
