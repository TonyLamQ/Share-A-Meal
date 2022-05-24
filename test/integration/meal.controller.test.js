process.env.DB_DATABASE = process.env.DB_DATABASE || '2182138-testdb'

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

const assert = require('assert');
require('dotenv').config();
const dbConnection = require('../../database/dbConnection');
const jwt = require('jsonwebtoken')
const { jwtSecretKey, logger } = require('../../src/config/config')

chai.should();
chai.use(chaiHttp);

const CLEAR_DB = 'DELETE IGNORE FROM `meal`; DELETE IGNORE FROM `meal_participants_user`; DELETE IGNORE FROM `user`;'

describe('Manage Meals /api/meal', () => {

    describe('UC-300 Meals.',()=> {
        beforeEach((done) => {
            console.log('before each called');

            dbConnection.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                connection.query(
                    CLEAR_DB,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release()

                        // Handle error after the release.
                        if (error) throw error
                        // Let op dat je done() pas aanroept als de query callback eindigt!
                        console.log('beforeEach done')
                        done()
                    }
                )

            })
        })
        it('TC-301-1 Create meal, Missing field ', (done) => {
            chai
            .request(server)
            .post('/api/meal')
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
            .send({
                // missing name
                description:'Watermelon123!',
                isActive:true,
                isVega:true,
                isToTakeHome:true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'Watermelon123!',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:4
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(400);
                results.should.be.a('string').that.equals(results);
                done();
            })
        })

        it('TC-301-2 Create meal, not Logged in  ', (done) => {
            chai
            .request(server)
            .post('/api/meal')
            .send({
                name: 'Banana',
                description:'Watermelon123!',
                isActive:true,
                isVega:true,
                isToTakeHome:true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'Watermelon123!',
                allergenes:'noten',
                maxAmountOfParticipants:5,
                price:21
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {error, datetime} = res.body;
                error.should.be.an('string').that.equals(error);
                done();
            })
        })

        it('TC-301-3 Create meal, success ', (done) => {
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'J.Nacht@outlook.com'
            })
            .end((err, res)=>{
                const id = res.body.results.id;
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.an('object').that.equals(results);
                chai
                .request(server)
                .post('/api/meal')
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                    name: 'Banana',
                    description:'Its banana',
                    isActive: true,
                    isVega: true,
                    isToTakeHome: true,
                    dateTime:'2022-05-24T10:03:39.054Z',
                    imageUrl:'a',
                    allergenes:'noten',
                    maxAmountOfParticipants:12,
                    price:12
                    
                })
                .end((err, res)=>{
                    res.should.be.an('object');
                    let {status, results} = res.body;
                    status.should.equals(201);
                    results.should.be.a('object').that.equals(results);
                    done();
                })
            })
        })

        it('TC-302-1 Edit meal, Missing fields ', (done) => {
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'J.Nacht@outlook.com'
            })
            .end((err, res)=>{
                const id = res.body.results.id;
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.an('object').that.equals(results);
                chai
                .request(server)
                .post('/api/meal')
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                    name: 'Banana',
                    description:'Its banana',
                    isActive: true,
                    isVega: true,
                    isToTakeHome: true,
                    dateTime:'2022-05-24T10:03:39.054Z',
                    imageUrl:'a',
                    allergenes:'noten',
                    maxAmountOfParticipants:12,
                    price:12
                    
                })
                .end((err, res)=>{
                    res.should.be.an('object');
                    let {status, results} = res.body;
                    status.should.equals(201);
                    results.should.be.a('object').that.equals(results);
                    const mealId = results.mealId
                    chai
                .request(server)
                .put(`/api/meal/${mealId}`)
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                    //missing name D:
                    description:'Its NEWbanana',
                    isActive: true,
                    isVega: true,
                    isToTakeHome: true,
                    dateTime:'2022-05-24T10:03:39.054Z',
                    imageUrl:'a',
                    allergenes:'noten',
                    maxAmountOfParticipants:12,
                    price:12
                    
                })
                .end((err, res)=>{
                    res.should.be.an('object');
                    let {status, results} = res.body;
                    status.should.equals(400);
                    results.should.be.a('string').that.equals(results);
                    done();
                })
                })
            })
        })

        it('TC-302-2 Edit meal, Not logged in ', (done) => {
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'J.Nacht@outlook.com'
            })
            .end((err, res)=>{
                const id = res.body.results.id;
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.an('object').that.equals(results);
                chai
                .request(server)
                .post('/api/meal')
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                    name: 'Banana',
                    description:'Its banana',
                    isActive: true,
                    isVega: true,
                    isToTakeHome: true,
                    dateTime:'2022-05-24T10:03:39.054Z',
                    imageUrl:'a',
                    allergenes:'noten',
                    maxAmountOfParticipants:12,
                    price:13
                    
                })
                .end((err, res)=>{
                    res.should.be.an('object');
                    let {status, results} = res.body;
                    status.should.equals(201);
                    results.should.be.a('object').that.equals(results);
                    const mealId = results.mealId
                    chai
                .request(server)
                .put(`/api/meal/${mealId}`)
                // .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                    name: 'banana',
                    description:'Its NEWbanana',
                    isActive: true,
                    isVega: true,
                    isToTakeHome: true,
                    dateTime:'2022-05-24T10:03:39.054Z',
                    imageUrl:'a',
                    allergenes:'noten',
                    maxAmountOfParticipants:12,
                    price:12
                    
                })
                .end((err, res)=>{
                    res.should.be.an('object');
                    let {error, datetime} = res.body;
                    error.should.be.an('string').that.equals(error);
                    done();
                })
                })
            })
        })

        it('TC-302-3 Edit meal, Not the owner of meal ', (done) => {
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'J.Nacht@outlook.com'
            })
            .end((err, res)=>{
                const userId = res.body.results.id;
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.an('object').that.equals(results);
                chai
                .request(server)
                .post('/api/user')
                .send({
                    firstName: 'Peter',
                    lastName:'Nachtwacht',
                    street:'Lombardijen',
                    city: 'Rotterdam',
                    password:'Watermelon123!',
                    emailAdress:'P.Nacht@gmail.com'
                })
                .end((err, res)=>{
                    const userId2 = res.body.results.id;
                    res.should.be.an('object');
                    let {status, results} = res.body;
                    status.should.equals(201);
                    results.should.be.an('object').that.equals(results);
                chai
                .request(server)
                .post('/api/meal')
                .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
                .send({
                    name: 'Banana',
                    description:'Its banana',
                    isActive: true,
                    isVega: true,
                    isToTakeHome: true,
                    dateTime:'2022-05-24T10:03:39.054Z',
                    imageUrl:'a',
                    allergenes:'noten',
                    maxAmountOfParticipants:12,
                    price:12
                })
                .end((err, res)=>{
                    res.should.be.an('object');
                    let {status, results} = res.body;
                    status.should.equals(201);
                    results.should.be.a('object').that.equals(results);
                    const mealId = res.body.results.mealId;
                    chai
                .request(server)
                .put(`/api/meal/${mealId}`)
                .set("authorization", "Bearer " + jwt.sign({ id: userId2 }, jwtSecretKey))
                .send({
                    name: 'banana',
                    description:'Its NEWbanana',
                    isActive: true,
                    isVega: true,
                    isToTakeHome: true,
                    dateTime:'2022-05-24T10:03:39.054Z',
                    imageUrl:'a',
                    allergenes:'noten',
                    maxAmountOfParticipants:12,
                    price:12
                    
                })
                .end((err, res)=>{
                    res.should.be.an('object');
                    let {status, results} = res.body;
                    status.should.equals(400);
                    results.should.be.a('string').that.equals(results);
                    done();
                })
                })
            })
        })
    });

    it('TC-302-4 Edit meal, Meal is nonexisting ', (done) => {
        chai
        .request(server)
        .post('/api/user')
        .send({
            firstName: 'Jan',
            lastName:'Nachtwacht',
            street:'Lombardijen',
            city: 'Rotterdam',
            password:'Watermelon123!',
            emailAdress:'J.Nacht@outlook.com'
        })
        .end((err, res)=>{
            const id = res.body.results.id;
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(201);
            results.should.be.an('object').that.equals(results);
            chai
            .request(server)
            .post('/api/meal')
            .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
            .send({
                name: 'Banana',
                description:'Its banana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.a('object').that.equals(results);
                const mealId = results.mealId;
                chai
            .request(server)
            .put(`/api/meal/421`)
            .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
            .send({
                name: 'banana',
                description:'Its NEWbanana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(400);
                results.should.be.a('string').that.equals(results);
                done();
            })
            })
        })
    })

    it('TC-302-5 Edit meal, Success ', (done) => {
        chai
        .request(server)
        .post('/api/user')
        .send({
            firstName: 'Jan',
            lastName:'Nachtwacht',
            street:'Lombardijen',
            city: 'Rotterdam',
            password:'Watermelon123!',
            emailAdress:'J.Nacht@outlook.com'
        })
        .end((err, res)=>{
            const userId = res.body.results.id;
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(201);
            results.should.be.an('object').that.equals(results);
            chai
            .request(server)
            .post('/api/meal')
            .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
            .send({
                name: 'Banana',
                description:'Its banana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.a('object').that.equals(results);
                const mealId = res.body.results.mealId;
                chai
            .request(server)
            .put(`/api/meal/${mealId}`)
            .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
            .send({
                name: 'banana',
                description:'Its NEWbanana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(200);
                results.should.be.a('object').that.equals(results);
                done();
            })
            })
        })
    });
    it('TC-303-1 Return List of meals',(done)=>{
        chai
        .request(server)
        .get('/api/meal')
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .send({
        })
        .end((err, res)=>{
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(200);
            results.should.be.an('array').that.equals(results);
            done();
        })
    })

    it('TC-304-1 Return detailMeal, meal is nonexisting',(done)=>{
        chai
        .request(server)
        .get('/api/meal/2')
        .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
        .send({
        })
        .end((err, res)=>{
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(404);
            results.should.be.an('string').that.equals(results);
            done();
        })
    })

    it('TC-304-2 Return detailMeal, Success',(done)=>{
        chai
        .request(server)
        .post('/api/user')
        .send({
            firstName: 'Jan',
            lastName:'Nachtwacht',
            street:'Lombardijen',
            city: 'Rotterdam',
            password:'Watermelon123!',
            emailAdress:'J.Nacht@outlook.com'
        })
        .end((err, res)=>{
            const userId = res.body.results.id;
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(201);
            results.should.be.an('object').that.equals(results);
            chai
            .request(server)
            .post('/api/meal')
            .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
            .send({
                name: 'Banana',
                description:'Its banana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.a('object').that.equals(results);
                const mealId = res.body.results.mealId;
                chai
            .request(server)
            .get(`/api/meal/${mealId}`)
            .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
            .send({
                name: 'Banana',
                description:'Its banana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                // status.should.equals(201);
                results.should.be.a('array').that.equals(results);
                done();
            });
        })
     })
    })

    it('TC-305-2 Delete Meal, Not logged in',(done)=>{
        chai
        .request(server)
        .post('/api/user')
        .send({
            firstName: 'Jan',
            lastName:'Nachtwacht',
            street:'Lombardijen',
            city: 'Rotterdam',
            password:'Watermelon123!',
            emailAdress:'J.Nacht@outlook.com'
        })
        .end((err, res)=>{
            const userId = res.body.results.id;
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(201);
            results.should.be.an('object').that.equals(results);
            chai
            .request(server)
            .post('/api/meal')
            .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
            .send({
                name: 'Banana',
                description:'Its banana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.a('object').that.equals(results);
                const mealId = res.body.results.mealId;
                chai
            .request(server)
            .delete(`/api/meal/${mealId}`)
            // .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
            .send({
                name: 'Banana',
                description:'Its banana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {error, datetime} = res.body;
                error.should.be.an('string').that.equals(error);
                done();
            });
        })
     })
    })

    it('TC-305-3 Delete meal, Not the owner of meal ', (done) => {
        chai
        .request(server)
        .post('/api/user')
        .send({
            firstName: 'Jan',
            lastName:'Nachtwacht',
            street:'Lombardijen',
            city: 'Rotterdam',
            password:'Watermelon123!',
            emailAdress:'J.Nacht@outlook.com'
        })
        .end((err, res)=>{
            const userId = res.body.results.id;
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(201);
            results.should.be.an('object').that.equals(results);
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Peter',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'P.Nacht@gmail.com'
            })
            .end((err, res)=>{
                const userId2 = res.body.results.id;
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.an('object').that.equals(results);
            chai
            .request(server)
            .post('/api/meal')
            .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
            .send({
                name: 'Banana',
                description:'Its banana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.a('object').that.equals(results);
                const mealId = res.body.results.mealId;
                chai
            .request(server)
            .delete(`/api/meal/${mealId}`)
            .set("authorization", "Bearer " + jwt.sign({ id: userId2 }, jwtSecretKey))
            .send({
                name: 'banana',
                description:'Its NEWbanana',
                isActive: true,
                isVega: true,
                isToTakeHome: true,
                dateTime:'2022-05-24T10:03:39.054Z',
                imageUrl:'a',
                allergenes:'noten',
                maxAmountOfParticipants:12,
                price:12
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(403);
                results.should.be.a('string').that.equals(results);
                done();
            })
            })
        })
    })
});

