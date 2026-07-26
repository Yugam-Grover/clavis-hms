const express = require("express");
const auth = require("../middleware/authMiddleware");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.use(auth);

router.get("/", bookingController.getAllBookings);
router.get("/bookings-after-date", bookingController.bookingsAfterDate);
router.get("/stays-after-date", bookingController.staysAfterDate);
router.get("/stays-today-activity", bookingController.staysTodayActivity);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
