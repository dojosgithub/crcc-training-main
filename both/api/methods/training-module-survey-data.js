/**
 * Training Module Survey Data methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleSurveyData } from '/both/api/collections/training-module-survey-data.js'

// export const insertData = new Method('insertData', function(data) {
  
//   return TrainingModuleSurveyData.insert(data, {validate: true})
// })

export const updateSurveyStatus = new ValidatedMethod({
  name: 'TrainingModuleSurveyData.methods.updateSurveyStatus',
  // validate: new SimpleSchema(TrainingModuleSurveyData.schema).validator({clean: true, fliter: true}),  
  validate: ()=>{},
  run(data) {
    check(data, Object)
    
    return TrainingModuleSurveyData.update(data._id, {
      $set: {
        status: data.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurvey = new ValidatedMethod({
  name: 'TrainingModuleSurveyData.methods.updateSurvey',
  // validate: new SimpleSchema(TrainingModuleSurveyData.schema).validator(),
  validate: ()=>{},
  run(data) {
    check(data, Object)
        
    return TrainingModuleSurveyData.update(data._id, {
      $set: {
        title: data.title,        
        description: data.description,        
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveySettings = new ValidatedMethod({
  name: 'TrainingModuleSurveyData.methods.updateSurveySettings',
  // validate: new SimpleSchema(TrainingModuleSurveyData.schema).validator(),
  validate: ()=>{},
  run(data) {
    check(data, Object)
        
    data.modifiedAt = new Date
        
    let _settings = data.settings    
    _settings.modifiedAt = new Date

    return TrainingModuleSurveyData.update(data._id, {
      $set: {
        modifiedAt: new Date,
        settings: _settings
      }
    })
  }  
})

export const updateSurveyQuestions = new ValidatedMethod({
  name: 'TrainingModuleSurveyData.methods.updateSurveyQuestions',
  // validate: new SimpleSchema(TrainingModuleSurveyData.schema).validator(),
  validate: ()=>{},
  run(data) {
    check(data, Object)

    return TrainingModuleSurveyData.update(data._id, {
      $set: {
        modifiedAt: new Date,
        questions: data.questions
      }
    })
  }  
})

export const countTotalData = new ValidatedMethod({
  name: 'countTotalData',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleSurveyData.find({status: {$ne:4}}).count()

    return count    
  }  
})

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleSurveyData.methods.countSearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleSurveyData.find({
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
