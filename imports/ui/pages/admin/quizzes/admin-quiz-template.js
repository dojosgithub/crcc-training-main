/**
 *  Admin Quiz template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveDict } from 'meteor/reactive-dict'

// import { TrainingModuleQuizzes } from '/imports/api/collections/training-module-quizzes.js'
// import { updateQuiz, updateQuizStatus, deleteQuiz } from '/imports/api/methods/training-module-quizzes.js'

// import '/imports/ui/stylesheets/admin/quizzes/admin-quiz-template.less'
import '/imports/ui/pages/admin/quizzes/admin-quiz-template.html'

// Template.AdminQuizActions.events({
//   'click .btn-delete-quiz'(e, tpl) {
//     e.preventDefault()

//     if(confirm("Are you sure to remove this quiz?")) {
//       let vid = $(e.currentTarget).parent().parent().data('vid')  
//       let status = parseInt($(e.currentTarget).data('status'))  

//       let objQuiz = {
//         _id: vid,
//         status: status
//       }

//       updateQuizStatus.call(objQuiz, (err, res) => {
//         if(err) {
//           sAlert.error("Something went wrong. " + err)
//         } else {
//           sAlert.info("Successfully deleted.")
//         }
//       })   
//     }
//   },
//   'click .btn-save-table-quiz'(e, tpl) {
//     e.preventDefault()

//     let vid = $(e.currentTarget).parent().parent().data('vid')
//     let title = $('#input_table_quiz_title_'+vid).val()
//     let desc = $('#txta_table_quiz_desc_'+vid).val()
//     let src = $('#txta_table_quiz_src_'+vid).val()

//     if(vid !== '') {

//       let objQuiz = {
//         _id: vid,
//         title: title,
//         description: desc,
//         quiz: {
//           src: src
//         }
//       }

//       updateQuiz.call(objQuiz, (err, res) => {
//         if(err) {
//           sAlert.error("Something went wrong. " + err)
//         } else {
//           sAlert.info("Successfully updated.")
//         }
//       })
//     }
//   },
//   'click .btn-update-table-quiz-status'(e, tpl) {
//     e.preventDefault()

//     let status = parseInt($(e.currentTarget).data('status'))
//     let command = status === 1 ? 'activate' : 'deactivate' 

//     if(confirm("Are you sure to " + command + " this quiz?")) {
//       let vid = $(e.currentTarget).parent().parent().data('vid')    

//       let objQuiz = {
//         _id: vid,
//         status: status
//       }

//       updateQuizStatus.call(objQuiz, (err, res) => {
//         if(err) {
//           sAlert.error("Something went wrong. " + err)
//         } else {
//           sAlert.info("Successfully " + command + "d.")
//         }
//       })   
//     }
//   },
//   'click .btn-quiz-settings'(e, tpl) {
//     e.preventDefault()

//     let qzid = $(e.currentTarget).parent().parent().data('qzid')

//     // console.log(qzid)
//   }
// })
