/**
 * Admin New Quiz template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { TrainingModuleQuizzes } from '/both/api/collections/training-module-quizzes.js'
import { insertQuiz } from '/both/api/methods/training-module-quizzes.js'

// import '/imports/ui/stylesheets/admin/quizzes/admin-new-quiz.less'
import { AdminNewQuiz } from '/imports/ui/pages/admin/quizzes/admin-new-quiz.html'

let _selfAdminNewQuiz

Template.AdminNewQuiz.onCreated(function adminNewQuizOnCreated() {
  _selfAdminNewQuiz = this
})

Template.AdminNewQuiz.onRendered(function adminNewQuizOnRendered() {

})

Template.AdminNewQuiz.helpers({

})

Template.AdminNewQuiz.events({
  // 'click .btn-submit-new-quiz'(e, tpl) {
  'submit form#form_admin_new_quiz'(e, tpl) {
    e.preventDefault()

    // let name = tpl.find.('#input_new_quiz_name').val()
    // let description = tpl.find('#txta_new_quiz_description').val()

    let title = e.target.quizName.value
    let description = e.target.quizDescription.value

    if(title !== '') {
      let obj = {
        title: title,
        description: description
      }

      insertQuiz.call(obj, (err, res) => {
        if(err) {
          toastr.error("Somethihng went wrong. Please try again: " + err)
        } else {
          toastr.info("Successfully added.")
        }
      })

    } else {
      toastr.error("Quiz name cannot be null.")
    }
  }
})
