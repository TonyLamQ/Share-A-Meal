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

describe('Manage Authentication /api/auth', () => {

    describe('UC-100 Login.',()=> {
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
        it('TC-101-1 When a required input is missing, a valid error should be returned', (done) => {
            chai
            .request(server)
            .post('/api/auth/login')
            .send({
                // missing emailAdress
                password:'Watermelon123!'
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(422);
                results.should.be.a('string').that.equals(results);
                done();
            })
        })

        it('TC-101-2 Input nonExisting email', (done) => {
            chai
            .request(server)
            .post('/api/auth/login')
            .send({
                emailadress:'john@yagoo.coo',
                password:'Watermelon123!'
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(422);
                results.should.be.a('string').that.equals(results);
                done();
            })
        })

        it('TC-101-3 Input wrong password', (done) => {
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
                res.status.should.equals(201);
            chai
            .request(server)
            .post('/api/auth/login')
            .send({
                emailAdress:'J.Nacht@outlook.com',
                password:'secret'
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(200);
                results.should.be.a('string').that.equals("wa");
                done();
            })
        })
    });


    })
})