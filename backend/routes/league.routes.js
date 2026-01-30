const router = require("express").Router();
const controller = require("../controllers/league.controller");
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.get("/active", controller.getActiveLeagues);
router.get("/:id/leaderboard", controller.getLeaderboard);

module.exports = router;