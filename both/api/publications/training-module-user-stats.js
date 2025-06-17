if(Meteor.isServer) {

/**
 * Publication logic on TrainingModule User Stats collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'

Meteor.publish('training_module_user_stats_w_uid', (uid) => {
  check(uid, String)

  return TrainingModuleUserStats.find({
    userId: uid
  })
})

Meteor.publish('training_module_user_stats_w_uids', (uids) => {
  check(uid, Array)

  return TrainingModuleUserStats.find({
    userId: {$in: uids}
  })
})

Meteor.publish('training_module_user_stats_w_uids_n_mids', (obj) => {
  check(obj, Object)

  return TrainingModuleUserStats.find({
    userId: {$in: obj.userIds},
    moduleId: {$in: obj.moduleIds}
  })
})

}
