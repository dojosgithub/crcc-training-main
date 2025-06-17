if(Meteor.isServer) {

/**
 * Publication logic on TrainingModule Users collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate'

import { TrainingModuleUsers } from '/both/api/collections/training-module-users.js'

Meteor.publish('all_training_module_users', () => 
  TrainingModuleUsers.find({
    status: {$ne: 4} //-- Exclude deleted user-module composites
  })
)

Meteor.publish('active_training_module_users', () => 
  TrainingModuleUsers.find({
    status: 1
  })
)

Meteor.publish('training_module_users_by_uid', (uid) => {
  check(uid, String)

  return TrainingModuleUsers.find({
    userId: uid
  })
})

Meteor.publish('active_training_module_users_by_uid', (uid) => {
  check(uid, String)

  return TrainingModuleUsers.find({
    userId: uid,
    status: 1
  })
})

Meteor.publish('all_module_users_w_modules', function(tableName, ids, fields) {
  check(tableName, String);
  check(ids, Array);
  check(fields, Match.Optional(Object));

  return ReactiveAggregate(this, Meteor.users,[
  {
    $match: {
      _id: {$in: ids},
      'profile.status': {$ne: 4}      
    }
  },
  {
    $lookup: {
      from: "training_module_users",
      localField: "_id",
      foreignField: "userId",
      as: "modules"      
    }
  }
  ])
})

}



