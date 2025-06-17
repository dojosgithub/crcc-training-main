/**
 * TrainingModule  User Logs collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema'

export const TrainingModuleUserLogs = new Mongo.Collection('training_module_user_logs')

TrainingModuleUserLogs.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },  
  uid: {
    type: String,
    optional: true
  },
  firstname: {
    type: String,
    optional: true
  },
  lastname: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  client: {
    type: String,
    optional: true
  },
  bu: {
    type: String,
    optional: true
  }, 
  role: {
    type: String,
    optional: true
  },           
  venue: {
    type: String,
    optional: true
  },
  mid: {
    type: String,
    optional: true
  },
  pid: {
    type: String,
    optional: true
  },  
  page: {
    type: Number,
    optional: true
  },
  msg: {
    type: String,
    optional: true
  },
  ip: {
    type: String,
    optional: true
  },  
  cAt: {
    type: Date,
    optional: true,
    defaultValue: new Date  
  },
  // modifiedAt: {
  //   type: Date,
  //   optional: true,
  //   defaultValue: new Date
  // },  
})

// TrainingModuleUserLogs.attachSchema(TrainingModuleUserLogs.schema)
