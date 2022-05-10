const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
let database = [];

chai.should();
chai.use(chaiHttp);

describe('Manage users /api/user', () => {
    describe('UC-201 add user.',()=> {
        beforeEach((done) => {
            database = [];
            done();
        })
        it('TC-201-1 When a required input is missing, a valid error should be returned.', (done) => {
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
                let {status, result} = res.body;
                status.should.equals(400);
                result.should.be.a('string').that.equals('firstname is not found or must be a string');
                done();
            })
        })
        it('TC-201-5 User is successful registered/added.',(done)=>{
            chai
            .request(server)
            .post('/api/user')
            .send({
                firstName: 'Jan',
                lastName:'Nachtwacht',
                street:'Lombardijen',
                city: 'Rotterdam',
                password:'wa',
                emailAddress:'wa'
                
            })
            .end((err, res)=>{
                res.should.be.an('object');
                let {status, result} = res.body;
                status.should.equals(200);
                result.should.be.a('array').that.equals(result);
                done();
            })
        })
    })
})