it('TC-305-2 Delete Meal, Not logged in',(done)=>{
    chai
    .request(server)
    .post('/api/user')
    .send({
        firstName: 'Jan',
        lastName:'Nachtwacht',
        street:'Lombardijen',
        city: 'Rotterdam',
        password:'Watermelon123!',
        emailAdress:'J.Nacht@outlook.com'
    })
    .end((err, res)=>{
        const userId = res.body.results.id;
        res.should.be.an('object');
        let {status, results} = res.body;
        status.should.equals(201);
        results.should.be.an('object').that.equals(results);
        chai
        .request(server)
        .post('/api/meal')
        .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
        .send({
            name: 'Banana',
            description:'Its banana',
            isActive: true,
            isVega: true,
            isToTakeHome: true,
            dateTime:'2022-05-24T10:03:39.054Z',
            imageUrl:'a',
            allergenes:'noten',
            maxAmountOfParticipants:12,
            price:12
        })
        .end((err, res)=>{
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(201);
            results.should.be.a('object').that.equals(results);
            const mealId = res.body.results.mealId;
            chai
        .request(server)
        .delete(`/api/meal/${mealId}`)
        .set("authorization", "Bearer " + jwt.sign({ id: userId }, jwtSecretKey))
        .send({
            name: 'Banana',
            description:'Its banana',
            isActive: true,
            isVega: true,
            isToTakeHome: true,
            dateTime:'2022-05-24T10:03:39.054Z',
            imageUrl:'a',
            allergenes:'noten',
            maxAmountOfParticipants:12,
            price:12
        })
        .end((err, res)=>{
            res.should.be.an('object');
            let {status, results} = res.body;
            status.should.equals(200);
            results.should.be.a('string').that.equals(results);
            done();
        });
    })
 })
})

    })
})