/**
 * Training Module Questions methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleQuestions } from '/both/api/collections/training-module-questions.js'

// export const insertQuestions = new Method('insertQuestions', function(question) {
  
//   return TrainingModuleQuestions.insert(question, {validate: true})
// })

export const insertQuestion = new ValidatedMethod({
  name: 'TrainingModuleQuestions.methods.insertQuestion',
  // validate: new SimpleSchema(TrainingModuleQuestions.schema).validator(),
  validate: ()=>{},
  run(question) {
    check(question, Object)
    
    return TrainingModuleQuestions.insert(question)
  }
})

export const updateQuestionStatus = new ValidatedMethod({
  name: 'TrainingModuleQuestions.methods.updateQuestionStatus',
  // validate: new SimpleSchema(TrainingModuleQuestions.schema).validator(),  
  validate: ()=>{},
  run(question) {
    check(question, Object)
    
    return TrainingModuleQuestions.update(question._id, {
      $set: {
        status: question.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateQuestionOrder = new ValidatedMethod({
  name: 'TrainingModuleQuestions.methods.updateQuestionOrder',
  // validate: new SimpleSchema(TrainingModuleQuestions.schema).validator(),  
  validate: ()=>{},
  run(question) {
    check(question, Object)
    
    return TrainingModuleQuestions.update(question._id, {
      $set: {
        order: question.order,     
        modifiedAt: new Date
      }
    })
  }  
})

export const updateQuestionContent = new ValidatedMethod({
  name: 'TrainingModuleQuestions.methods.updateQuestionContent',
  // validate: new SimpleSchema(TrainingModuleQuestions.schema).validator(), 
  validate: ()=>{}, 
  run(question) {
    check(question, Object)
    
    return TrainingModuleQuestions.update(question._id, {
      $set: {
        content: question.content,
        contentRaw: question.contentRaw,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateQuestions = new ValidatedMethod({
  name: 'TrainingModuleQuestions.methods.updateQuestions',
  // validate: new SimpleSchema(TrainingModuleQuestions.schema).validator({clean: true, fliter: true}),
  validate: ()=>{},
  // validate: ()=>{},
  run(question) {
    check(question, Object)
        
    return TrainingModuleQuestions.update(question._id, {
      $set: {
        title: question.title,        
        description: question.description,
        'question.src': question.question.src,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateQuestionAnswer = new ValidatedMethod({
  name: 'TrainingModuleQuestions.methods.updateQuestionAnswer',
  // validate: new SimpleSchema(TrainingModuleQuestions.schema).validator(),  
  // validate: null,
  validate: ()=>{},
  run(question) {
    check(question, Object)
    
    return TrainingModuleQuestions.update(question._id, {
      $set: {
        answer: question.answer, 
        modifiedAt: new Date
      },
      // $addToSet: {
      //   answer: {
      //     $each: question.answer
      //   }
      // }
      // $push: {
      //   answer: {
      //     $each: question.answer
      //   }
      // }      
    })
  }  
})

export const countTotalQuestions = new ValidatedMethod({
  name: 'TrainingModuleQuestions.methods.countTotalQuestions',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleQuestions.find({status: {$ne:4}}).count()

    return count
    
  }  
})

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleQuestions.methods.countSearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleQuestions.find({
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
