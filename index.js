var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    log         = require('console-log-level')({ level: 'debug' }),
    DB          = require("./test/initDB");

mongoose.connect("mongodb://localhost/spark_match");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// SCHEMA SETUP
var userSchema = new mongoose.Schema({
    display_name: String,
    age: String,
    job_title: String,
    height_in_cm: Number,
    city: {
        name: String,
        lat: Number,
        lon: Number
    },
    main_photo: String,
    compatibility_score: Number,
    contacts_exchanged: Number,
    favourite: Boolean,
    religion: String
});

var User = mongoose.model("User", userSchema);

//assumption: this is the logged in user
var currentUser = {
    name: "Vladimir",
    "city": {
        "name": "London",
        "lat": 51.509865,
        "lon": -0.118092
      },
    "religion": "Christian"  
}

//Use this to initialize DB with test data
//DB.initUsers(User, log);

//INDEX - show all matches    
app.get("/", function(req, res){
    // Get all matches from DB
    User.find({}, function(err, allUsers){
        if(err){
            log.error(err);
        } else {
            log.info("Rendering index.js on '/' path");
            res.render("index",{users:allUsers});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Spark Matching server has started!");
});