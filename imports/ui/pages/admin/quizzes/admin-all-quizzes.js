/**
 * Admin All Quizzes template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { updateQuiz, updateQuizStatus, deleteQuiz } from '/both/api/methods/training-module-quizzes.js'

// import '/imports/ui/stylesheets/admin/quizzes/admin-all-quizzes.less'
import { AdminAllQuizzes } from '/imports/ui/pages/admin/quizzes/admin-all-quizzes.html'

import { AdminQuizSettings } from '/imports/ui/pages/admin/quizzes/admin-quiz-settings.js'
import { AdminQuizQuestions } from '/imports/ui/pages/admin/quizzes/admin-quiz-questions.js'
import { AdminQuizTemplate } from '/imports/ui/pages/admin/quizzes/admin-quiz-template.js'

let _selfAdminAllQuizzes

Template.AdminAllQuizzes.onCreated(function adminAllQuizzesOnCreated() {
  _selfAdminAllQuizzes = this
})

Template.AdminAllQuizzes.onRendered(function adminAllQuizzesOnRendered() {

})

Template.AdminAllQuizzes.helpers({
  quizzesTableSelector() {
    return {
      status: {$ne: 4}
    }
  }
})

Template.AdminAllQuizzes.events({
  'click .btn-quiz-settings'(e, tpl) {
    e.preventDefault()

    let qzid = $(e.currentTarget).parent().parent().data('qzid')

    Session.set('curQzId', qzid)
    $('.admin-quiz-settings-form-container').show()
  },
  'click .btn-close-quiz-settings'(e, tpl) {
    e.preventDefault()

    Session.set('curQzId', null)
    $('.admin-quiz-settings-form-container').hide()
  },  
  'click .btn-manage-quiz-questions'(e, tpl) {
    e.preventDefault()

    let qzid = $(e.currentTarget).parent().parent().data('qzid')

    Session.set('curQzid', qzid)

    $('.row-admin-quiz-questions').show()
  },
  'click .btn-save-quiz'(e, tpl) {
    e.preventDefault()

    let qzid = $(e.currentTarget).parent().parent().data('qzid')

    if(qzid) {
      let title = $('#input_quiz_title_'+qzid).val()
      let desc = $('#txta_quiz_desc_'+qzid).val()

      if(title !== '') {
        let quizObj = {
          _id: qzid,
          title: title,
          description: desc
        }

        updateQuiz.call(quizObj, (err, res) => {
          if(err) {
            toastr.error("Something went wrong. Please try again. " + err)
          } else {
            toastr.info("Successfully updated.")
          }
        })

      } else {
        toastr.error("Quiz Title cannot be null.")
      }
    }
  },
  'click .btn-update-quiz-status'(e, tpl) {
    e.preventDefault()

    let qzid = $(e.currentTarget).parent().parent().data('qzid')

    if(qzid) {
     
      let status = $(e.currentTarget).data('status')

      let qzObj = {
        _id: qzid,
        status: status
      }

      updateQuizStatus.call(qzObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again. " + err)
        } else {
          toastr.info("Successfully updated.")
        }        
      })
    }
  },
  'click .btn-delete-quiz'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to delete this quiz?")) {
      let qzid = $(e.currentTarget).parent().parent().data('qzid')  
      let status = parseInt($(e.currentTarget).data('status'))  

      let objQuiz = {
        _id: qzid,
        status: status
      }

      updateQuizStatus.call(objQuiz, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })   
    }
  },      
})
