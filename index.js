const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const BodyParser = require("body-parser");
app.use(BodyParser.json());

const userRouter = require("./src/routes/user.routes");
const mealRouter = require("./src/routes/meal.routes");

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is called.`);
  next();
});

app.use(userRouter);
app.use(mealRouter);

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    results: "End-point not found.",
  });
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}.`);
});

module.exports = app;
