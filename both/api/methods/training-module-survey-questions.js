/**
 * Training Module Questions methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleSurveyQuestions } from '/both/api/collections/training-module-survey-questions.js'

// export const insertQuestions = new Method('insertQuestions', function(question) {
  
//   return TrainingModuleSurveyQuestions.insert(question, {validate: true})
// })

export const insertSurveyQuestion = new ValidatedMethod({
  name: 'TrainingModuleSurveyQuestions.methods.insertSurveyQuestion',
  // validate: new SimpleSchema(TrainingModuleSurveyQuestions.schema).validator(),
  validate: ()=>{},
  run(question) {
    check(question, Object)
    
    return TrainingModuleSurveyQuestions.insert(question)
  }
})

export const updateSurveyQuestionStatus = new ValidatedMethod({
  name: 'TrainingModuleSurveyQuestions.methods.updateSurveyQuestionStatus',
  // validate: new SimpleSchema(TrainingModuleSurveyQuestions.schema).validator(),  
  validate: ()=>{},
  run(question) {
    check(question, Object)
    
    return TrainingModuleSurveyQuestions.update(question._id, {
      $set: {
        status: question.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveyQuestionOrder = new ValidatedMethod({
  name: 'TrainingModuleSurveyQuestions.methods.updateSurveyQuestionOrder',
  // validate: new SimpleSchema(TrainingModuleSurveyQuestions.schema).validator(),  
  validate: ()=>{},
  run(question) {
    check(question, Object)
    
    return TrainingModuleSurveyQuestions.update(question._id, {
      $set: {
        order: question.order,     
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveyQuestionContent = new ValidatedMethod({
  name: 'TrainingModuleSurveyQuestions.methods.updateSurveyQuestionContent',
  // validate: new SimpleSchema(TrainingModuleSurveyQuestions.schema).validator(),
  validate: ()=>{},  
  run(question) {
    check(question, Object)
    
    return TrainingModuleSurveyQuestions.update(question._id, {
      $set: {
        content: question.content,
        contentRaw: question.contentRaw,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveyQuestions = new ValidatedMethod({
  name: 'TrainingModuleSurveyQuestions.methods.updateSurveyQuestions',
  // validate: new SimpleSchema(TrainingModuleSurveyQuestions.schema).validator({clean: true, fliter: true}),
  validate: ()=>{},
  run(question) {
    check(question, Object)
        
    return TrainingModuleSurveyQuestions.update(question._id, {
      $set: {
        title: question.title,        
        description: question.description,
        'question.src': question.question.src,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateSurveyQuestionAnswer = new ValidatedMethod({
  name: 'TrainingModuleSurveyQuestions.methods.updateSurveyQuestionAnswer',
  // validate: new SimpleSchema(TrainingModuleSurveyQuestions.schema).validator(),  
  // validate: null,
  validate: ()=>{},
  run(question) {
    check(question, Object)
    
    return TrainingModuleSurveyQuestions.update(question._id, {
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

export const countTotalSurveyQuestions = new ValidatedMethod({
  name: 'TrainingModuleSurveyQuestions.methods.countTotalSurveyQuestions',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleSurveyQuestions.find({status: {$ne:4}}).count()

    return count
    
  }  
})

export const countSurveySearchResult = new ValidatedMethod({
  name: 'TrainingModuleSurveyQuestions.methods.countSurveySearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleSurveyQuestions.find({
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
