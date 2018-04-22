const config    = require("../config/default");

//Add test data to local DB: fill it with provided exercise data
exports.initUsers = function (User, log){
    var users = require('../filtering_matches/database/matches.json');
    User.remove({}, function(err){
        if(err){
            log.error(err);
        } else {
            log.info("REMOVED all users from '" + config.DBHost + "'");
            for (var i = 0, len = users.matches.length; i < len; i++) {
                users.matches[i].geo = [users.matches[i].city.lon, users.matches[i].city.lat];
            }
            User.insertMany(users.matches, function(err, users){
                if(err){
                    console.log(err)
                } else {
                    log.info("Database '" + config.DBHost + "' was successfully INITIALIZED with test data");
                }
            });
        }
    });
}

//Remove all users from local DB
exports.clearAllUsers = function (User, log){
    User.remove({}, function(err){
        if(err){
            log.error(err);
        } else {
            log.info("REMOVED all users from '" + config.DBHost + "'");
        }
    });
}
