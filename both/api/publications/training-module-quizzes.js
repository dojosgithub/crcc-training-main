if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleQuizzes collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate'

import { TrainingModuleQuizzes } from '/both/api/collections/training-module-quizzes.js'

Meteor.publish('all_training_module_quizzes', () => 
  TrainingModuleQuizzes.find({
    status: {$ne: 4} //-- Exclude deleted quizzes
  })
)

Meteor.publish('all_active_training_module_quizzes', () => 
  TrainingModuleQuizzes.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_module_quizzes', () => 
  TrainingModuleQuizzes.find({
    status: 2
  })
)

// Meteor.publish('training_module_quizzes_w_ids', (ids) => { //-- called by admin-new-quiz.js
//   check(ids, Array)

//   return TrainingModuleQuizzes.find({
//     status: {$ne: 4}, 
//     _id: {$in: ids}
//   })
// })

Meteor.publish('training_module_quizzes_w_ids', function publishTrainingModuleQuizzesWIDs(ids) { //-- called by admin-new-quiz.js
  check(ids, Array)

  return TrainingModuleQuizzes.find({
    status: {$ne: 4}, 
    _id: {$in: ids}
  })
})

Meteor.publish('training_module_quiz_w_id', (quizId) => {
  check(quizId, String)

  return TrainingModuleQuizzes.find({
    _id: quizId,
    status: 1
  })
})

Meteor.publish('training_module_quiz_n_questions_w_qzid', function(quizId) {
  check(quizId, String)

  return ReactiveAggregate(this, TrainingModuleQuizzes,[
  // {
  //   $match: {
  //     _id: quizId,
  //     status: 1
  //   }
  // },
  {
    $lookup: {
      from: "training_module_questions",
        localField: "_id",
        foreignField: "quizId",
        as: "Questions"      
    },   
  },
  // {
  //   $unwind: "$Questions"   //-- Causes Internal Error
  // },
  {
    $match: {
      _id: quizId,
      status: 1,      
      'Questions.status': 1
    }
  },  
  {
    $sort: { //-- Not working...
      'Questions.order': 1
    }
  } 
  // // {
  // //   $unwind: {
  // //     path: "$Questions",
  // //     preserveNullAndEmptyArrays: true
  // //   },
  // // }, 
  // {
  //   $lookup: {
  //     from: "training_module_answers",
  //       localField: "Questions.answer",
  //       foreignField: "_id",
  //       as: "Questions.Answers"      
  //   },   
  // },
  // {
  //   $unwind: {
  //     path: "$Questions.Answers",
  //     preserveNullAndEmptyArrays: true
  //   },
  // },     
  // {
  //   $match: {
  //     _id: quizId,
  //     status: 1,      
  //     'Questions.status': 1
  //   }
  // } 
  ])

})

Meteor.publish('training_module_quizzes_w_page_limit', function publishTrainingModuleQuizzesWPageLimit(quiz) {
  check(quiz, Object)

  let page = quiz.page
  let limit = quiz.limit

  return TrainingModuleQuizzes.find({
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })
})

Meteor.publish('training_module_quizzes_w_keyword_limit', function publishTrainingModuleQuizzesWKeywordLimit(input) {
  check(input, Object)
  
  let keyword = input.keyword
  let page = input.page
  let limit = input.limit

  let result = TrainingModuleQuizzes.find({
    $or: [
      {title: {$regex: new RegExp(keyword, 'i')}},
      {description: {$regex: new RegExp(keyword, 'i')}}      
    ],      
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })

  return result
}) 

}