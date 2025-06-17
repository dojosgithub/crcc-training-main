/**
 * TrainingModules collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

// import { SimpleSchema } from 'meteor/aldeed:simple-schema'

// const SimpleSchema = require('simpl-schema') //-- not working

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

export const TrainingModuleTemplates = new Mongo.Collection('training_module_templates')

// MySchema = {}

TrainingModuleTemplates.creatorSchema = new SimpleSchema({
  fullname: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  }
})

TrainingModuleTemplates.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },  
  type: {
    type: String,
    optional: true
  },
  label: {
    type: String,
    optional: true,
  },
  systemName: {
    type: String,
    optional: true,
    index: true,
    unique: true
  },   
  description: {
    type: String,
    optional: true
  },  
  status: {
    type: Number,
    optional: true,
    autoValue: function() {
      if(this.isInsert) {
        return 2
      }
    }
  },
  creator: {
    type: TrainingModuleTemplates.creatorSchema,
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

// TrainingModuleTemplates.attachSchema(TrainingModuleTemplates.schema)
