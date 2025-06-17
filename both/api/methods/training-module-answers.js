/**
 * Training Module Answers methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleAnswers } from '/both/api/collections/training-module-answers.js'

// export const insertAnswers = new Method('insertAnswers', function(answer) {
  
//   return TrainingModuleAnswers.insert(answer, {validate: true})
// })

export const insertAnswer = new ValidatedMethod({
  name: 'TrainingModuleAnswers.methods.insertAnswer',
  // validate: new SimpleSchema(TrainingModuleAnswers.schema).validator(),
  validate: ()=>{},
  run(answer) {
    check(answer, Object)
    
    return TrainingModuleAnswers.insert(answer)
  }
})

export const updateAnswerStatus = new ValidatedMethod({
  name: 'TrainingModuleAnswers.methods.updateAnswerStatus',
  // validate: new SimpleSchema(TrainingModuleAnswers.schema).validator(),
  validate: ()=>{},  
  run(answer) {
    check(answer, Object)
    
    return TrainingModuleAnswers.update(answer._id, {
      $set: {
        status: answer.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateAnswerOrder = new ValidatedMethod({
  name: 'TrainingModuleAnswers.methods.updateAnswerOrder',
  validate: new SimpleSchema(TrainingModuleAnswers.schema).validator(),  
  run(answer) {
    check(answer, Object)
    
    return TrainingModuleAnswers.update(answer._id, {
      $set: {
        order: answer.order,     
        modifiedAt: new Date
      }
    })
  }  
})

export const updateAnswerContent = new ValidatedMethod({
  name: 'TrainingModuleAnswers.methods.updateAnswerContent',
  validate: new SimpleSchema(TrainingModuleAnswers.schema).validator(),  
  run(answer) {
    check(answer, Object)
    
    return TrainingModuleAnswers.update(answer._id, {
      $set: {
        content: answer.content,
        // contentRaw: answer.contentRaw,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateAnswers = new ValidatedMethod({
  name: 'TrainingModuleAnswers.methods.updateAnswers',
  validate: new SimpleSchema(TrainingModuleAnswers.schema).validator({clean: true, fliter: true}),
  // validate: ()=>{},
  run(answer) {
    check(answer, Object)
        
    return TrainingModuleAnswers.update(answer._id, {
      $set: {
        title: answer.title,        
        description: answer.description,
        'answer.src': answer.answer.src,
        modifiedAt: new Date
      }
    })
  }  
})

export const countTotalAnswers = new ValidatedMethod({
  name: 'TrainingModuleAnswers.methods.countTotalAnswers',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleAnswers.find({status: {$ne:4}}).count()

    return count
    
  }  
})

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleAnswers.methods.countSearchResult',  
  validate: null,
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleAnswers.find({
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
