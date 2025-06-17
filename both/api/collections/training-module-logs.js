/**
 * TrainingModule Logs collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema'

export const TrainingModuleLogs = new Mongo.Collection('training_module_logs')

TrainingModuleLogs.schema = new SimpleSchema({
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
  msg: {
    type: String,
    optional: true
  },
  ip: {
    type: String,
    optional: true
  },
  uA: {
    type: String,
    optional: true
  },  
  cAt: {
    type: Date,
    optional: true,
    defaultValue: new Date  
  } 
})

// TrainingModuleLogs.attachSchema(TrainingModuleLogs.schema)
