if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleQuestions collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleQuestions } from '/both/api/collections/training-module-questions.js'

Meteor.publish('all_training_module_questions', () => 
  TrainingModuleQuestions.find({
    status: {$ne: 4} //-- Exclude deleted questions
  })
)

Meteor.publish('all_active_training_module_questions', () => 
  TrainingModuleQuestions.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_module_questions', () => 
  TrainingModuleQuestions.find({
    status: 2
  })
)

Meteor.publish('training_module_questions_w_ids', function publishTrainingModuleQuestionsWIDs(ids) { 
  check(ids, Array)

  return TrainingModuleQuestions.find({
    status: {$ne: 4}, 
    _id: {$in: ids}
  })
})

Meteor.publish('training_module_questions_w_qzid', (qzid) => {
  check(qzid, String)

  return TrainingModuleQuestions.find({
    quizId: qzid,
    status: {$ne:4}
  }, {
    sort: {
      order: 1
    }
  })
})


Meteor.publish('training_module_question_w_id', (questionId) => {
  check(questionId, String)

  return TrainingModuleQuestions.find({
    _id: questionId,
    status: 1
  })
})

Meteor.publish('training_module_questions_w_page_limit', function publishTrainingModuleQuestionsWPageLimit(question) {
  check(question, Object)

  let page = question.page
  let limit = question.limit

  return TrainingModuleQuestions.find({
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })
})

Meteor.publish('training_module_questions_w_keyword_limit', function publishTrainingModuleQuestionsWKeywordLimit(input) {
  check(input, Object)
  
  let keyword = input.keyword
  let page = input.page
  let limit = input.limit

  let result = TrainingModuleQuestions.find({
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
