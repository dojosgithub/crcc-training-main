/**
 * TrainingModuleSettings collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

export const TrainingModuleSettings = new Mongo.Collection('training_module_settings')

TrainingModuleSettings.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },  
  userId: {
    type: String,
    optional: true
  },
  videoAutoplay: {
    type: Boolean,
    optional: true,
    autoValue: function() {
      if(this.isInsert) {
        return true
      }
    }    
  },
  moduleTheme: {
    type: String,
    optional: true,
    // autoValue: function() {
    //   if(this.isInsert) {
    //     return 'theme_default_left'
    //   }
    // }    
  },  
  videoAlignment: {
    type: String,
    optional: true,   
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
  _set: {
    type: Object,
    optional: true,
    blackbox: true
  },    
})

// TrainingModuleSettings.attachSchema(TrainingModuleSettings.schema)
