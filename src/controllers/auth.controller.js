const dbConn = require('../../database/dbConnection')
const assert = require('assert');
const jwt = require('jsonwebtoken');

let controller = {
    login: (req,res,next) =>{
        //assert voor validatie
        const {emailAdress, password} = req.body;

        const queryString = 'SELECT id, firstName, lastName, emailAdress, password FROM user WHERE emailAdress= ?'
        dbConn.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
           
            // Use the connection
            // const firstName = req.body.firstName;
            // const lastname = req.body.lastName;
            // const emailAddress = req.body.emailAddress;
            // const password = req.body.password;
            // const street = req.body.street;
            // const city = req.body.city;
            connection.query(queryString,[emailAdress], function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();
             // Handle error after the release.
              if (error) next (error)
              if (results && results.length === 1) {
                  //There is an user with this emailAddress
                  //check if password is correct
                  console.log(results)
                  const user = results[0]
                if(user.password === password) {
                    console.log('hi');
                    jwt.sign({ id: user.id }, 'process.env.JWT_SECRET', {expiresIn: '1h'}, function(err, token) {
                        if(err) console.log(err)
                        if(token) {
                            console.log(token)
                            res.status(200).json({
                             status:200,
                             results: token,
                            });
                        }
                    });
                } else {
                    console.log('no');
                }

              } else {
                  //er was geen user
                  console.log('user not found')
                  res.status(404).json({
                      status: 404,
                      results: 'email not found.'
                  })
              }

           
              // Don't use the connection here, it has been returned to the pool.
            //   const id = results.insertId
            //   console.log("Results = ", results.affectedRows);
              
            //     const result = { 
            //       id,
            //       ...req.body
            //     }
    
            //   if (results.affectedRows == 1){
            //     res.status(200).json({
            //       status: 200,
            //       results: result,
            //     })
            //   } else {                   
            //     const error = {
            //         status: 404,
            //         results: `User could not be created.`,           
            //   }
            //   next(error);
            // }
              
              
            });
          });
    },

    validate: (req,res,next)=> {
        try {
            assert (
                typeof req.body.emailAdress === 'string',
                'email must be a string.'
            )
            assert (
                typeof req.body.password === 'string',
                'password must be a string.'
            )
            next()
        } catch(ex) {
            res.status(422).json({
                status:422,
                results: ex.toString()
            })
        }
        const token = req.header
        console.log(token)
    }
};

module.exports = controller;