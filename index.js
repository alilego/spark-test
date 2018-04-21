var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    log         = require('console-log-level')({ level: 'debug' }),
    User        = require("./models/user"),
    DB          = require("./test/initDB");

const MIN_AGE = 18;
const MAX_AGE = 95;
const MIN_HEIGHT = 135;
const MAX_HEIGHT = 210;
const MAX_DISTANCE = 300;

mongoose.connect("mongodb://localhost/spark_match");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//assumption: this is the logged in user
const currentUser = {
    name: "Vladimir",
    city: {
        "name": "London",
        "lat": 51.509865,
        "lon": -0.118092
      },
    religion: "Christian"  
}

//DB.initUsers(User, log);
//DB.clearAllUsers(User, log);

//INDEX - show all matches    
app.get("/", function(req, res){
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

app.post('/', function(req, res){
	log.debug("'/' POST request");
	log.debug('Filters:');
	log.debug(req.body.filters);
	
	//build query based on provided filters
	var query = {
	    compatibility_score: { $gte: Number(req.body.filters.compatibilityScore.min/100), $lte: Number(req.body.filters.compatibilityScore.max/100) },
	    age: { $gte: Number(req.body.filters.age.min), $lte: Number(req.body.filters.age.max) },
	    height_in_cm: { $gte: Number(req.body.filters.height.min), $lte: Number(req.body.filters.height.max) },
	};
	
	if(req.body.filters.favourite == 'true'){
	    query.favourite = true;
	}
	if(req.body.filters.hasPhoto == 'true'){
	    query.main_photo = { $exists: true };
	}
	if(req.body.filters.inContact == 'true'){
	    query.contacts_exchanged = { $gt: 0 };
	}
	var distance = Number(req.body.filters.distance);
	if(distance <= MAX_DISTANCE){
	    var coords = [currentUser.city.lon, currentUser.city.lat];
	    query.geo = {
	        $nearSphere: coords,
	        $maxDistance: distance/6371          
	    }
	}
	
	log.debug('DB query:');
	log.debug(query);

	User.
        find(query).
        limit(100).
        sort({ compatibility_score: -1 }).
        exec(function(err, allUsers){
            if(err){
                log.error(err);
            } else {
                log.info("Returning filtered users");
                log.debug(allUsers);
                res.send({users:allUsers});
            }
        });
	
	//res.send({});
});

app.listen(process.env.PORT, process.env.IP, function(){
   log.info("Spark Matching server has started!");
});