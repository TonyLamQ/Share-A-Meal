const express = require('express')
require('dotenv').config();

const app = express()
const port = process.env.PORT

const BodyParser = require('body-parser');
app.use(BodyParser.json());

const router = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes')

app.all('*', (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is called.`);
  next();
});

app.use(router);
app.use('/api', authRoutes)

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    results: "End-point not found.",
  })
})

//error handler
// app.use((err, req, res, next) => {
//   console.log('ERROR HANDLER: ' + err.toString())
//   res.status(500).json({
//     status:500,
//     results: err.toString(),
//   });
// })
app.use((err, req, res, next) => {
  console.log("Error handler")
  res.status(err.status).json(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}.`)
});

module.exports = app;