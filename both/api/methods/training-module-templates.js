/**
 * New Template form methods
 */
import {Meteor} from 'meteor/meteor';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { check } from 'meteor/check'

// import { Method } from '/imports/api/lib/method.js'

import { TrainingModuleTemplates } from '/both/api/collections/training-module-templates.js'

export const insertTemplate = new ValidatedMethod({
  name: 'insertTemplate',
  // validate: new SimpleSchema(TrainingModuleTemplates.schema).validator({ clean: true, filter: true }),
  validate: ()=>{},
  run(template) {
    check(template, Object)

    template.createdAt = new Date
    template.modifiedAt = new Date
    
    try {
      return TrainingModuleTemplates.insert(template)    
    } catch(e) {     
     return e
    }
  }
})

// export const insertTemplate = new Method('insertTemplate', function(template) {
//   // console.log(template)
//   return TrainingModuleTemplates.insert(template, {validate: true})
// })

export const updateTemplate = new ValidatedMethod({
  name: 'updateTemplate',
  // validate: new SimpleSchema(TrainingModuleTemplates.schema).validator({ clean: true, filter: true }),
  validate: ()=>{},
  run(template) {
    check(template, Object)

    return TrainingModuleTemplates.update(template._id, {
      $set: {
        // name: template.name,
        type: template.type,
        label: template.label,
        systemName: template.systemName,
        description: template.description,
        updatedAt: new Date
      }
    })
  }
})

export const activateTemplate = new ValidatedMethod({
  name: 'activateTemplate',  
  validate: ()=>{},
  run(templateId) {
    check(templateId, String)

    return TrainingModuleTemplates.update(templateId, {
      $set: {
        status: 1,
        modifiedAt: new Date
      }
    })
  }
})

export const deactivateTemplate = new ValidatedMethod({
  name: 'deactivateTemplate',  
  validate: ()=>{},
  run(templateId) {
    check(templateId, String)

    return TrainingModuleTemplates.update(templateId, {
      $set: {
        status: 2,
        modifiedAt: new Date
      }
    })
  }
})

export const deleteTemplate = new ValidatedMethod({
  name: 'deleteTemplate',  
  validate: ()=>{},
  run(template) {
    check(template, Object)

    let systemName = template.systemName + '_' + new Date    

    return TrainingModuleTemplates.update(template._id, {
      $set: {
        status: 4,
        systemName: systemName,
        modifiedAt: new Date
      }
    })
  }
})
