/**
 * Permissions on TrainingModule Users collection
 */

import { TrainingModuleUsers } from '/both/api/collections/training-module-users.js'

 TrainingModuleUsers.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
