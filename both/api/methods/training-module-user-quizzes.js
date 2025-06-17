/**
 * Training Module User Quizzes methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

// import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleUserQuizzes } from '/both/api/collections/training-module-user-quizzes.js'

// export const insertQuizzes = new Method('insertQuizzes', function(quiz) {
  
//   return TrainingModuleQuizzes.insert(quiz, {validate: true})
// })

export const updateUserQuiz = new ValidatedMethod({
  name: 'TrainingModuleUserQuizzes.methods.insertUserQuiz',
  // validate: new SimpleSchema(TrainingModuleUserQuizzes.schema).validator(),
  validate: ()=>{},
  run(obj) {
    check(obj, Object)

    // obj.createdAt = new Date
    obj.modifiedAt = new Date
    
    // return TrainingModuleUserQuizzes.insert(obj)
  }
})


