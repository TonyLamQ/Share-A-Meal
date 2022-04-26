var express = require('express');
var router = express.Router();

let database = [];
let id = 0;

//Post an user if email isnt already taken
router.post('/api/user', (req, res) => {
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
  console.log(`User has been added to the database.`);
  res.status(201).json({
    status: 201,
    result: database,
  });
}});

//Get a all users
router.get('/api/user', (req, res) => {
  res.status(200).json({
    status: 200,
    result: database,
  })
})

//Get a user profile(endpoint not realised yet)
router.get('/api/user/profile', (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-Point is not realised.",
  })
})

//Get specific user by id
router.get('/api/user/:userId', (req, res) => {
  const userId = Number(req.params.userId)
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

//Delete a user by id
router.delete('/api/user/:userId', (req, res) => {
  const userId = Number(req.params.userId)
  //check if id is in database
  let user = database.filter((item) => item.id == userId);
  if (user.length > 0) {

    //check the index of userId
    var index = database.map(x => {
      return x.id;
    }).indexOf(userId);

    //Remove the id from array
    console.log("INDEX OF "+index)
    database.splice(index, 1);
    console.log(database);

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

router.put('/api/user/:userId', (req, res) => {
  const id = Number(req.params.userId)
  let email = req.body.Email;
  let user = database.filter((item) => item.id == id);

  if (user.length > 0) {
    if (database.filter((item) => item.Email == email).length > 0) {
        res.status(400).json({
            Status: 400,
            Message: `This email is already taken.`
        })
    } else {
      var index = database.map(x => {
        return x.id;
      }).indexOf(id);
  
      console.log("INDEX OF "+index)
      database.splice(index, 1);
      console.log(database);

      let newUser = req.body;
      console.log(newUser);
      newUser = {
        id,
        ...newUser,
     };
      database.push(newUser);
      console.log(database);
      res.status(200).json({
        status: 200,
        result: `User with ID ${id} has been updated.`,
      })
    }
  } else {
    res.status(404).json({
      status: 404,
      result: `User with ID ${id} not found.`,
    });
  }
});

module.exports = router;
