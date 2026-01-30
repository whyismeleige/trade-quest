const router = require("express").Router();
const controller = require("../controllers/stocks.controller");
const { authenticateToken } = require("../middleware/auth.middleware")

router.use(authenticateToken);

router.get("/search", controller.searchStocks);
router.get("/:symbol/history", controller.getStockHistory);
router.get("/:symbol", controller.getStockDetails);

module.exports = router;