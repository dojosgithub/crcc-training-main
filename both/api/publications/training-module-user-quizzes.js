if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleUserQuizzes collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleUserQuizzes } from '/both/api/collections/training-module-user-quizzes.js'

Meteor.publish('training_module_user_quizzes_by_uid_n_qzid', function(obj) {
  check(obj, Object)

  return TrainingModuleUserQuizzes.find({
    userId: obj.userId,
    quizId: obj.quizId
  })
})

}
