/**
 * Permissions on TrainingModule Settings collection
 */

import { TrainingModuleSettings } from '/both/api/collections/training-module-settings.js'

 TrainingModuleSettings.allow({
  insert: () => true,
  update: () => true,
  remove: () => true
})
