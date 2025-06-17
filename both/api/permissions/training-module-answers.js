/**
 * Permissions on TrainingModule Answers collection
 */

import { TrainingModuleAnswers } from '/both/api/collections/training-module-answers.js'

 TrainingModuleAnswers.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
