const dbConn = require("../../database/dbConnection");
const assert = require("assert");

let controller = {
  addMeal: (req, res) => {
    res.status(401).json({
      status: 401,
      results: "HOOOIII",
    });
  },
  getMealById: (req, res) => {
    res.status(401).json({
      status: 401,
      results: "HOOOIII",
    });
  },
  updateMeal: (req, res) => {
    res.status(401).json({
      status: 401,
      results: "HOOOIII",
    });
  },
  deleteMeal: (req, res) => {
    res.status(401).json({
      status: 401,
      results: "HOOOIII",
    });
  },
  addMeal: (req, res) => {
    res.status(401).json({
      status: 401,
      results: "HOOOIII",
    });
  },
};

module.exports = controller;
