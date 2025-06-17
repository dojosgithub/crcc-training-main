if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleSurveyAnswers collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleSurveyAnswers } from '/both/api/collections/training-module-survey-answers.js'

Meteor.publish('all_training_module_survey_answers', () => 
  TrainingModuleSurveyAnswers.find({
    status: {$ne: 4} //-- Exclude deleted answers
  })
)

Meteor.publish('all_active_training_module_survey_answers', () => 
  TrainingModuleSurveyAnswers.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_module_survey_answers', () => 
  TrainingModuleSurveyAnswers.find({
    status: 2
  })
)

Meteor.publish('training_module_survey_answers_w_ids', function publishTrainingModuleSurveyAnswersWIDs(ids) { 
  check(ids, Array)

  return TrainingModuleSurveyAnswers.find({
    status: {$ne: 4}, 
    _id: {$in: ids}
  })
})

Meteor.publish('training_module_survey_answers_w_svid', (svid) => {
  check(svid, String)

  return TrainingModuleSurveyAnswers.find({
    quizId: svid,
    status: {$ne:4}
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish('training_module_survey_answers_w_qid', (qid) => {
  check(qid, String)

  return TrainingModuleSurveyAnswers.find({
    questionId: qid,
    status: {$ne:4}
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish('active_training_module_survey_answers_w_qid', (qid) => {
  check(qid, String)
// console.log(qid)
  return TrainingModuleSurveyAnswers.find({
    questionId: qid,
    status: 1
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish('active_training_module_survey_answers_w_qids', (q) => {
  check(q, Object)
// console.log(qid)
  return TrainingModuleSurveyAnswers.find({
    questionId: {$in: q.qids},
    status: 1
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish('training_module_survey_answer_w_id', (answerId) => {
  check(answerId, String)

  return TrainingModuleSurveyAnswers.find({
    _id: answerId,
    status: 1
  })
})

Meteor.publish('training_module_survey_answers_w_page_limit', function publishTrainingModuleSurveyAnswersWPageLimit(answer) {
  check(answer, Object)

  let page = answer.page
  let limit = answer.limit

  return TrainingModuleSurveyAnswers.find({
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })
})

Meteor.publish('training_module_survey_answers_w_keyword_limit', function publishTrainingModuleSurveyAnswersWKeywordLimit(input) {
  check(input, Object)
  
  let keyword = input.keyword
  let page = input.page
  let limit = input.limit

  let result = TrainingModuleSurveyAnswers.find({
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
