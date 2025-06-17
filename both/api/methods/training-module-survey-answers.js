/**
 * Training Module Survey Answers methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleSurveyAnswers } from '/both/api/collections/training-module-survey-answers.js'

// export const insertAnswers = new Method('insertAnswers', function(answer) {
  
//   return TrainingModuleSurveyAnswers.insert(answer, {validate: true})
// })

export const insertSurveyAnswer = new ValidatedMethod({
  name: 'TrainingModuleSurveyAnswers.methods.insertSurveyAnswer',
  // validate: new SimpleSchema(TrainingModuleSurveyAnswers.schema).validator(),
  validate: ()=>{},
  run(answer) {
    check(answer, Object)
    
    return TrainingModuleSurveyAnswers.insert(answer)
  }
})

export const updateSurveyAnswerStatus = new ValidatedMethod({
  name: 'TrainingModuleSurveyAnswers.methods.updateSurveyAnswerStatus',
  // validate: new SimpleSchema(TrainingModuleSurveyAnswers.schema).validator(),  
  validate: ()=>{},
  run(answer) {
    check(answer, Object)
    
    return TrainingModuleSurveyAnswers.update(answer._id, {
      $set: {
        status: answer.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveyAnswerOrder = new ValidatedMethod({
  name: 'TrainingModuleSurveyAnswers.methods.updateSurveyAnswerOrder',
  // validate: new SimpleSchema(TrainingModuleSurveyAnswers.schema).validator(),
  validate: ()=>{},  
  run(answer) {
    check(answer, Object)
    
    return TrainingModuleSurveyAnswers.update(answer._id, {
      $set: {
        order: answer.order,     
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveyAnswerContent = new ValidatedMethod({
  name: 'TrainingModuleSurveyAnswers.methods.updateSurveyAnswerContent',
  // validate: new SimpleSchema(TrainingModuleSurveyAnswers.schema).validator(), 
  validate: ()=>{}, 
  run(answer) {
    check(answer, Object)
    
    return TrainingModuleSurveyAnswers.update(answer._id, {
      $set: {
        content: answer.content,
        // contentRaw: answer.contentRaw,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveyAnswers = new ValidatedMethod({
  name: 'TrainingModuleSurveyAnswers.methods.updateSurveyAnswers',
  // validate: new SimpleSchema(TrainingModuleSurveyAnswers.schema).validator({clean: true, fliter: true}),
  validate: ()=>{},
  run(answer) {
    check(answer, Object)
        
    return TrainingModuleSurveyAnswers.update(answer._id, {
      $set: {
        title: answer.title,        
        description: answer.description,
        'answer.src': answer.answer.src,
        modifiedAt: new Date
      }
    })
  }  
})

export const countTotalSurveyAnswers = new ValidatedMethod({
  name: 'TrainingModuleSurveyAnswers.methods.countTotalSurveyAnswers',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleSurveyAnswers.find({status: {$ne:4}}).count()

    return count
    
  }  
})

export const countSurveySearchResult = new ValidatedMethod({
  name: 'TrainingModuleSurveyAnswers.methods.countSurveySearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleSurveyAnswers.find({
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
