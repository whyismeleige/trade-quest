const router = require("express").Router();
const controller = require("../controllers/portfolio.controller");
const { authenticateToken } = require("../middleware/auth.middleware") 

router.use(authenticateToken);

router.get("/", controller.getMyPortfolio);

module.exports = router;