if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleScores collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleScores } from '/both/api/collections/training-module-scores.js'

Meteor.publish('training_module_scores_by_qz', (obj) => {
  check(obj, Object)

  return TrainingModuleScores.find({
    quizId: obj.quizId,
    userId: obj.userId,
    moduleId: obj.moduleId
  })
})

Meteor.publish('training_module_scores', (obj) => {
  check(obj, Object)

  return TrainingModuleScores.find({
    quizId: obj.quizId,
    questionId: obj.questionId,
    userId: obj.userId,
    moduleId: obj.moduleId
  })
})

}
