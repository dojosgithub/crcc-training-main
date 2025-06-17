/**
 * Permissions on TrainingModule Scores collection
 */

import { TrainingModuleScores } from '/both/api/collections/training-module-scores.js'

 TrainingModuleScores.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
