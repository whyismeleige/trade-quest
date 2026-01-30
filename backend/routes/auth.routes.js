const express = require("express");
const controller = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { loginSchema, registerSchema } = require("../validators/auth.validator");

const router = express.Router();

router.post("/login", validate(loginSchema), controller.login);
router.post("/register",validate(registerSchema), controller.register);

// Social Auth Callbacks (Provider redirects here)
router.get("/google/callback", controller.googleCallback);
router.get("/github/callback", controller.githubCallback);

// Exchange Code Route
router.post("/exchange-code", controller.exchangeCode);

router.get("/profile", authenticateToken, controller.getProfile)
router.post("/logout", authenticateToken, controller.logout);

module.exports = router;