/**
 * Permissions on TrainingModule User Stats collection
 */

import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'

 TrainingModuleUserStats.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
