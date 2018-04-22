var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
//    morgan      = require('morgan'),
    log         = require('console-log-level')({ level: 'info' }),
    User        = require("./models/user"),
    DB          = require("./public/initDB");

const config    = require("./config/default");

var options = { 
                server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
              };

mongoose.connect(config.DBHost, options);
var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    
// //don't show the log when it is test
// if(config.util.getEnv('NODE_ENV') !== 'test') {
//     //use morgan to log at command line
//     app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
// }

app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use("/", require("./routes/match"));

//use init operation to initialize DB with test data
//DB.initUsers(User, log);
//DB.clearAllUsers(User, log);

app.listen(process.env.PORT, process.env.IP, function(){
   log.info("Spark Matching server has started!");
});

module.exports = app; // for testing