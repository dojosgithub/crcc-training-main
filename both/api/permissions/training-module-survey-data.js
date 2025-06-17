/**
 * Permissions on TrainingModule Survey Data collection
 */

import { TrainingModuleSurveyData } from '/both/api/collections/training-module-survey-data.js'

 TrainingModuleSurveyData.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
