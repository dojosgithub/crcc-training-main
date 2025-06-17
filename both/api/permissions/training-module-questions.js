/**
 * Permissions on TrainingModule Questions collection
 */

import { TrainingModuleQuestions } from '/both/api/collections/training-module-questions.js'

 TrainingModuleQuestions.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
