if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleSurveyQuestions collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleSurveyQuestions } from '/both/api/collections/training-module-survey-questions.js'

Meteor.publish('all_training_module_survey_questions', () => 
  TrainingModuleSurveyQuestions.find({
    status: {$ne: 4} //-- Exclude deleted survey_questions
  })
)

Meteor.publish('all_active_training_module_survey_questions', () => 
  TrainingModuleSurveyQuestions.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_module_survey_questions', () => 
  TrainingModuleSurveyQuestions.find({
    status: 2
  })
)

Meteor.publish('training_module_survey_questions_w_ids', function publishTrainingModuleSurveyQuestionsWIDs(ids) { 
  check(ids, Array)

  return TrainingModuleSurveyQuestions.find({
    status: {$ne: 4}, 
    _id: {$in: ids}
  })
})

Meteor.publish('training_module_survey_questions_w_svid', (svid) => {
  check(svid, String)

  return TrainingModuleSurveyQuestions.find({
    surveyId: svid,
    status: {$ne:4}
  }, {
    sort: {
      order: 1
    }
  })
})


Meteor.publish('training_module_survey_question_w_id', (questionId) => {
  check(questionId, String)

  return TrainingModuleSurveyQuestions.find({
    _id: questionId,
    status: 1
  })
})

Meteor.publish('training_module_survey_questions_w_page_limit', function publishTrainingModuleSurveyQuestionsWPageLimit(question) {
  check(question, Object)

  let page = question.page
  let limit = question.limit

  return TrainingModuleSurveyQuestions.find({
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })
})

Meteor.publish('training_module_survey_questions_w_keyword_limit', function publishTrainingModuleSurveyQuestionsWKeywordLimit(input) {
  check(input, Object)
  
  let keyword = input.keyword
  let page = input.page
  let limit = input.limit

  let result = TrainingModuleSurveyQuestions.find({
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
