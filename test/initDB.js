//TODO: Add test data to local DB: fill it with provided exercise data
exports.initUsers = function (User, log){
    var users = require('../filtering_matches/database/matches.json');
    for (var i = 0, len = users.matches.length; i < len; i++) {
        log.debug(users.matches[i]);
        User.create(users.matches[i], function(err, user){
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