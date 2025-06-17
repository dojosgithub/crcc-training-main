/**
 * TrainingModule Quiz Questions  collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

// import { SimpleSchema } from 'meteor/aldeed:simple-schema'

// const SimpleSchema = require('simpl-schema') //-- not working

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

export const TrainingModuleQuestions = new Mongo.Collection('training_module_questions')

TrainingModuleQuestions.creatorSchema = new SimpleSchema({
  fullname: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  }
})

TrainingModuleQuestions.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },  
  content: {
    type: String,
    optional: true
  },
  contentRaw: {
    type: String,
    optional: true
  },  
  description: {
    type: String,
    optional: true
  },
  quizId: {
    type: String,
    optional: true
  },
  answer: {
    type: Array,
    optional: true,
    blackbox: true
  }, 
  'answer.$': { //-- This is critical to add/update answer data.
    type: String,
    optional: true
  },
  // questions: {
  //   type: Number,
  //   optional: true
  // },   
  order: {
    type: Number,
    optional: true,
    defaultValue: 998
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
    type: TrainingModuleQuestions.creatorSchema,
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

// TrainingModuleQuestions.attachSchema(TrainingModuleQuestions.schema)
