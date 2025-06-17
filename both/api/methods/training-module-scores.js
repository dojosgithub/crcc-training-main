/**
 * Training Module Scores methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleScores } from '/both/api/collections/training-module-scores.js'

// export const insertScores = new Method('insertScores', function(score) {
  
//   return TrainingModuleScores.insert(score, {validate: true})
// })

export const insertQuiz = new ValidatedMethod({
  name: 'TrainingModuleScores.methods.insertQuiz',
  // validate: new SimpleSchema(TrainingModuleScores.schema).validator(),
  validate: ()=>{},
  run(score) {
    check(score, Object)

    // score.createdAt = new Date
    // score.modifiedAt = new Date
    
    return TrainingModuleScores.insert(score)
  }
})

export const updateQuizStatus = new ValidatedMethod({
  name: 'TrainingModuleScores.methods.updateQuizStatus',
  // validate: new SimpleSchema(TrainingModuleScores.schema).validator({clean: true, fliter: true}),  
  validate: ()=>{},
  run(score) {
    check(score, Object)
    
    return TrainingModuleScores.update(score._id, {
      $set: {
        status: score.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateQuiz = new ValidatedMethod({
  name: 'TrainingModuleScores.methods.updateQuiz',
  // validate: new SimpleSchema(TrainingModuleScores.schema).validator(),
  validate: ()=>{},
  run(score) {
    check(score, Object)
        
    return TrainingModuleScores.update(score._id, {
      $set: {
        title: score.title,        
        description: score.description,        
        modifiedAt: new Date
      }
    })
  }  
})

export const updateQuizSettings = new ValidatedMethod({
  name: 'TrainingModuleScores.methods.updateQuizSettings',
  // validate: new SimpleSchema(TrainingModuleScores.schema).validator(),
  validate: ()=>{},
  run(score) {
    check(score, Object)
        
    score.modifiedAt = new Date
        
    let _settings = score.settings    
    _settings.modifiedAt = new Date

    return TrainingModuleScores.update(score._id, {
      $set: {
        modifiedAt: new Date,
        settings: _settings
      }
    })
  }  
})

export const updateQuizQuestions = new ValidatedMethod({
  name: 'TrainingModuleScores.methods.updateQuizQuestions',
  // validate: new SimpleSchema(TrainingModuleScores.schema).validator(),
  validate: ()=>{},
  run(score) {
    check(score, Object)

    return TrainingModuleScores.update(score._id, {
      $set: {
        modifiedAt: new Date,
        questions: score.questions
      }
    })
  }  
})

export const countTotalScores = new ValidatedMethod({
  name: 'countTotalScores',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleScores.find({status: {$ne:4}}).count()

    return count
    
  }  
})

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleScores.methods.countSearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleScores.find({
      $or: [
        {label: {$regex: new RegExp(keyword, 'i')}},
        {description: {$regex: new RegExp(keyword, 'i')}},        
      ],      
      status: {$ne: 4}
    })

    let count = result.count()

    return count
  }  
});

if(Meteor.isServer) {

  export const getQuizDatadumpData = new ValidatedMethod({  
    name: 'TrainingModuleScores.QuizDatadump.data',  
    validate: ()=>{},  
    run(obj) {
      check(obj, {
        clientId: String,
        buId: Match.Optional(Match.OneOf(undefined, null, String, Number)),
        // moduleId: Match.Optional(Match.OneOf(undefined, null, String, Number))
        moduleId: String
      });
      this.unblock();

      let _matchUsersQuery = {
        'profile.clientId': obj.clientId,
        'profile.role': '6',
        'profile.status': { $ne: 4 }
      }

      if(obj.buId) {
        _matchUsersQuery['profile.buId'] = obj.buId
      }

      let pipelineUsers = [
        {
          $match: _matchUsersQuery        
        },
        {
          $lookup: {
            from: 'training_module_score_summary',
            localField: '_id',
            foreignField: 'userId',
            as: 'tmss'
          }
        },
        {
          $unwind: '$tmss'
        },      
        {
          $lookup: {
            from: 'training_module_scores',
            localField: '_id',
            foreignField: 'userId',
            as: 'tms'
          }
        },
        {
          $unwind: '$tms'
        },
        {
          $match: {
            'tms.moduleId': obj.moduleId
          }
        },
        {
          $lookup: {
            from: 'training_module_quizzes',
            localField: 'tms.quizId',
            foreignField: '_id',
            as: 'tmqz'
          }
        },
        {
          $unwind: '$tmqz'
        },
        {
          $lookup: {
            from: 'training_module_questions',
            localField: 'tms.questionId',
            foreignField: '_id',
            as: 'tmq'
          }
        },
        {
          $unwind: '$tmq'
        },        
        {
          $lookup: {
            from: 'training_modules',
            localField: 'tmss.moduleId',
            foreignField: '_id',
            as: 'tm'
          }
        },
        {
          $unwind: '$tm'
        },        
        {
          $group: {
            // _id: '$tm._id',
            _id: {
              moduleId: "$tms.moduleId",
              quizId: "$tms.quizId",
              questionId: "$tms.questionId"
            },
            clientName: { $first: '$profile.clientName' },
            moduleName: { $first: '$tm.name' },
            buName: { $first: '$profile.buName' },
            quizName: { $first: '$tmqz.title' },
            question: { $first: '$tmq.contentRaw' },
            // "scores": { $addToSet: "$tms" },
            scores: { $addToSet: { 
              userId: "$_id",
              firstName: "$profile.firstname", 
              lastName: "$profile.lastname", 
              fullname: "$profile.fullname",
              moduleId: "$tms.moduleId", 
              buId: "$tms.buId",
              quizId: "$tms.quizId",
              questionId: "$tms.questionId",
              // feedback: "$tms.feedback"
              feedback: {
                $cond: [ { $eq: [ "$tms.feedback", "wrong"] } , "Incorrect", "Correct" ]
              }              
            }}            
            // users: { $addToSet: { 
            //   userId: "$_id",
            //   firstName: "$profile.firstname", 
            //   lastName: "$profile.lastname", 
            //   fullname: "$profile.fullname" 
            // }}
            // moduleName: { $first: '$tm.name' },
            // clientId: { $first: '$profile.clientId' },
            // clientName: { $first: '$profile.clientName' },
            // buId: { $first: '$profile.buId' },
            // buName: { $first: '$profile.buName' }
          }
        },
        {
          $project: {
            _id: 0,
            // moduleId: '$_id',
            // moduleName: '$moduleName',
            // clientId: '$clientId',
            // clientName: '$clientName',
            // buId: '$buId',
            // buName: '$buName'
            moduleId: "$_id.moduleId",
            quizId: "$_id.quizId",
            questionId: "$_id.questionId",
            clientName: "$clientName",
            moduleName: "$moduleName",
            buName: "$buName",
            quizName: "$quizName",
            question: "$question",
            scores: "$scores",
            // users: "$users"
            count: { $size: "$scores" }
          }
        },
        {
          $sort: {
            "quizName": 1
          }
        }
      ];

      let _result = Promise.await(Meteor.users.rawCollection().aggregate(pipelineUsers).toArray());

      // console.log(_result)

      return _result;

    }
  });

}


