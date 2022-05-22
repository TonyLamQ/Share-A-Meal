const dbConn = require('../../database/dbConnection')
const assert = require('assert');
const jwt = require('jsonwebtoken');
const logger = require('../config/config').logger;
const jwtSecretKey = require('../config/config').jwtSecretKey;

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
                  const { password, ...userInfo } = user
                if(user.password === password) {
                    jwt.sign({ id: userInfo.id }, jwtSecretKey, {expiresIn: '1h'}, function(err, token) {
                        if(err) console.log(err)
                        if(token) {
                            console.log("Token: "+token)
                            res.status(200).json({
                             status:200,
                             results: {...userInfo, token},
                            });
                        }
                    });
                } else {
                    res.status(401).json({
                        status:401,
                        results: "User not found or password invalid",
                       });
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
        const emailRegex = RegExp(
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
          );
          const passwordRegex = RegExp(
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
          );
        try {
            assert (
                typeof req.body.emailAdress === 'string',
                'email must be a string.'
            )
            assert (
                typeof req.body.password === 'string',
                'password must be a string.'
            )
            assert(emailRegex.test(req.body.emailAdress));
            assert(passwordRegex.test(req.body.password));
            next()
        } catch(ex) {
            res.status(422).json({
                status:422,
                results: ex.toString()
            })
        }
        const token = req.header
        console.log(token)
    },

    validateToken(req, res, next) {
        logger.info('validateToken called')
        logger.trace(req.headers)
        // The headers should contain the authorization-field with value 'Bearer [token]'
        const authHeader = req.headers.authorization
        if (!authHeader) {
            logger.warn('Authorization header missing!')
            res.status(401).json({
                error: 'Authorization header missing!',
                datetime: new Date().toISOString(),
            })
        } else {
            // Strip the word 'Bearer ' from the headervalue
            const token = authHeader.substring(7, authHeader.length)

            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {
                    logger.warn('Not authorized')
                    res.status(401).json({
                        error: 'Not authorized',
                        datetime: new Date().toISOString(),
                    })
                }
                if (payload) {
                    logger.debug('token is valid', payload)
                    // User heeft toegang. Voeg UserId uit payload toe aan
                    // request, voor ieder volgend endpoint.
                    req.userId = payload.id
                    next()
                }
            })
        }
    },
};

module.exports = controller;