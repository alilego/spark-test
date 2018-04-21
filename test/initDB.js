//TODO: Add test data to local DB: fill it with provided exercise data
exports.initUsers = function (User, log){
    var users = require('../filtering_matches/database/matches.json');
    for (var i = 0, len = users.matches.length; i < len; i++) {
        var user = users.matches[i];
        user.geo = [users.matches[i].city.lon, users.matches[i].city.lat];
        log.debug(user);
        User.create(user, function(err, user){
            if(err){
                log.error("ERROR while ADDING NEW USER:");
                log.error(user);
                log.error(err);
            } else {
                log.debug("NEW USER ADDED: ");
                log.debug(user);
            }
        });
    }
}

//Remove all users from local DB
exports.clearAllUsers = function (User, log){
    User.remove({}, function(err){
        if(err){
            log.error(err);
        } else {
            log.info("REMOVED ALL USERS!");
        }
    });
}
