/**
 * Permissions on TrainingModule Quizzes collection
 */

import { TrainingModuleQuizzes } from '/both/api/collections/training-module-quizzes.js'

 TrainingModuleQuizzes.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
