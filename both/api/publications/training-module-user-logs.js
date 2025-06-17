if(Meteor.isServer) {

/**
 * Publication logic on TrainingModule User Logs collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleUserLogs } from '/both/api/collections/training-module-user-logs.js'

Meteor.publish('training_module_user_logs_w_uid', (uid) => {
  check(uid, String)

  return TrainingModuleUserLogs.find({
    userId: uid
  })
})

}

