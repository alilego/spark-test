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