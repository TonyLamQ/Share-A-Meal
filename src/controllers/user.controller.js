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
    addUser:(req, res, next) => {

      dbConn.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        const firstName = req.body.firstName;
        const lastname = req.body.lastName;
        const emailAddress = req.body.emailAddress;
        const password = req.body.password;
        const street = req.body.street;
        const city = req.body.city;
        connection.query(`INSERT INTO user (firstName, lastName, emailAdress, password, street, city) VALUES ('${firstName}','${lastname}','${emailAddress}','${password}','${street}','${city}')`, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
         // Handle error after the release.
          if (error) {
            const error = {
              status: 404,
              results: `The email: '${emailAddress}' already exists`,           
           }
           next(error);
          } else {
       
          // Don't use the connection here, it has been returned to the pool.
          console.log("Results = ", results.affectedRows);

          if (results.affectedRows == 1){
            res.status(200).json({
              status: 200,
              results: `User has been created.`,
            })
          } else {                   
            const error = {
                status: 404,
                results: `User could not be created.`,           
          }
          next(error);
        }}
          
          
        });
      });
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
      dbConn.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        const userId = Number(req.params.userId)
        // Use the connection
        connection.query(`SELECT * FROM user WHERE id = ${userId}`, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) throw error;
       
          // Don't use the connection here, it has been returned to the pool.
          console.log("Results = ", results.length);
          if (results.length == 1){
            res.status(200).json({
              status: 200,
              results: results
            })
          } else {                   
            const error = {
                status: 404,
                results: `User with ID ${userId} not found.`,           
          }
          next(error);
        }

    
          // pool.end((err) => {
          //   console.log("pool was closed.");
          //   });
          
        });
      });
    },

    deleteUser:(req,res, next)=>{
       dbConn.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        const userId = Number(req.params.userId);
          
        connection.query(`DELETE FROM user WHERE id = ${userId}`, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) throw error;
       
          // Don't use the connection here, it has been returned to the pool.
          console.log("Results = ", results.affectedRows);

          if (results.affectedRows == 1){
            res.status(200).json({
              status: 200,
              results: `User with ID ${userId} has been deleted.`,
            })
          } else {                   
            const error = {
                status: 404,
                results: `User with ID ${userId} not found.`,           
          }
          next(error);
        }
          
        });
      });
    },

    updateUser:(req,res, next)=>{
      dbConn.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        const userId = Number(req.params.userId);
        const firstName = req.body.firstName;
        const lastname = req.body.lastName;
        const emailAddress = req.body.emailAddress;
        const password = req.body.password;
        const street = req.body.street;
        const city = req.body.city;
        connection.query(`UPDATE user SET firstName= '${firstName}', lastName= '${lastname}', emailAdress= '${emailAddress}', password= '${password}', street= '${street}', city= '${city}' WHERE id = '${userId}'`, function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) {
            const error = {
              status: 404,
              results: `The email: '${emailAddress}' already exists`,           
           }
           next(error);
          } else {
       
          // Don't use the connection here, it has been returned to the pool.
          console.log("Results = ", results.affectedRows);

          if (results.affectedRows == 1){
            res.status(200).json({
              status: 200,
              results: `User with ID ${userId} has been updated.`,
            })
          } else {                   
            const error = {
                status: 404,
                results: `User with ID ${userId} not found.`,           
          }
          next(error);
        }}
          
        });
      });
    },

};

module.exports = controller;