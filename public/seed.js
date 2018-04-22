var mongoose    = require("mongoose"),
    log         = require('console-log-level')({ level: 'info' }),
    User        = require("../models/user"),
    DB          = require("./initDB");
    
const config    = require("../config/default");

mongoose.connect(config.DBHost);

DB.initUsers(User, log);
