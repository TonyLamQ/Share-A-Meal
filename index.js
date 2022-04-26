const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const BodyParser = require('body-parser');
app.use(BodyParser.json());
const router = require('./routes/user.routes');

app.all('*', (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is called.`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Welcome to the share-a-meal server"
  });
});

app.use(router);

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found.",
  })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}.`)
});