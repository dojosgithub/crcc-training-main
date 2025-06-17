/**
 * Permissions on TrainingModule Logs collection
 */

import { TrainingModuleLogs } from '/both/api/collections/training-module-logs.js'

 TrainingModuleLogs.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
