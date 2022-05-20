var express = require("express");
var router = express.Router();
const mealController = require("../controllers/meal.controller.js");

router.post("/api/meal", mealController.addMeal);

router.get("/api/meal/:id", mealController.addMeal);

router.put("/api/meal/:id", mealController.addMeal);

router.delete("/api/meal/:id", mealController.addMeal);

module.exports = router;
