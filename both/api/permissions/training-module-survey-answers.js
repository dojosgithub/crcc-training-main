/**
 * Permissions on TrainingModule Survey Answers collection
 */

import { TrainingModuleSurveyAnswers } from '/both/api/collections/training-module-survey-answers.js'

 TrainingModuleSurveyAnswers.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
