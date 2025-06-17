/**
 * TrainingModule Survey Data collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

export const TrainingModuleSurveyData = new Mongo.Collection('training_module_survey_data')

TrainingModuleSurveyData.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  },
  moduleId: {
    type: String,
    optional: true
  },
  surveyId: {
    type: String,
    optional: true
  },
  questionId: {
    type: String,
    optional: true
  },
  answerIds: {
    type: Array,
    optional: true
  },
  'answerIds.$': { //-- This is critical to add/update answer data.
    type: String,
    optional: true
  },
  answer: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Number,
    optional: true,
    // defaultValue: Math.round((new Date()).getTime() / 1000)
    defaultValue: new Date().getTime()
  }
})

// TrainingModuleSurveyData.attachSchema(TrainingModuleSurveyData.schema)

