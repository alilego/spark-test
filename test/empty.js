"use strict";

process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user');

//dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('Empty DB tests', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
          done();         
        });     
    });
 
    /*
     * Test the / GET route with empty DB
     */
    describe('/ GET all matches', () => {
        it('it should GET no matches from the DB', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.to.eql({});
                res.text.should.to.not.have.string('http://thecatapi.com/api/images/get?format=src&amp;type=gif');
              done();
            });
        });
    });
    
    /*
     * Test the / POST route with empty DB
     */
    describe('/ POST to filter matches', () => {
        it('it should retrieve no filtered matches from the DB', (done) => {
        let filters = {
                hasPhoto: true,
                inContact: false,
                favourite: false,
                compatibilityScore:{
                    min: 50,
                    max: 99
                },
                age:{
                    min: 18,
                    max: 50
                },
                height:{
                    min: 135,
                    max: 175
                },
                distance: 300
            }
        chai.request(server)
            .post('/')
            .send({filters:filters})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('users');
                res.body.users.should.be.a('array');
                res.body.users.length.should.be.eql(0);
              done();
            });
        });
    });

});