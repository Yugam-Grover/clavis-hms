const express = require("express");
const auth = require("../middleware/authMiddleware");
const guestController = require("../controllers/guestController");

const router = express.Router();

router.use(auth);

router.get("/", guestController.getAllGuests);
router.get("/:id", guestController.getGuest);

module.exports = router;
