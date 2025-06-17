/**
 * Admin Survey Answers template logic
 *
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import Sortable from 'sortablejs'

import { updateSurveyQuestionAnswer } from '/both/api/methods/training-module-survey-questions.js'
import { insertSurveyAnswer, updateSurveyAnswerStatus, updateSurveyAnswerContent, updateSurveyAnswerOrder } from '/both/api/methods/training-module-survey-answers.js'

import { TrainingModuleSurveys } from '/both/api/collections/training-module-surveys.js'
import { TrainingModuleSurveyAnswers } from '/both/api/collections/training-module-survey-answers.js'

// import '/imports/ui/stylesheets/admin/surveys/admin-survey-answers.less'
import '/imports/ui/pages/admin/surveys/admin-survey-answers.html'

let _selfAdminSurveyAnswersNumericalRating
let _subsAdminSurveyAnswersNumericalRating

Template.AdminSurveyAnswersNumericalRating.onCreated(function adminSurveyAnswersOnCreated() {
  _selfAdminSurveyAnswersNumericalRating = this

  _selfAdminSurveyAnswersNumericalRating.Question = this.data.Question

  Session.set('correctSurveyAnswers', _selfAdminSurveyAnswersNumericalRating.Question.answer)

  _selfAdminSurveyAnswersNumericalRating.ready = new ReactiveVar()
  // _selfAdminSurveyAnswersNumericalRating.qid = new ReactiveVar(_selfAdminSurveyAnswersNumericalRating.Question._id)
  // _selfAdminSurveyAnswersNumericalRating.answer= new ReactiveVar(_selfAdminSurveyAnswersNumericalRating.Question.answer)

  _subsAdminSurveyAnswersNumericalRating = new SubsManager()

  _selfAdminSurveyAnswersNumericalRating.autorun(() => {
    // if(_selfAdminSurveyAnswersNumericalRating.qid.get()) {
      if(Session.get('curSQid')) { //-- Since this template is embedded, to reload this remotely, Session works better than local ReactiveVar.
      // let handleSurveyAnswers = _subsAdminSurveyAnswersNumericalRating.subscribe('training_module_answers_w_qid', _selfAdminSurveyAnswersNumericalRating.qid.get())
      let handleSurveyAnswers = _subsAdminSurveyAnswersNumericalRating.subscribe('training_module_answers_w_qid', Session.get('curSQid'))
      _selfAdminSurveyAnswersNumericalRating.ready.set(handleSurveyAnswers.ready())
    }
  })

})

Template.AdminSurveyAnswersNumericalRating.onRendered(function adminSurveyAnswersOnRendered() {
      
  //-- This not working here. See the helper 'Answers' for more details.
      let el = document.getElementById('ul_admin_survey_answers');
      let sortable = new Sortable(el, {
        // sort: true,
        onEnd: function (e) {
          e.oldIndex;  // element's old index within parent
          e.newIndex;  // element's new index within parent

          // $('#ul_admin_survey_questions').children('li.li-admin-survey-question').each(function(idx, el) { //-- not working
          $(el).children('li.li-admin-survey-answer').each(function(idx, el) {
            let aid = $(this).data('aid')
  
            let aObj = {
              _id: aid,
              order: idx
            }
            //-- Local update not working...
            // TrainingModuleQuestions.update(pid, {
            //   $set: {
            //     order: idx
            //   }
            // })

            updateAnswerOrder.call(aObj)

          })

        },
      })
  
})

Template.AdminSurveyAnswersNumericalRating.helpers({
  answerType() {
    let survey = TrainingModuleSurveys.find(Session.get('curSvId'))

    if(survey && survey.fetch().length > 0) {
      let answerType = survey.fetch()[0].settings.answerType || 1

      return answerType
    }
  },
  // Question() {
  //   let myQ =  _selfAdminSurveyAnswersNumericalRating.Question

  //   console.log(myQ)
  //   Session.set('correctSurveyAnswers', myQ.answer)

  //   return myQ
  // },
  Answers() {
    if(Session.get('curSQid')) {

        //-- Sortable is initiated only when it is here.
        //-- I guess it's because this template is embeded into 
        //-- another embedded template, and maybe needed to be 
        //-- called everytime the Dom/Answers list is created.
        // let el = document.getElementById('ul_admin_survey_answers')

        // if(el) {
        //   let sortable = new Sortable(el, {
        //     // sort: true,
        //     onEnd: function (e) {
        //       e.oldIndex;  // element's old index within parent
        //       e.newIndex;  // element's new index within parent

        //       $(el).children('li.li-admin-survey-answer').each(function(idx, el) {
        //         let aid = $(this).data('aid')
      
        //         let aObj = {
        //           _id: aid,
        //           order: idx
        //         }

        //         updateAnswerOrder.call(aObj)
        //       })
        //     },
        //   })
        // }

      //-- Then, return the main Answers cursor.
      return TrainingModuleAnswers.find({
        questionId: Session.get('curSQid')
      }, {
        sort: {
          order: 1
        }
      })
    }
  },
  // correctAnswer() {
  //   console.log(_selfAdminSurveyAnswersNumericalRating.answer.get())
  //   return _selfAdminSurveyAnswersNumericalRating.answer.get()
  // },
  correctSurveyAnswers() {    
    return Session.get('correctSurveyAnswers')
  }   
})

Template.AdminSurveyAnswersNumericalRating.events({
  'click .btn-add-new-answer'(e, tpl) {
    e.preventDefault()

    // let surveyId = _selfAdminSurveyAnswersNumericalRating.Question.surveyId
    // let questionId = _selfAdminSurveyAnswersNumericalRating.Question._id

    let surveyId = Session.get('curSvId')
    let questionId =Session.get('curSQid')

    if(surveyId !== '' && questionId !== '') {

      let answersLength = $(".ul-amdin-survey-answers").children('li.li-admin-survey-answer').length

      //-- Another reactivity issue? It dubles, so, should be divided by 2 to 
      //-- get the correct order.
      let order = answersLength /2

      let objAnswer = {
        surveyId: surveyId,
        questionId: questionId,
        order: order
      }

      TrainingModuleAnswers.insert(objAnswer, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again.")
        } else {
          // if(res) {
          //   let el = '<li class="li-admin-survey-answer init" data-aid="'+res+'">'
          //       el += '<input type="text" class="input-admin-survey-answer">'
          //       el += '<button class="btn btn-xs btn-default btn-delete-survey-answer">'
          //       el += '<i class="fa fa-minus"></i> </button></li>'

          //   $(".ul-amdin-survey-answers").append(el)

          // } else {
          //   toastr.error("Something went wrong. Please try again.")
          // }
        }
      })      

    }   
  },
  'click .btn-remove-this-answer'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to delete this answer?")) {
      let aid = $(e.currentTarget).parent().data('aid')

      let aObj = {
        _id: aid,
        status: 4
      }

      // TrainingModuleAnswers.update(aid, { //-- Not working due to SimpleSchema issue with $setOnInsert thing
      //   $set: {
      //     status: 4
      //   }      
      // }, (err, res) => {
      updateAnswerStatus.call(aObj, (err, res) => {        
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {          
        }        
      })
    }
  },
  'click .btn-save-this-answer'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).parent().data('aid')

    let content = $(e.currentTarget).siblings('.txta-survey-answer-content').val()

    if(content !== '') {

      let aObj = {
        _id: aid,
        content: content
      }

      updateAnswerContent.call(aObj, (err, res) => {        
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          if(res) {
            toastr.info("Successfully saved")
            $(e.currentTarget).removeClass('blink')
          } else {
            toastr.error("Something went wrong. Please try again.")
          }
        }        
      })
    }
  },
  'click .chkb-this-survey-answer'(e, tpl) {
    e.preventDefault()

    let qid = $(e.currentTarget).parent().data('qid')
    // let aid = $(e.currentTarget).parent().data('aid')

    let aids = []

    $('.chkb-this-survey-answer:checked').each(function() {
      aids.push($(this).val())
    })

    if(qid) {

      let qObj = {
        _id: qid,
        answer: aids
      }

      updateQuestionAnswer.call(qObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          if(res) {
            toastr.info("Successfully updated")
            Session.set('correctSurveyAnswers', aids)
            // _selfAdminSurveyAnswersNumericalRating.answer.set(aids)
          } else {
            toastr.error("Something went wrong. Please try again.")
          }
        }        
      })
    }
  },
  'click .radio-this-survey-answer'(e, tpl) {
    e.preventDefault()

    let qid = $(e.currentTarget).parent().data('qid')
    // let aid = $(e.currentTarget).parent().data('aid')

    let aids = []
    
    aids.push($('.radio-this-survey-answer:checked').val())    

    if(qid) {

      let qObj = {
        _id: qid,
        answer: aids
      }

      updateQuestionAnswer.call(qObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          if(res) {
            toastr.info("Successfully updated")
            Session.set('correctSurveyAnswers', aids)
            // _selfAdminSurveyAnswersNumericalRating.answer.set(aids)
          } else {
            toastr.error("Something went wrong. Please try again.")
          }
        }        
      })
    }
  },  
  'click .btn-update-answer-status'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).parent().data('aid')
    let status = $(e.currentTarget).data('status')

    if(aid) {
      let aObj = {
        _id: aid,
        status: status
      }

      updateAnswerStatus.call(aObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          if(res) {
            toastr.info("Successfully updated")            
          } else {
            toastr.error("Something went wrong. Please try again.")
          }
        }        
      })

    }


  }
  // 'blur .txta-survey-answer-content'(e, tpl) {
  //   e.preventDefault()

  //   $(e.currentTarget).siblings('.btn-save-this-answer').addClass('blink')
  // }
})

Template.AdminSurveyAnswersNumericalRating.onDestroyed(() => {
  Session.set('correctSurveyAnswers', null)
  _subsAdminSurveyAnswersNumericalRating.clear()
})


