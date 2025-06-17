if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleTemplates collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleTemplates } from '/both/api/collections/training-module-templates.js'

Meteor.publish('all_training_module_templates', () => 
  TrainingModuleTemplates.find({
    status: {$ne: 4} //-- Exclude deleted templates
  })
)

Meteor.publish('training_module_templates_w_type', (type) => {
  check(type, String)

  return TrainingModuleTemplates.find({
    type: type,
    status: {$ne: 4} //-- Exclude deleted templates
  })
})

Meteor.publish('active_training_module_templates_w_type', (type) => {
  check(type, String)

  return TrainingModuleTemplates.find({
    type: type,
    status: 1
  })
})

Meteor.publish('all_active_training_module_templates', () => 
  TrainingModuleTemplates.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_module_templates', () => 
  TrainingModuleTemplates.find({
    status: 2
  })
)

Meteor.publish('training_module_template_w_id', (templateId) => {
  check(templateId, String)

  TrainingModuleTemplates.find({
    _id: templateId,
    status: 1
  })
})

}
