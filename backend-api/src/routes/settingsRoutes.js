const express = require("express");
const auth = require("../middleware/authMiddleware");
const settingsController = require("../controllers/settingsController");
const router = express.Router();

router.use(auth);

router
  .route("/")
  .get(settingsController.getSetting)
  .patch(settingsController.updateSetting);

module.exports = router;
