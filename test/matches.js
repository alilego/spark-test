"use strict";

process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user');
let users = require('../filtering_matches/database/matches_test.json');

//dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
let assert = require('assert');

chai.use(chaiHttp);

describe('DB with test data', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
            for (var i = 0, len = users.matches.length; i < len; i++) {
                users.matches[i].geo = [users.matches[i].city.lon, users.matches[i].city.lat];
            }
            User.insertMany(users.matches, function(err, users){
                if(err){
                    console.log(err)
                } else {
                    done();
                }
            });
        });     
    });

    /*
     * Test the / GET route with example entries
     */
    describe('/ GET all matches', () => {
        it('it should GET all matches from the DB', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.to.eql({});
                    res.text.should.to.have.string('http://thecatapi.com/api/images/get?format=src&amp;type=gif');
                    for (var i = 0, len = users.matches.length; i < len; i++) {
                        res.text.should.to.have.string(users.matches[i].display_name + ', ' + users.matches[i].age);
                        res.text.should.to.have.string(users.matches[i].job_title + ' - ' + users.matches[i].city.name);
                        res.text.should.to.have.string(users.matches[i].religion);
                        res.text.should.to.have.string('Match: ' + (users.matches[i].compatibility_score*100));
                    }
                  done();
                });
            });
    });
    
    /*
     * Test the / POST route with example entries
     */
    describe('/ POST to test filtering matches', () => {
        it('it should retrieve matches that have a photo', (done) => {
            let filters = {
                hasPhoto: 'true',
                inContact: 'false',
                favourite: 'false',
                compatibilityScore:{
                    min: 20,
                    max: 99
                },
                age:{
                    min: 18,
                    max: 56
                },
                height:{
                    min: 135,
                    max: 210
                },
                distance: 301
            }
            chai.request(server)
                .post('/')
                .send({filters:filters})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    res.body.users.length.should.be.eql(22);
                    for (var i = 0, len = res.body.users.length; i < len; i++) {
                        res.body.users[i].should.have.property('main_photo');
                        assert(res.body.users[i].compatibility_score >= 0.2, 'compatibility score within limits');
                        assert(res.body.users[i].compatibility_score <= 0.99, 'compatibility score within limits');
                        assert(res.body.users[i].age >= 18, 'age within limits');
                        assert(res.body.users[i].age <= 56, 'age within limits');
                        assert(res.body.users[i].height_in_cm >= 135, 'height within limits');
                        assert(res.body.users[i].height_in_cm <= 210, 'height within limits');
                    }
                  done();
                });
        });
        
        it('it should retrieve matches that exchanged contacts', (done) => {
            let filters = {
                hasPhoto: 'false',
                inContact: 'true',
                favourite: 'false',
                compatibilityScore:{
                    min: 50,
                    max: 99
                },
                age:{
                    min: 18,
                    max: 56
                },
                height:{
                    min: 135,
                    max: 210
                },
                distance: 301
            }
            chai.request(server)
                .post('/')
                .send({filters:filters})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    res.body.users.length.should.be.eql(11);
                    for (var i = 0, len = res.body.users.length; i < len; i++) {
                        assert(res.body.users[i].contacts_exchanged > 0, 'contacts exchanged is positive number');
                        assert(res.body.users[i].compatibility_score >= 0.5, 'compatibility score within limits');
                        assert(res.body.users[i].compatibility_score <= 0.99, 'compatibility score within limits');
                        assert(res.body.users[i].age >= 18, 'age within limits');
                        assert(res.body.users[i].age <= 56, 'age within limits');
                        assert(res.body.users[i].height_in_cm >= 135, 'height within limits');
                        assert(res.body.users[i].height_in_cm <= 210, 'height within limits');
                    }
                  done();
                });
        });
        
        it('it should retrieve matches that are favourites', (done) => {
            let filters = {
                hasPhoto: 'false',
                inContact: 'false',
                favourite: 'true',
                compatibilityScore:{
                    min: 50,
                    max: 99
                },
                age:{
                    min: 18,
                    max: 95
                },
                height:{
                    min: 135,
                    max: 210
                },
                distance: 301
            }
            chai.request(server)
                .post('/')
                .send({filters:filters})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    res.body.users.length.should.be.eql(6);
                    for (var i = 0, len = res.body.users.length; i < len; i++) {
                        assert(res.body.users[i].favourite == true, 'favourite field is true');
                        assert(res.body.users[i].compatibility_score >= 0.5, 'compatibility score within limits');
                        assert(res.body.users[i].compatibility_score <= 0.99, 'compatibility score within limits');
                        assert(res.body.users[i].age >= 18, 'age within limits');
                        assert(res.body.users[i].age <= 56, 'age within limits');
                        assert(res.body.users[i].height_in_cm >= 135, 'height within limits');
                        assert(res.body.users[i].height_in_cm <= 210, 'height within limits');
                    }
                  done();
                });
        });
        
        it('it should retrieve matches within limited range', (done) => {
        //TODO: add proper test for distance
            let filters = {
                hasPhoto: 'false',
                inContact: 'false',
                favourite: 'false',
                compatibilityScore:{
                    min: 50,
                    max: 99
                },
                age:{
                    min: 14,
                    max: 95
                },
                height:{
                    min: 135,
                    max: 210
                },
                distance: 190
            }
            chai.request(server)
                .post('/')
                .send({filters:filters})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    res.body.users.length.should.be.eql(15);
                    for (var i = 0, len = res.body.users.length; i < len; i++) {
                        assert(res.body.users[i].compatibility_score >= 0.5, 'compatibility score within limits');
                        assert(res.body.users[i].compatibility_score <= 0.99, 'compatibility score within limits');
                        assert(res.body.users[i].age >= 14, 'age within limits');
                        assert(res.body.users[i].age <= 56, 'age within limits');
                        assert(res.body.users[i].height_in_cm >= 135, 'height within limits');
                        assert(res.body.users[i].height_in_cm <= 210, 'height within limits');
                        var distance = getDistanceFromLatLonInKm(51.509865, -0.118092, res.body.users[i].city.lat, res.body.users[i].city.lon);
                        assert(distance <= 190, 'distance within range');
                    }
                  done();
                });
        });
        
        it('it should combine search parameters', (done) => {
            let filters = {
                hasPhoto: 'true',
                inContact: 'true',
                favourite: 'false',
                compatibilityScore:{
                    min: 58,
                    max: 94
                },
                age:{
                    min: 18,
                    max: 80
                },
                height:{
                    min: 145,
                    max: 174
                },
                distance: 301
            }
            chai.request(server)
                .post('/')
                .send({filters:filters})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    res.body.users.length.should.be.eql(5);
                    for (var i = 0, len = res.body.users.length; i < len; i++) {
                        res.body.users[i].should.have.property('main_photo');
                        assert(res.body.users[i].contacts_exchanged > 0, 'contacts exchanged is positive number');
                        assert(res.body.users[i].compatibility_score >= 0.58, 'compatibility score within limits');
                        assert(res.body.users[i].compatibility_score <= 0.94, 'compatibility score within limits');
                        assert(res.body.users[i].age >= 18, 'age within limits');
                        assert(res.body.users[i].age <= 80, 'age within limits');
                        assert(res.body.users[i].height_in_cm >= 145, 'height within limits');
                        assert(res.body.users[i].height_in_cm <= 174, 'height within limits');
                    }
                  done();
                });
        });
        
        it('it should extend age, height and distance search with no upper limits', (done) => {
            let filters = {
                hasPhoto: 'false',
                inContact: 'false',
                favourite: 'false',
                compatibilityScore:{
                    min: 10,
                    max: 99
                },
                age:{
                    min: 14,
                    max: 96
                },
                height:{
                    min: 135,
                    max: 211
                },
                distance: 301
            }
            chai.request(server)
                .post('/')
                .send({filters:filters})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('users');
                    res.body.users.should.be.a('array');
                    res.body.users.length.should.be.eql(28);
                    var old, tall, far;
                    for (var i = 0, len = res.body.users.length; i < len; i++) {
                        assert(res.body.users[i].height_in_cm >= 135, 'compatibility score within limits');
                        if(res.body.users[i].age > 95){
                            old = res.body.users[i];
                        }
                        if(res.body.users[i].height_in_cm > 210){
                            tall = res.body.users[i];
                        }
                        if(res.body.users[i].city.lat < 45){
                            far = res.body.users[i];
                        }
                    }
                    old.should.be.a('object');
                    old.display_name.should.be.eql('Oldie');
                    tall.should.be.a('object');
                    tall.display_name.should.be.eql('Tallie');
                    far.should.be.a('object');
                    far.display_name.should.be.eql('Goldie');
                    done();
                });
        });
    });

});

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}