const express = require("express");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cabinController = require("../controllers/cabinController");

const router = express.Router();

router.use(auth);

router
  .route("/")
  .get(cabinController.getAllCabins)
  .post(upload.single("image"), cabinController.createCabin);

router
  .route("/:id")
  .patch(upload.single("image"), cabinController.updateCabin)
  .delete(cabinController.deleteCabin);

router.get("/:id/image", cabinController.cabinImage);

module.exports = router;
