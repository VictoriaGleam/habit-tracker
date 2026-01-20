const express = require("express");
const router = express.Router();
const habitlogController = require("../Controllers/habitlogController");

router.get("/:habit_id", habitlogController.getHistory);
router.get("/:habit_id/:date", habitlogController.getLogForDate);
router.post("/", habitlogController.markDone);

module.exports = router;
