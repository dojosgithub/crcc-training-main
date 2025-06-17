/**
 * Permissions on TrainingModule Surveys collection
 */

import { TrainingModuleSurveys } from '/both/api/collections/training-module-surveys.js'

 TrainingModuleSurveys.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
