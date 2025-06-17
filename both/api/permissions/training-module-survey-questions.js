/**
 * Permissions on TrainingModule SurveyQuestions collection
 */

import { TrainingModuleSurveyQuestions } from '/both/api/collections/training-module-survey-questions.js'

 TrainingModuleSurveyQuestions.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
