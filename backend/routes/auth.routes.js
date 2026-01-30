const express = require("express");
const controller = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { loginSchema, registerSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", validate(loginSchema), controller.login);
router.post("/register",validate(registerSchema), controller.register);

router.get("/profile", authenticateToken, controller.getProfile)
router.post("/logout", authenticateToken, controller.logout);

module.exports = router;