const router = require("express").Router();
const controller = require("../controllers/trade.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

router.use(authenticateToken);

router.post("/buy", controller.buyStock);
router.post("/sell", controller.sellStock);

module.exports = router;