/**
 * Permissions on TrainingModules collection
 */

import { TrainingModules } from '/both/api/collections/training-modules.js'

 TrainingModules.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
