/**
 * Permissions on TrainingModulePages collection
 */

import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'

 TrainingModulePages.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
