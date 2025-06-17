/**
 * TrainingModules collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema' //-- Npm version of simpl-schema

export const TrainingModules = new Mongo.Collection('training_modules')


TrainingModules.creatorSchema = new SimpleSchema({
  fullname: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  }
})

TrainingModules.coverImageSchema = new SimpleSchema({
  imageId: {
    type: String,
    optional: true
  },
  imageName: {
    type: String,
    optional: true
  }
})

TrainingModules.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },  
  name: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  numPages: {
    type: Number,
    optional: true
  },
  order: {
    type: Number,
    optional: true,
    defaultValue: 0
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
  coverImage: {
    type: TrainingModules.coverImageSchema,
    optional: true
  },
  creator: {
    type: TrainingModules.creatorSchema,
    optional: true
  },
  progressOption: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  duration: {
    type: String,
    optional: true
  },  
  createdAt: {
    type: Date,
    optional: true,
    defaultValue: new Date()    
  },
  modifiedAt: {
    type: Date,
    optional: true,
    defaultValue: new Date()
  },
})

// TrainingModules.attachSchema(TrainingModules.schema)
