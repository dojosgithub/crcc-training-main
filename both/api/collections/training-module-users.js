/**
 * Training Module Users collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema'

export const TrainingModuleUsers = new Mongo.Collection('training_module_users')

// TrainingModuleUsers.clientSchema = new SimpleSchema({
//   clientId: {
//     type: String
//   },
//   clientName: {
//     type: String
//   },
//   buId: {
//     type: String
//   }
// })

TrainingModuleUsers.schema = new SimpleSchema({
  userId: {
    type: String,
    optional: true
  },
  moduleId: {
    type: String,
    optional: true
  },
  status: {
    type: Number,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true,
    defaultValue: new Date  
  },
  modifiedAt: {
    type: Date,
    optional: true,
    defaultValue: new Date
  },  
})

// TrainingModuleUsers.attachSchema(TrainingModuleUsers.schema)
