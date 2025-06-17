/**
 * Permissions on TrainingModule User Logs collection
 */

import { TrainingModuleUserLogs } from '/both/api/collections/training-module-user-logs.js'

 TrainingModuleUserLogs.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
