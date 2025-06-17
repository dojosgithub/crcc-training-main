if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleSurveys collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate'

import { TrainingModuleSurveys } from '/both/api/collections/training-module-surveys.js'

Meteor.publish('all_training_module_surveys', () => 
  TrainingModuleSurveys.find({
    status: {$ne: 4} //-- Exclude deleted surveys
  })
)

Meteor.publish('all_active_training_module_surveys', () => 
  TrainingModuleSurveys.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_module_surveys', () => 
  TrainingModuleSurveys.find({
    status: 2
  })
)

// Meteor.publish('training_module_surveys_w_ids', (ids) => { //-- called by admin-new-survey.js
//   check(ids, Array)

//   return TrainingModuleSurveys.find({
//     status: {$ne: 4}, 
//     _id: {$in: ids}
//   })
// })

Meteor.publish('training_module_surveys_w_ids', function publishTrainingModuleSurveysWIDs(ids) { //-- called by admin-new-survey.js
  check(ids, Array)

  return TrainingModuleSurveys.find({
    status: {$ne: 4}, 
    _id: {$in: ids}
  })
})

Meteor.publish('training_module_survey_w_id', (surveyId) => {
  check(surveyId, String)

  return TrainingModuleSurveys.find({
    _id: surveyId,
    status: 1
  })
})

Meteor.publish('training_module_survey_n_questions_w_svid', function(surveyId) {
  check(surveyId, String)

  return ReactiveAggregate(this, TrainingModuleSurveys,[
  // {
  //   $match: {
  //     _id: surveyId,
  //     status: 1
  //   }
  // },
  {
    $lookup: {
      from: "training_module_survey_questions",
        localField: "_id",
        foreignField: "surveyId",
        as: "Questions"
    },   
  },
  // {
  //   $unwind: "$Questions"   //-- Causes Internal Error
  // },
  {
    $match: {
      _id: surveyId,
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
  //     _id: surveyId,
  //     status: 1,      
  //     'Questions.status': 1
  //   }
  // } 
  ])

})

Meteor.publish('training_module_surveys_w_page_limit', function publishTrainingModuleSurveysWPageLimit(survey) {
  check(survey, Object)

  let page = survey.page
  let limit = survey.limit

  return TrainingModuleSurveys.find({
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })
})

Meteor.publish('training_module_surveys_w_keyword_limit', function publishTrainingModuleSurveysWKeywordLimit(input) {
  check(input, Object)
  
  let keyword = input.keyword
  let page = input.page
  let limit = input.limit

  let result = TrainingModuleSurveys.find({
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
