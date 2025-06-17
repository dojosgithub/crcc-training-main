if(Meteor.isServer) {

/**
 * Publication logic on TrainingModule Settings collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleSettings } from '/both/api/collections/training-module-settings.js'

Meteor.publish('all_training_module_settings', () => 
  TrainingModuleSettings.find({
    status: {$ne: 4} //-- Exclude deleted modules
  })
)

Meteor.publish('training_module_settings_w_uid', function(uid) {
  return TrainingModuleSettings.find({
    userId: uid
  })
})

}
