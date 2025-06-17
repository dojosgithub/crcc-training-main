if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleAnswers collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleAnswers } from '/both/api/collections/training-module-answers.js'

Meteor.publish('all_training_module_answers', () => 
  TrainingModuleAnswers.find({
    status: {$ne: 4} //-- Exclude deleted answers
  })
)

Meteor.publish('all_active_training_module_answers', () => 
  TrainingModuleAnswers.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_module_answers', () => 
  TrainingModuleAnswers.find({
    status: 2
  })
)

Meteor.publish('training_module_answers_w_ids', function publishTrainingModuleAnswersWIDs(ids) { 
  check(ids, Array)

  return TrainingModuleAnswers.find({
    status: {$ne: 4}, 
    _id: {$in: ids}
  })
})

Meteor.publish('training_module_answers_w_qzid', (qzid) => {
  check(qzid, String)

  return TrainingModuleAnswers.find({
    quizId: qzid,
    status: {$ne:4}
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish('training_module_answers_w_qid', (qid) => {
  check(qid, String)

  return TrainingModuleAnswers.find({
    questionId: qid,
    status: {$ne:4}
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish('active_training_module_answers_w_qid', (qid) => {
  check(qid, String)
// console.log(qid)
  return TrainingModuleAnswers.find({
    questionId: qid,
    status: 1
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish('active_training_module_answers_w_qids', (q) => {
  check(q, Object)
// console.log(qid)
  return TrainingModuleAnswers.find({
    questionId: {$in: q.qids},
    status: 1
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish('training_module_answer_w_id', (answerId) => {
  check(answerId, String)

  return TrainingModuleAnswers.find({
    _id: answerId,
    status: 1
  })
})

Meteor.publish('training_module_answers_w_page_limit', function publishTrainingModuleAnswersWPageLimit(answer) {
  check(answer, Object)

  let page = answer.page
  let limit = answer.limit

  return TrainingModuleAnswers.find({
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })
})

Meteor.publish('training_module_answers_w_keyword_limit', function publishTrainingModuleAnswersWKeywordLimit(input) {
  check(input, Object)
  
  let keyword = input.keyword
  let page = input.page
  let limit = input.limit

  let result = TrainingModuleAnswers.find({
    $or: [
      {title: {$regex: new RegExp(keyword, 'i')}},
      {description: {$regex: new RegExp(keyword, 'i')}}      
    ],      
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })

  return result
}) 

}
