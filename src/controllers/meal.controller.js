const dbConn = require("../../database/dbConnection");
const assert = require("assert");

let controller = {
  validateMeal: (req,res, next) => {
    let meal = req.body;
    let{name, description, isActive, isVega, isToTakeHome, dateTime, imageUrl, allergenes, maxAmountOfParticipants, price} = meal;
    try{
        assert(typeof name === 'string', 'name is not found or must be a string');
        assert(typeof description === 'string', 'description is not found or must be a string');
        assert(typeof isActive === 'boolean', 'isActive is not found or must be a boolean');
        assert(typeof isVega === 'boolean', 'isVega is not found or must be a boolean');
        assert(typeof isToTakeHome === 'boolean', 'isToTakeHome is not found or must be a boolean');
        assert(typeof dateTime === 'string', 'dateTime is not found or must be a string');
        assert(typeof imageUrl === 'string', 'imageUrl is not found or must be a string');
        assert(typeof allergenes === 'string', 'allergenes is not found or must be a string');
        assert(typeof maxAmountOfParticipants === 'string', 'maxAmountOfParticipants is not found or must be a string');
        assert(typeof price === 'string', 'price is not found or must be a string');
        next();
    } 
    catch(err) {
        const error = {
            status: 400,
            results: err.message,
        };
        next(error);
    }
  },
  addMeal: (req, res, next) => {
    dbConn.getConnection(function(err, connection) {
      if (err) throw err; // not connected!

      console.log("Logged in UserId: "+req.userId );
     
      // Use the connection
      const name = req.body.name;
      const description =  req.body.description;
      let isActive = req.body.isActive;
      if(isActive){
        isActive = 1;
      } else {
        isActive = 0;
      }
      let isVega = req.body.isVega;
      if(isVega){
        isVega = 1;
      } else {
        isVega = 0;
      }
      let isToTakeHome = req.body.isToTakeHome;
      if(isToTakeHome){
        isToTakeHome = 1;
      } else {
        isToTakeHome = 0;
      }
      let dateTime = req.body.dateTime;
      dateTime = body.dateTime.replace("T", " ").substring(0, 19)
      const imageUrl = req.body.imageUrl;
      const allergenes = req.body.allergenes;
      const maxAmountOfParticipants = req.body.maxAmountOfParticipants;
      const price =req.body.price;

      connection.query(`INSERT INTO meal (name, description, isActive, isVega, isToTakeHome, dateTime, imageUrl, allergenes, maxAmountOfParticipants, price, cookId) VALUES ('${name}','${description}','${isActive}','${isVega}','${isToTakeHome}','${dateTime}','${imageUrl}','${allergenes}','${maxAmountOfParticipants}','${price}','${req.userId}')`, function (error, results, fields) {
       // When done with the connection, release it.
        connection.release();
       // Handle error after the release.
        if (error) throw error;
           //Make foreign key with User and Meal.
           const mealId = results.insertId
      //   // Don't use the connection here, it has been returned to the pool.
        console.log("inserted Id: "+ mealId)
        console.log("Results = ", results.affectedRows);
        
          const result = { 
            mealId,
            ...req.body
          }

        if (results.affectedRows == 1){
          res.status(200).json({
            status: 201,
            results: result,
          })
        } else {                   
          const error = {
              status: 404,
              results: `Meal could not be created.`,           
        }
        next(error);
      };

        
      });
    });
  },
  getAllMeals: (req, res) => {
    dbConn.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
     
      // Use the connection
      connection.query('SELECT * FROM meal', function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
     
        // Handle error after the release.
        if (error) throw error;

      console.log("Results = ", results.length);
      res.status(200).json({
        status: 200,
        results: results,
      });
    });
  });
  },
  getMealById: (req, res, next) => {
    dbConn.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
     
      const mealId = Number(req.params.mealId)
      // Use the connection
      connection.query(`SELECT * FROM meal WHERE id = ${mealId}`, function (error, results, fields) {
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
              results: `Meal with ID ${mealId} not found.`,           
        }
        next(error);
      }  
      });
    });
  },
  updateMeal: (req, res, next) => {
    dbConn.getConnection(function(err, connection) {
      if (err) throw err; // not connected!

      console.log("Logged in UserId: "+req.userId );
     
      // Use the connection
      const mealId = Number(req.params.mealId)
      const name = req.body.name;
      const description =  req.body.description;
      let isActive = req.body.isActive;
      if(isActive){
        isActive = 1;
      } else {
        isActive = 0;
      }
      let isVega = req.body.isVega;
      if(isVega){
        isVega = 1;
      } else {
        isVega = 0;
      }
      let isToTakeHome = req.body.isToTakeHome;
      if(isToTakeHome){
        isToTakeHome = 1;
      } else {
        isToTakeHome = 0;
      }
      const dateTime = req.body.dateTime;
      const imageUrl = req.body.imageUrl;
      const allergenes = req.body.allergenes;
      const maxAmountOfParticipants = req.body.maxAmountOfParticipants;
      const price =req.body.price;
      connection.query(`SELECT * FROM meal WHERE id = '${mealId}' `, function (error, results, fields) {
        if (error || results.length ==0) {
          connection.release();               
          const error = {
              status: 400,
              results: `Meal with ID ${mealId} not found.`,           
        }
        next(error);
        } else {
          console.log("Meal is only accessible for user with id: "+results[0].cookId);
          if(req.userId == results[0].cookId){
            connection.query(`UPDATE meal SET name = '${name}', description = '${description}', isActive = '${isActive}', isVega = '${isVega}', isToTakeHome = '${isToTakeHome}', dateTime = '${dateTime}', imageUrl = '${imageUrl}', allergenes = '${allergenes}', maxAmountOfParticipants = '${maxAmountOfParticipants}', price = '${price}' WHERE id = '${mealId}'`, function (error2, results2, fields2) {
              // When done with the connection, release it.
              connection.release();
           
              // Handle error after the release.
              if (error2) throw error;
           
              // Don't use the connection here, it has been returned to the pool.
              console.log("Results = ", results2.affectedRows);
              const result = { 
                mealId,
                ...req.body
              }
              if (results2.affectedRows == 1){
                res.status(200).json({
                  status: 200,
                  results: result,
                })
              } 
              
            });
          } else {
            connection.release();               
              const error = {
                  status: 400,
                  results: `Meal is only accessible for user with id: `+results[0].cookId + ` Current userId: ${req.userId}`,           
            }
            next(error);
          }
        }
      });
    });
  },
  deleteMeal: (req, res, next) => {
    dbConn.getConnection(function(err, connection) {
      if (err) throw err; // not connected!

      console.log("Logged in UserId: "+req.userId );
     
      // Use the connection
      const mealId = Number(req.params.mealId)

      connection.query(`SELECT * FROM meal WHERE id = '${mealId}' `, function (error, results, fields) {

        connection.release();    
        if (error) throw error;
        console.log(results.length)
        if(results.length == 0){
          const error = {
              status: 404,
              results: `Meal with ID ${mealId} not found.`,           
        }
        next(error);
        } else {
          console.log("Meal is only accessible for user with id: "+results[0].cookId);

          if(req.userId == results[0].cookId){
            connection.query(`DELETE FROM meal WHERE id = '${mealId}'`, function (error2, results2, fields2) {
              // When done with the connection, release it.
              connection.release();
           
              // Handle error after the release.
              if (error2) throw error;
           
              // Don't use the connection here, it has been returned to the pool.
              console.log("Results = ", results2.affectedRows);
              if (results2.affectedRows == 1){
                res.status(200).json({
                  status: 200,
                  results: `Meal with id ${mealId} is successful deleted`,
                })
              } 
              
            });
          } else {
            connection.release();               
              const error = {
                  status: 403,
                  results: `Meal is only accessible for user with id: `+results[0].cookId + ` Current userId: ${req.userId}`,           
            }
            next(error);
          }
        }

      });
    });
  },

};

module.exports = controller;
