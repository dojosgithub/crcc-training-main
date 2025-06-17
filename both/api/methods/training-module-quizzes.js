/**
 * Training Module Quizzes methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleQuizzes } from '/both/api/collections/training-module-quizzes.js'
import { TrainingModuleScores } from '/both/api/collections/training-module-scores.js'
import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'

// export const insertQuizzes = new Method('insertQuizzes', function(quiz) {
  
//   return TrainingModuleQuizzes.insert(quiz, {validate: true})
// })

export const insertQuiz = new ValidatedMethod({
  name: 'TrainingModuleQuizzes.methods.insertQuiz',
  // validate: new SimpleSchema(TrainingModuleQuizzes.schema).validator(),
  validate: ()=>{},
  run(quiz) {
    check(quiz, Object)

    // quiz.createdAt = new Date
    // quiz.modifiedAt = new Date
    
    return TrainingModuleQuizzes.insert(quiz)
  }
})

export const updateQuizStatus = new ValidatedMethod({
  name: 'TrainingModuleQuizzes.methods.updateQuizStatus',
  // validate: new SimpleSchema(TrainingModuleQuizzes.schema).validator({clean: true, fliter: true}), 
  validate: ()=>{}, 
  run(quiz) {
    check(quiz, Object)
    
    return TrainingModuleQuizzes.update(quiz._id, {
      $set: {
        status: quiz.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateQuiz = new ValidatedMethod({
  name: 'TrainingModuleQuizzes.methods.updateQuiz',
  // validate: new SimpleSchema(TrainingModuleQuizzes.schema).validator(),
  validate: ()=>{},
  run(quiz) {
    check(quiz, Object)
        
    return TrainingModuleQuizzes.update(quiz._id, {
      $set: {
        title: quiz.title,        
        description: quiz.description,        
        modifiedAt: new Date
      }
    })
  }  
})

export const updateQuizSettings = new ValidatedMethod({
  name: 'TrainingModuleQuizzes.methods.updateQuizSettings',
  // validate: new SimpleSchema(TrainingModuleQuizzes.schema).validator(),
  validate: ()=>{},
  run(quiz) {
    check(quiz, Object)
        
    quiz.modifiedAt = new Date
        
    let _settings = quiz.settings    
    _settings.modifiedAt = new Date

    return TrainingModuleQuizzes.update(quiz._id, {
      $set: {
        modifiedAt: new Date,
        settings: _settings
      }
    })
  }  
})

export const updateQuizQuestions = new ValidatedMethod({
  name: 'TrainingModuleQuizzes.methods.updateQuizQuestions',
  // validate: new SimpleSchema(TrainingModuleQuizzes.schema).validator(),
  validate: ()=>{},
  run(quiz) {
    check(quiz, Object)

    return TrainingModuleQuizzes.update(quiz._id, {
      $set: {
        modifiedAt: new Date,
        questions: quiz.questions
      }
    })
  }  
})

export const countTotalQuizzes = new ValidatedMethod({
  name: 'countTotalQuizzes',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleQuizzes.find({status: {$ne:4}}).count()

    return count
    
  }  
})

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleQuizzes.methods.countSearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleQuizzes.find({
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

if(Meteor.isServer) {
  Meteor.methods({
    "Quiz.AAO.getData"(obj) {
      check(obj, {
        moduleId: String,
        quizId: String,
        userId: String,
        pageIdx: Number
      });
      this.unblock();

      let _pageIdx = parseInt(obj.pageIdx);

      let output = Meteor.wrapAsync((sid, callback) => {

        let _pipelineQz = [
          {
            $match: {
              _id: obj.quizId,
              status: 1
            }
          },
          {
            $lookup: {              
              from: "training_module_questions",
              localField: "_id",
              foreignField: "quizId",
              as: "Qs"              
            }
          },
          {
            $unwind: "$Qs"
          },
          {
            $match: {
              "Qs.status": 1
            }
          },
          {
            $sort: {
              "Qs.order": 1
            }
          },
          {
            $lookup: {
              from: "training_module_answers",
              localField: "Qs._id",
              foreignField: "questionId",
              as: "Ans"              
            }
          },
          {
            $match: {
              "Ans.status": 1
            }
          },
          {
            $sort: {
              "Ans.order": 1
            }
          },                    
          {
            $group: {
              _id: {
                qzId: "$_id"
              },
              title: { $first: "$title" },
              numQs: { $first: "$questions" },
              settings: { $first: "$settings" },
              questions: { $push: { q: "$Qs", ans: "$Ans" } },
              // answers: { $push: "$Ans" }               
            }
          },
          {
            $project: {
              _id: 0,
              qzId: "$_id.qzId",
              title: "$title",
              numQs: "$numQs",
              settings: "$settings",
              questions: "$questions",
              // answers: "$answers"
            }
          },
        ]

        let _qzData = Promise.await(TrainingModuleQuizzes.rawCollection().aggregate(_pipelineQz).toArray());

        let _qzScores = TrainingModuleScores.find({
          moduleId: obj.moduleId,
          quizId: obj.quizId,
          userId: obj.userId
        }).fetch();

// console.log(obj, _qzScores)

        let _data = {
          quizData: _qzData,
          scoreData: _qzScores
        };

        callback(null, {success: true, data: _data });

      });

      let result = output("DQ")      

      if(result) {

        // if(result.data.quizData.settings) {
        //   if(result.data.quizData.settings.possibleAttempts) {
        //     let _possibleAttempts = result.data.quizData.settings.possibleAttempts;

        //   }
        // }
        let _data = result.data;

        if(_data.quizData[0].numQs && _data.scoreData) {
          //-- in case this quiz is already done, but, not added to the pages done for some ,
          //-- reason this logic will add this quiz page forcefully, so that the trainee can  
          //-- move on to the next slide safely
          if(_data.scoreData.length >= _data.quizData[0].numQs) {
            // console.log(obj.pageIdx)
            let _userStats = TrainingModuleUserStats.findOne({
              userId: obj.userId,
              moduleId: obj.moduleId
            });

            if(_userStats) {
              let _pagesDone = _userStats.pages;
              if(_pagesDone && !_pagesDone.includes(_pageIdx)) {
                _pagesDone.push(_pageIdx);

                _pagesDone.sort((a,b) => {
                  return a-b;
                });

                TrainingModuleUserStats.update(_userStats._id, {
                  $set: {
                    pages: _pagesDone
                  }
                })
              }
            }
          }
        }

        return result
      }      

    }
  });
}

