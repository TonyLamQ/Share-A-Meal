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
const expect = chai.expect;

const CLEAR_DB = 'DELETE IGNORE FROM `meal`; DELETE IGNORE FROM `meal_participants_user`; DELETE IGNORE FROM `user`;'

describe('Manage users /api/user', () => {

    describe('UC-200 users.',()=> {
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
        it('TC-201-1 When a required input is missing, a valid error should be returned', (done) => {
            chai
            .request(server)
            .post('/api/user')
            .send({
                //firstName is missing
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'J.Nacht@outlook.com'
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(400);
                results.should.be.a('string').that.equals('firstName is not found or must be a string');
                done();
            })
        })
        it('TC-201-2 Input invalid email', (done) => {
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'wowinvalidemail'
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(400);
                results.should.be.a('string').that.equals(results);
                done();
            })
        })
        it('TC-201-3 Input invalid password', (done) => {
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'wowinvalidpassword',
                emailAdress:'J.Nacht@outlook.com'
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(400);
                results.should.be.a('string').that.equals(results);
                done();
            })
        })
        it('TC-201-4 User already exists', (done) => {
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
                console.log("res:"+res);
                console.log("err"+err);
                res.status.should.equals(201);
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
                .end((err2, res2)=> {
                    res2.should.be.an('object');
                    let {status, results} = res2.body;
                    console.log(res2.body);
                    status.should.equals(409);
                    results.should.be.a('string').that.equals(results);
                    done();
                })
            })
        })
        it('TC-201-5 User is successful registered/added',(done)=>{
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
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                results.should.be.an('object').that.equals(results);
                done();
            })
        })
        it('TC-202-1 Show 0 users',(done)=>{
            chai
            .request(server)
            .get('/api/user')
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
        it('TC-202-5 Show 2 users',(done)=>{
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
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'J.Nacht@gmail.com'
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                chai
            .request(server)
            .get('/api/user')
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
            .send({
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(200);
                expect(results).to.have.lengthOf(2);
                done();
            });
            });
            });
        })
        it('TC-202-3 Show users with searchTerm(Nonexisting Name)',(done)=>{
            chai
            .request(server)
            .get('/api/user?name=mari')
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
        it('TC-202-4 Show users with searchTerm(isActive=false)',(done)=>{
            chai
            .request(server)
            .get('/api/user?isActive=false')
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
        it('TC-202-5 Show users with searchTerm(isActive=true)',(done)=>{
            chai
            .request(server)
            .get('/api/user?isActive=true')
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
        it('TC-202-6 Show users with searchTerm(existing name)',(done)=>{
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'Watermelon123!',
                emailAdress:'J.Nacht@gmail.com'
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(201);
                chai
            .request(server)
            .get('/api/user?name=Jan')
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
            .send({
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(200);
                expect(results).to.have.lengthOf(1);
                done();
            });
            });
        })
        it('TC-203-1 Request userProfile Invalid Token',(done)=>{
            chai
            .request(server)
            .get('/api/user/profile')
            .set("authorization", "Bearer ", "IUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjUzMTU5OTc1LCJleHAiOjE2NTMxNjM1NzV9.i52EXRaVl9LvuRjbnnQ")
            .send({
            })
            .end((err, res, req)=>{
                res.should.be.an('object');
                let {error, datetime} = res.body;
                error.should.be.an('string').that.equals(error);
                done();
            })
        })
        it('TC-203-2 Successful show existing userprofile',(done)=>{
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
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(201);
                chai
                .request(server)
                .get(`/api/user/${id}`)
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                })
                .end((err2, res2, req2)=>{
                    let {status, results} = res2.body;
                    status.should.equals(200);
                    results.should.be.an('array').that.equals(results);
                    done();
                })
            })
        })
        it('TC-204-1 getUserDetails, invalid token',(done)=>{
            chai
            .request(server)
            .get('/api/user/3')
            .set("authorization", "Bearer " + "wadswaf")
            .send({
            })
            .end((err, res, req)=>{
                res.should.be.an('object');
                let {error, datetime} = res.body;
                error.should.be.an('string').that.equals(error);
                done();
            })
        })
        it('TC-204-2 GetuserDetails, userId does not exist',(done)=>{
            chai
            .request(server)
            .get('/api/user/3')
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
            .send({
            })
            .end((err, res, req)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(404);
                results.should.be.an('string').that.equals(results);
                done();
            })
        })
        it('TC-204-3 GetUserDetails, successful show existing user from userId',(done)=>{
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
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(201);
                chai
                .request(server)
                .get(`/api/user/${id}`)
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                })
                .end((err2, res2, req2)=>{
                    let {status, results} = res2.body;
                    status.should.equals(200);
                    results.should.be.an('array').that.equals(results);
                    done();
                })
            })
        })
        it('TC-205-1 edit user, missing field',(done)=>{
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
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(201);
                chai
                .request(server)
                .put(`/api/user/${id}`)
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                    //missing firstName
                    lastName:'Kees',
                    street:'Ambachtlaan',
                    city: 'Terneuzen',
                    password:'Watermelon123!',
                    emailAdress:'J.Kees@outlook.com'
                })
                .end((err2, res2, req2)=>{
                    let {status, results} = res2.body;
                    status.should.equals(400);
                    results.should.be.an('string').that.equals(results);
                    done();
                })
            })
        })
        it('TC-205-4 edit user, user does not exist',(done)=>{
            chai
            .request(server)
            .put(`/api/user/2`)
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
            .send({
                firstName: 'Jan',
                lastName:'Kees',
                street:'Ambachtlaan',
                city: 'Terneuzen',
                password:'Watermelon123!',
                emailAdress:'J.Kees@outlook.com'
            })
            .end((err2, res2, req2)=>{
                let {status, results} = res2.body;
                status.should.equals(400);
                results.should.be.an('string').that.equals(results);
                done();
            })
        })
        it('TC-205-6 Edit user, not logged in(=Wrong key?)',(done)=>{
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
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(201);
                chai
                .request(server)
                .put(`/api/user/${id}`)
                .set("authorization", "Bearer " + "Wadsfwafa")
                .send({
                    firstName: 'Peter',
                    lastName:'Kees',
                    street:'Ambachtlaan',
                    city: 'Terneuzen',
                    password:'Watermelon123!',
                    emailAdress:'J.Kees@outlook.com'
                })
                .end((err2, res2, req2)=>{
                    res.should.be.an('object');
                    let {error, datetime} = res2.body;
                    error.should.be.an('string').that.equals(error);
                    done();
                })
            })
        })
        it('TC-205-6 userId is successful edited',(done)=>{
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
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(201);
                chai
                .request(server)
                .put(`/api/user/${id}`)
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                    firstName: 'Peter',
                    lastName:'Kees',
                    street:'Ambachtlaan',
                    city: 'Terneuzen',
                    password:'Watermelon123!',
                    emailAdress:'J.Kees@outlook.com'
                })
                .end((err, res, req)=>{
                    let {status, results} = res.body;
                    status.should.equals(200);
                    results.should.be.an('object').that.equals(results);
                    done();
                })
            })
        })
        it('TC-206-1 deleting, user does not exist',(done)=>{
            chai
            .request(server)
            .delete('/api/user/3')
            .set("authorization", "Bearer " + jwt.sign({ id: 1 }, jwtSecretKey))
            .send({
            })
            .end((err, res, req)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(404);
                results.should.be.an('string').that.equals(results);
                done();
            })
        })
        it('TC-206-2 Delete user, not logged in (=Wrong key?)',(done)=>{
            chai
            .request(server)
            .delete('/api/user/3')
            .set("authorization", "Bearer " + "awdasfwafasf")
            .send({
            })
            .end((err, res, req)=>{
                res.should.be.an('object');
                let {error, datetime} = res.body;
                error.should.be.an('string').that.equals(error);
                done();
            })
        })
        it('TC-206-4 Failed deleting user, not the owner',(done)=>{
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
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(201);
                chai
                .request(server)
                .delete(`/api/user/${id}`)
                .set("authorization", "Bearer " + jwt.sign({ id: 5 }, jwtSecretKey))
                .send({
                })
                .end((err2, res2, req2)=>{
                    let {status, results} = res2.body;
                    status.should.equals(400);
                    results.should.be.an('string').that.equals(results);
                    done();
                })
            })
        })
        it('TC-206-4 successful deleted user',(done)=>{
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
            .end((err, res, req)=>{
                let {status, results} = res.body;
                const id = results.id;
                status.should.equals(201);
                chai
                .request(server)
                .delete(`/api/user/${id}`)
                .set("authorization", "Bearer " + jwt.sign({ id: id }, jwtSecretKey))
                .send({
                })
                .end((err, res, req)=>{
                    let {status, results} = res.body;
                    status.should.equals(200);
                    results.should.be.an('string').that.equals(results);
                    done();
                })
            })
        })

    })
})