const express = require("express");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/:id/avatar", authController.avatar);

router.use(auth);

router.post("/signup", authController.signup);
router.get("/me", authController.getMe);
router.patch("/update-me", upload.single("avatar"), authController.updateMe);

module.exports = router;
