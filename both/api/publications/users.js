if(Meteor.isServer) {

Meteor.publish('all_users_online', function() {
    return Meteor.users.find({
      _id: {$ne: Meteor.userId()},
      'profle.role': {$ne: '1'},
      'profile.online': true,      
      "profile.status": 1,        
        // heartbeat: {$exists: true}
    });
});

}
