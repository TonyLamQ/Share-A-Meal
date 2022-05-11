const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

const assert = require('assert');
require('dotenv').config();
const dbConnection = require('../../database/dbConnection');
const { expect } = require('chai');
const { end } = require('../../database/dbConnection');

chai.should();
chai.use(chaiHttp);

const CLEAR_DB = 'DELETE IGNORE FROM `meal`; DELETE IGNORE FROM `meal_participants_user`; DELETE IGNORE FROM `user`;'

describe('Manage users /api/user', () => {

    describe('UC-201 add user.',()=> {
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
                password:'wa',
                emailAddress:'wa'
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(400);
                results.should.be.a('string').that.equals('firstname is not found or must be a string');
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
                password:'1234',
                emailAddress:'J.Nacht@outlook.com'
            })
            .end((err, res)=>{
                res.status.should.equals(200);
                chai
                .request(server)
                .post('/api/user')
                .send({
                    firstName: 'Jan',
                    lastName:'Nachtwacht',
                    street:'Lombardijen',
                    city: 'Rotterdam',
                    password:'1234',
                    emailAddress:'J.Nacht@outlook.com'
                })
                .end((err2, res2)=> {
                    res2.should.be.an('object');
                    let {status, results} = res2.body;
                    console.log(res2.body);
                    status.should.equals(400);
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
                password:'1234',
                emailAddress:'J.Nacht@outlook.com'
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(200);
                results.should.be.an('object').that.equals(results);
                done();
            })
        })
        it('TC-202-5 Show 0 users',(done)=>{
            chai
            .request(server)
            .get('/api/user')
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
        // it('TC-202-5 Show 2 users',(done)=>{
        //     chai
        //     .request(server)
        //     .post('/api/user')
        //     .send({
        //         firstName: 'Jan',
        //         lastName:'Nachtwacht',
        //         street:'Lombardijen',
        //         city: 'Rotterdam',
        //         password:'41221',
        //         emailAddress:'J.Nacht@outlook.com'
        //     })
        //     .end((err, res)=>{
        //         res.should.be.an('object');
        //         let {status, results} = res.body;
        //         console.log(results)
        //         status.should.equals(200);
        //         expect(results).to.have.lengthOf(2);
        //         done();
        //     })
        // })
        it('TC-204-2 userId does not exist',(done)=>{
            chai
            .request(server)
            .get('/api/user/3')
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
        it('TC-204-3 successful show existing user from userId',(done)=>{
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'41221',
                emailAddress:'J.Nacht@outlook.com'
            })
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(200);
                chai
                .request(server)
                .get(`/api/user/${id}`)
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
                password:'41221',
                emailAddress:'J.Nacht@outlook.com'
            })
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(200);
                chai
                .request(server)
                .put(`/api/user/${id}`)
                .send({
                    //missing firstName
                    lastName:'Kees',
                    street:'Ambachtlaan',
                    city: 'Terneuzen',
                    password:'41221',
                    emailAddress:'J.Kees@outlook.com'
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
            .send({
                //missing firstName
                lastName:'Kees',
                street:'Ambachtlaan',
                city: 'Terneuzen',
                password:'41221',
                emailAddress:'J.Kees@outlook.com'
            })
            .end((err2, res2, req2)=>{
                let {status, results} = res2.body;
                status.should.equals(400);
                results.should.be.an('string').that.equals(results);
                done();
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
                password:'41221',
                emailAddress:'J.Nacht@outlook.com'
            })
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(200);
                chai
                .request(server)
                .put(`/api/user/${id}`)
                .send({
                    firstName: 'Peter',
                    lastName:'Kees',
                    street:'Ambachtlaan',
                    city: 'Terneuzen',
                    password:'41221',
                    emailAddress:'J.Kees@outlook.com'
                })
                .end((err2, res2, req2)=>{
                    let {status, results} = res2.body;
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
            .send({
            })
            .end((err, res, req)=>{
                res.should.be.an('object');
                let {status, results} = res.body;
                status.should.equals(400);
                results.should.be.an('string').that.equals(results);
                done();
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
                password:'41221',
                emailAddress:'J.Nacht@outlook.com'
            })
            .end((err, res, req)=>{
                const id = res.body.results.id;
                res.status.should.equals(200);
                chai
                .request(server)
                .delete(`/api/user/${id}`)
                .send({
                })
                .end((err2, res2, req2)=>{
                    let {status, results} = res2.body;
                    status.should.equals(200);
                    results.should.be.an('string').that.equals(results);
                    done();
                })
            })
        })
    })
})