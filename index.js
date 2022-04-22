const express = require('express')
const app = express()
const port = 3000

const BodyParser = require('body-parser');
app.use(BodyParser.json());

let database = [];
let id = 0;

app.all('*', (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is called.`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hello World!"
  });
});

app.post('/api/user', (req, res) => {
  let email = req.body.Email;
    if (database.filter((item) => item.Email == email).length > 0) {
        res.status(400).json({
            Status: 400,
            Message: `This email is already taken.`
        })
    }
    else {
  let user = req.body;
  console.log(user);
  id++
  user = {
    id,
    ...user,
  };

  database.push(user);
  console.log(`${user} has been added to the database.`);
  res.status(201).json({
    status: 201,
    result: database,
  });
}});

app.get('/api/user', (req, res) => {
  res.status(200).json({
    status: 200,
    result: database,
  })
})

app.get('/api/user/profile', (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-Point is not realised.",
  })
})

app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId
  let user = database.filter((item) => item.id == userId);
  if (user.length > 0) {
    console.log(user)
    res.status(200).json({
      status: 200,
      result: user,
    })
  }
  else {
    res.status(404).json({
      status: 404,
      result: `User with ID ${userId} not found.`,
    });
  }
});

app.delete('/api/user/:userId', (req, res) => {
  const userId = req.params.userId
  let user = database.filter((item) => item.id == userId);
  if (user.length > 0) {
    console.log(user)
    database.splice(user.indexOf()-1,1);
    res.status(200).json({
      status: 200,
      result: `User with ID ${userId} has been deleted.`,
    })
  } else {
    res.status(404).json({
      status: 404,
      result: `User with ID ${userId} not found.`,
    });
  }
});

app.put('/api/user/:userId', (req, res) => {
  const userId = req.params.userId
  let user = database.filter((item) => item.id == userId);
  if (user.length > 0) {

    console.log(user)
    database.splice(user.indexOf()-1,1);

    let newUser = req.body;
    console.log(newUser);
    newUser = {
      userId,
      ...newUser,
   };
    database.push(newUser);
    console.log(database);

    res.status(200).json({
      status: 200,
      result: `User with ID ${userId} has been updated.`,
    })
  } else {
    res.status(404).json({
      status: 404,
      result: `User with ID ${userId} not found.`,
    });
  }
});

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found.",
  })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}.`)
});