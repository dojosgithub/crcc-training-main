/**
 * Permissions on TrainingModules collection
 */

import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js'

 TrainingStatusSummary.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
