if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleSurveyData collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleSurveyData } from '/both/api/collections/training-module-survey-data.js'

Meteor.publish('training_module_survey_data', (obj) => {
  check(obj, Object)

  return TrainingModuleSurveyData.find({
    surveyId: obj.surveyId,
    questionId: obj.questionId,
    userId: obj.userId,
    moduleId: obj.moduleId
  })
})

}
