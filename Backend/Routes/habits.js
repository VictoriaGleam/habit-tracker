const express = require("express");
const router = express.Router();
const habitsController = require("../Controllers/habitsController");

router.get("/:user_id", habitsController.getHabits);
router.post("/", habitsController.createHabit);
router.put("/:id", habitsController.updateHabit);
router.delete("/:id", habitsController.deleteHabit);

module.exports = router;
