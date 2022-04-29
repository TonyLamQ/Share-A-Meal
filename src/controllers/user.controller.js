const dbConn = require('../../database/dbConnection')
const database = require('../../database/inmemdb')
const assert = require('assert');

let controller = {
        ValidateUser:(req, res, next)=>{
            let user = req.body;
            let{firstName, lastName, street, city, password, emailAddress} = user;
            try{
                assert(typeof firstName === 'string', 'firstname is not found or must be a string');
                assert(typeof lastName === 'string', 'lastName is not found or must be a string');
                assert(typeof street === 'string', 'street is not found or must be a string');
                assert(typeof city === 'string', 'city is not found or must be a string');
                assert(typeof password === 'string', 'password is not found or must be a string');
                assert(typeof emailAddress === 'string', 'email is not found or must be a string');
                next();
            } 
            catch(err) {
                const error = {
                    status: 400,
                    result: err.message,
                };
                next(error);
            }
        },
    addUser:(req, res) => {
        let email = req.body.emailAddress;
        if (database.filter((item) => item.emailAddress == email).length > 0) {
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
        }
    },

    getAllUsers:(req,res)=>{  
      dbConn.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query('SELECT * FROM user', function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) throw error;
       
          // Don't use the connection here, it has been returned to the pool.
          console.log("Results = ", results.length);
          res.status(200).json({
            status: 200,
            results: results
          })
    
          // pool.end((err) => {
          //   console.log("pool was closed.");
          //   });
          
        });
      });
    },

    getUserProfile:(req,res)=>{  
        res.status(401).json({
        status: 401,
        result: "End-Point is not realised.",
      })
    },

    getUserById:(req,res, next)=>{
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
            const error = {
                status: 404,
                result: `User with ID ${userId} not found.`,
            }
            next(error);
        }
    },

    deleteUser:(req,res)=>{
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
    },

    updateUser:(req,res)=>{
        const id = Number(req.params.userId)
        let email = req.body.emailAddress;
        let user = database.filter((item) => item.id == id);
      
        if (user.length > 0) {
          if (database.filter((item) => item.emailAddress == email).length > 0) {
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
    },

};

module.exports = controller;