/**
 * Admin Quiz Answers template logic
 *
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import Sortable from 'sortablejs'

import { updateQuestionAnswer } from '/both/api/methods/training-module-questions.js'
import { insertAnswer, updateAnswerStatus, updateAnswerContent, updateAnswerOrder } from '/both/api/methods/training-module-answers.js'

import { TrainingModuleQuizzes } from '/both/api/collections/training-module-quizzes.js'
import { TrainingModuleAnswers } from '/both/api/collections/training-module-answers.js'

// import '/imports/ui/stylesheets/admin/quizzes/admin-quiz-answers.less'
import '/imports/ui/pages/admin/quizzes/admin-quiz-answers.html'

let _selfAdminQuizAnswers
let _subsAdminQuizAnswers

Template.AdminQuizAnswers.onCreated(function adminQuizAnswersOnCreated() {
  _selfAdminQuizAnswers = this

  _selfAdminQuizAnswers.Question = this.data.Question

  Session.set('correctAnswers', _selfAdminQuizAnswers.Question.answer)

  _selfAdminQuizAnswers.ready = new ReactiveVar()
  // _selfAdminQuizAnswers.qid = new ReactiveVar(_selfAdminQuizAnswers.Question._id)
  // _selfAdminQuizAnswers.answer= new ReactiveVar(_selfAdminQuizAnswers.Question.answer)

  _subsAdminQuizAnswers = new SubsManager()

  _selfAdminQuizAnswers.autorun(() => {
    // if(_selfAdminQuizAnswers.qid.get()) {
      if(Session.get('curQid')) { //-- Since this template is embedded, to reload this remotely, Session works better than local ReactiveVar.
      // let handleQuizAnswers = _subsAdminQuizAnswers.subscribe('training_module_answers_w_qid', _selfAdminQuizAnswers.qid.get())
      let handleQuizAnswers = _subsAdminQuizAnswers.subscribe('training_module_answers_w_qid', Session.get('curQid'))
      _selfAdminQuizAnswers.ready.set(handleQuizAnswers.ready())
    }
  })

})

Template.AdminQuizAnswers.onRendered(function adminQuizAnswersOnRendered() {
      
  //-- This not working here. See the helper 'Answers' for more details.
      let el = document.getElementById('ul_admin_quiz_answers');
      let sortable = new Sortable(el, {
        // sort: true,
        onEnd: function (e) {
          e.oldIndex;  // element's old index within parent
          e.newIndex;  // element's new index within parent

          // $('#ul_admin_quiz_questions').children('li.li-admin-quiz-question').each(function(idx, el) { //-- not working
          $(el).children('li.li-admin-quiz-answer').each(function(idx, el) {
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

Template.AdminQuizAnswers.helpers({
  answerType() {
    let quiz = TrainingModuleQuizzes.find(Session.get('curQzid'))

    if(quiz && quiz.fetch().length > 0) {
      let answerType = quiz.fetch()[0].settings && quiz.fetch()[0].settings.answerType || 1

      return answerType
    }
  },
  // Question() {
  //   let myQ =  _selfAdminQuizAnswers.Question

  //   console.log(myQ)
  //   Session.set('correctAnswers', myQ.answer)

  //   return myQ
  // },
  Answers() {
    if(Session.get('curQid')) {

        //-- Sortable is initiated only when it is here.
        //-- I guess it's because this template is embeded into 
        //-- another embedded template, and maybe needed to be 
        //-- called everytime the Dom/Answers list is created.
        // let el = document.getElementById('ul_admin_quiz_answers')

        // if(el) {
        //   let sortable = new Sortable(el, {
        //     // sort: true,
        //     onEnd: function (e) {
        //       e.oldIndex;  // element's old index within parent
        //       e.newIndex;  // element's new index within parent

        //       $(el).children('li.li-admin-quiz-answer').each(function(idx, el) {
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
        questionId: Session.get('curQid')
      }, {
        sort: {
          order: 1
        }
      })
    }
  },
  // correctAnswer() {
  //   console.log(_selfAdminQuizAnswers.answer.get())
  //   return _selfAdminQuizAnswers.answer.get()
  // },
  correctAnswers() {    
    return Session.get('correctAnswers')
  }   
})

Template.AdminQuizAnswers.events({
  'click .btn-add-new-answer'(e, tpl) {
    e.preventDefault()

    // let quizId = _selfAdminQuizAnswers.Question.quizId
    // let questionId = _selfAdminQuizAnswers.Question._id

    let quizId = Session.get('curQzId')
    let questionId =Session.get('curQid')

    if(quizId !== '' && questionId !== '') {

      let answersLength = $(".ul-amdin-quiz-answers").children('li.li-admin-quiz-answer').length

      //-- Another reactivity issue? It dubles, so, should be divided by 2 to 
      //-- get the correct order.
      let order = answersLength /2

      let objAnswer = {
        quizId: quizId,
        questionId: questionId,
        order: order
      }

      TrainingModuleAnswers.insert(objAnswer, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again.")
        } else {
          // if(res) {
          //   let el = '<li class="li-admin-quiz-answer init" data-aid="'+res+'">'
          //       el += '<input type="text" class="input-admin-quiz-answer">'
          //       el += '<button class="btn btn-xs btn-default btn-delete-quiz-answer">'
          //       el += '<i class="fa fa-minus"></i> </button></li>'

          //   $(".ul-amdin-quiz-answers").append(el)

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

    let content = $(e.currentTarget).siblings('.txta-quiz-answer-content').val()

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
  'click .chkb-this-quiz-answer'(e, tpl) {
    e.preventDefault()

    let qid = $(e.currentTarget).parent().data('qid')
    // let aid = $(e.currentTarget).parent().data('aid')

    let aids = []

    $('.chkb-this-quiz-answer:checked').each(function() {
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
            Session.set('correctAnswers', aids)
            // _selfAdminQuizAnswers.answer.set(aids)
          } else {
            toastr.error("Something went wrong. Please try again.")
          }
        }        
      })
    }
  },
  'click .radio-this-quiz-answer'(e, tpl) {
    e.preventDefault()

    let qid = $(e.currentTarget).parent().data('qid')
    // let aid = $(e.currentTarget).parent().data('aid')

    let aids = []
    
    aids.push($('.radio-this-quiz-answer:checked').val())    

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
            Session.set('correctAnswers', aids)
            // _selfAdminQuizAnswers.answer.set(aids)
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
  // 'blur .txta-quiz-answer-content'(e, tpl) {
  //   e.preventDefault()

  //   $(e.currentTarget).siblings('.btn-save-this-answer').addClass('blink')
  // }
})

Template.AdminQuizAnswers.onDestroyed(() => {
  Session.set('correctAnswers', null)
  _subsAdminQuizAnswers.clear()
})


