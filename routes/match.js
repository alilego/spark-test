var express         = require("express");
var router          = express.Router();
var log             = require('console-log-level')({ level: 'info' });
var User            = require("../models/user");

const MIN_AGE = 18;
const MAX_AGE = 95;
const MIN_HEIGHT = 135;
const MAX_HEIGHT = 210;
const MAX_DISTANCE = 300;

//assumption: this is the logged in user
const currentUser = {
    name: "Vladimir",
    city: {
        "name": "London",
        "lat": 51.509865,
        "lon": -0.118092
      },
    religion: "Christian"  
};

//show all matches    
router.get("/", function(req, res){
    // Get all matches from DB
    User.find({}, function(err, allUsers){
        if(err){
            log.error(err);
        } else {
            log.debug("Rendering index.ejs (all users) on '/' path");
            res.render("index", {users:allUsers});
        }
    });
});

//filter matches based on provided filters
router.post('/', function(req, res){
	log.debug("'/' POST request");
	log.debug('Filters:');
	log.debug(req.body.filters);
	
	//send query to mongoDB
	User.
        find(buildQuery(req.body.filters)).
        limit(100).
        sort({ compatibility_score: -1 }).
        exec(function(err, allUsers){
            if(err){
                log.error(err);
                res.send({});
            } else {
                log.info("Returning filtered users");
                log.debug(allUsers);
                res.send({users:allUsers});
            }
        });
});

function buildQuery(filters){
	var query = {
	    compatibility_score: { $gte: Number(filters.compatibilityScore.min/100), $lte: Number(filters.compatibilityScore.max/100) }
	};
	
	if(filters.favourite == 'true'){
	    query.favourite = true;
	}
	if(filters.hasPhoto == 'true'){
	    query.main_photo = { $exists: true };
	}
	if(filters.inContact == 'true'){
	    query.contacts_exchanged = { $gt: 0 };
	}
	if(Number(filters.age.max) > MAX_AGE){
	    query.age = { $gte: Number(filters.age.min)};
	} else {
	    query.age = { $gte: Number(filters.age.min), $lte: Number(filters.age.max) };
	}
	if(Number(filters.height.max) > MAX_HEIGHT){
	    query.height_in_cm = { $gte: Number(filters.height.min)};
	} else {
	    query.height_in_cm = { $gte: Number(filters.height.min), $lte: Number(filters.height.max) };
	}
	var distance = Number(filters.distance);
	if(distance <= MAX_DISTANCE){
	    var coords = [currentUser.city.lon, currentUser.city.lat];
	    query.geo = {
	        $nearSphere: coords,
	        $maxDistance: distance/6371          
	    };
	}
	
	log.debug('DB query:');
	log.debug(query);
	
	return query;
}

module.exports = router;