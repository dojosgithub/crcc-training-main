/**
 * Training Module Surveys methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleSurveys } from '/both/api/collections/training-module-surveys.js'

// export const insertSurveys = new Method('insertSurveys', function(survey) {
  
//   return TrainingModuleSurveys.insert(survey, {validate: true})
// })

export const insertSurvey = new ValidatedMethod({
  name: 'TrainingModuleSurveys.methods.insertSurvey',
  // validate: new SimpleSchema(TrainingModuleSurveys.schema).validator(),
  validate: ()=>{},
  run(survey) {
    check(survey, Object)

    // survey.createdAt = new Date
    // survey.modifiedAt = new Date
    
    return TrainingModuleSurveys.insert(survey)
  }
})

export const updateSurveyStatus = new ValidatedMethod({
  name: 'TrainingModuleSurveys.methods.updateSurveyStatus',
  // validate: new SimpleSchema(TrainingModuleSurveys.schema).validator({clean: true, fliter: true}),
  validate: ()=>{},  
  run(survey) {
    check(survey, Object)
    
    return TrainingModuleSurveys.update(survey._id, {
      $set: {
        status: survey.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurvey = new ValidatedMethod({
  name: 'TrainingModuleSurveys.methods.updateSurvey',
  // validate: new SimpleSchema(TrainingModuleSurveys.schema).validator(),
  validate: ()=>{},
  run(survey) {
    check(survey, Object)
        
    return TrainingModuleSurveys.update(survey._id, {
      $set: {
        title: survey.title,        
        description: survey.description,        
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveySettings = new ValidatedMethod({
  name: 'TrainingModuleSurveys.methods.updateSurveySettings',
  // validate: new SimpleSchema(TrainingModuleSurveys.schema).validator(),
  validate: ()=>{},
  run(survey) {
    check(survey, Object)
        
    survey.modifiedAt = new Date
        
    let _settings = survey.settings    
    _settings.modifiedAt = new Date

    return TrainingModuleSurveys.update(survey._id, {
      $set: {
        modifiedAt: new Date,
        settings: _settings
      }
    })
  }  
})

export const updateSurveyQuestionCount = new ValidatedMethod({
  name: 'TrainingModuleSurveys.methods.updateSurveyQuestionCount',
  // validate: new SimpleSchema(TrainingModuleSurveys.schema).validator(),
  validate: ()=>{},
  run(survey) {
    check(survey, Object)

    return TrainingModuleSurveys.update(survey._id, {
      $set: {
        modifiedAt: new Date,
        questions: survey.questions
      }
    })
  }  
})

export const countTotalSurveys = new ValidatedMethod({
  name: 'countTotalSurveys',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleSurveys.find({status: {$ne:4}}).count()

    return count
    
  }  
})

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleSurveys.methods.countSearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleSurveys.find({
      $or: [
        {label: {$regex: new RegExp(keyword, 'i')}},
        {description: {$regex: new RegExp(keyword, 'i')}},        
      ],      
      status: {$ne: 4}
    })

    let count = result.count()

    return count
  }  
})
