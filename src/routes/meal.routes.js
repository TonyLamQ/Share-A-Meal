var express = require("express");
var router = express.Router();
const mealController = require("../controllers/meal.controller.js");
const authController = require("../controllers/auth.controller.js");

router.post("/api/meal", authController.validateToken, mealController.validateMeal, mealController.addMeal);

router.get("/api/meal", mealController.getAllMeals);

router.get("/api/meal/:mealId", mealController.getMealById);

router.put("/api/meal/:mealId",  authController.validateToken, mealController.validateMeal, mealController.updateMeal);

router.delete("/api/meal/:mealId",authController.validateToken, mealController.validateMeal, mealController.deleteMeal);

module.exports = router;
