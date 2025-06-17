/**
 * Admin Quiz Questions template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import Sortable from 'sortablejs'

import { TrainingModuleQuestions } from '/both/api/collections/training-module-questions.js'
import { insertQuestion, updateQuestionOrder, updateQuestionContent, updateQuestionStatus } from '/both/api/methods/training-module-questions.js'
import { updateQuizQuestions } from '/both/api/methods/training-module-quizzes.js'

// import '/imports/ui/stylesheets/admin/quizzes/admin-quiz-questions.less'
import { AdminQuizQuestions } from '/imports/ui/pages/admin/quizzes/admin-quiz-questions.html'

import { AdminQuizTemplate } from '/imports/ui/pages/admin/quizzes/admin-quiz-template.js'
import { AdminNewQuestion } from '/imports/ui/pages/admin/quizzes/admin-new-question.js'
import { AdminManageQuestion } from '/imports/ui/pages/admin/quizzes/admin-manage-question.js'
// import { AdminQuizAnswers } from '/imports/ui/pages/admin/quizzes/admin-quiz-answers.js'

let _selfAdminQuizQuestions
let _subsAdminQuizQuestions

Template.AdminQuizQuestions.onCreated(function adminQuizQuestionsOnCreated() {
  _selfAdminQuizQuestions = this

  _selfAdminQuizQuestions.ready = new ReactiveVar()
  _selfAdminQuizQuestions.qCurId = new ReactiveVar() //-- This doesn't work well. Session working better
  _selfAdminQuizQuestions.qOriginLength = new ReactiveVar()

  _subsAdminQuizQuestions = new SubsManager()

  _selfAdminQuizQuestions.autorun(() => {
    if(Session.get('curQzid')) {       
      let handleQuizQuestions = _subsAdminQuizQuestions.subscribe('training_module_questions_w_qzid', Session.get('curQzid'))
      _selfAdminQuizQuestions.ready.set(handleQuizQuestions.ready())
    }   
  })
})

Template.AdminQuizQuestions.onRendered(function adminQuizQuestionsOnRendered() {

    let el = document.getElementById('ul_admin_quiz_questions');
    let sortable = new Sortable(el, {
      // sort: true,
      onEnd: function (e) {
        e.oldIndex;  // element's old index within parent
        e.newIndex;  // element's new index within parent

        // $('#ul_admin_quiz_questions').children('li.li-admin-quiz-question').each(function(idx, el) { //-- not working
        $(el).children('li.li-admin-quiz-question').each(function(idx, el) {
          let qid = $(this).data('qid')

          let qObj = {
            _id: qid,
            order: idx
          }
          //-- Local update not working...
          // TrainingModuleQuestions.update(pid, {
          //   $set: {
          //     order: idx
          //   }
          // })

          updateQuestionOrder.call(qObj)

        })

      },
    })
})

Template.AdminQuizQuestions.helpers({
  // questionsTableSelector() {
  //   return {
  //     quizId: Session.get('curQzid'),
  //     status: {$ne:4}
  //   }
  // },
  Questions() {
    // if(Session.get('curQzid') && _selfAdminQuizQuestions.ready.get()) {    
    if(Session.get('curQzid')) {    
      let qs = TrainingModuleQuestions.find()

      if(qs && qs.fetch() && qs.fetch().length > 0) {
        let myQs = qs.fetch()

        let qzObj = {
          _id: Session.get('curQzid'),
          questions: myQs.length
        }
        updateQuizQuestions.call(qzObj)        
      }

      return qs
    }
  },
  Question() {    
    let question
      if(Session.get('curQid')) {      
      // if(_selfAdminQuizQuestions.qCurId.get()) {
        question = TrainingModuleQuestions.find({
          // _id: _selfAdminQuizQuestions.qCurId.get()
          _id: Session.get('curQid')
        })

        // if(question && question.fetch().length > 0) {

        //   let myQ = question.fetch()[0]

        //   let string = 'question-paragraph'
        //   // let originLength = (q.fetch()[0].content.match(/string/g) || []).length; //-- this doesn't work when speical charater is there, e.g. '-'
        //   // _selfAdminQuizQuestions.qOriginLength.set(originLength)
        //   let content = myQ.content
        //   let originLength = content ? (content.split(string)).length : 0
        //   _selfAdminQuizQuestions.qOriginLength.set(originLength-1)
        // }
      }

      return question
  }, 
})

Template.AdminQuizQuestions.events({
  // 'click .btn-test'(e, tpl) {
  //   console.log($('#bbb'))
  //   // console.log($('#aaa').html())
  //   // $('#bbb').html($('#aaa').text())
  //   // $('#aaa .question-paragraph').appendTo('#bbb')
  //   // $('#bbb').append($('#aaa .question-paragraph'))
  //   $('#bbb').html("<h1>Test</h1>")
  // },
//     'blur .editable': function (e, tpl) {
//         // $('.editable .question-paragraph').each(function(i, q) {
//         //   console.log(q.innerHTML)
//         //   console.log(this.nodeType, this.$blaze_range)
//         // })

//         let html = $('.editable').html()
// console.log(html, $('.editable').val())
//         e.target.innerHTML = html
//         // Content.update({_id: Content.findOne()._id}, {$set: {note: note_html}}, function() {
//         //   $(e.target).contents().filter(function(){return this.nodeType != 3 && !this.$blaze_range}).remove();
//         // });
//     },  
  'click .btn-close-quiz-questions'(e, tpl) {
    e.preventDefault()

    Session.set('curQzid', null)
    Session.set('curQid', null)
    
    _subsAdminQuizQuestions.clear()

    $('.row-admin-quiz-questions').hide()
  },
  'click .btn-add-new-question'(e, tpl) {
    e.preventDefault()

    $('.new-question-form-container').show()
  },
  'click .btn-close-new-question'(e, tpl) {
    e.preventDefault()

    let init = '<div class="question-paragraph init"><br></div>'
    $('.admin-new-question-body.question-body').empty().append(init)
    $('.new-question-main-container .question-tooltip').hide()
    $('.new-question-main-container .media-circle-container').hide()

    $('.new-question-form-container').hide()
  },
  'click .btn-save-new-question'(e, tpl) {
    e.preventDefault()

    let qzId = Session.get('curQzid')
    
    // let content = $('.admin-new-question-body').html() //-- Not working
    // let contentRaw = $('.admin-new-question-body').text(function() {
    //   return $(this).text().replace('question-paragraph', " ")
    // }) //-- This works, but, it's a plain text...
 
    //-- For some reason (maybe due to the messy html content), 
    //-- this is the only way to extract HTML content and store it.

    // let qs = document.getElementsByClassName("question-paragraph");
    // let html = ''
    // for(let i=0, len=qs.length; i< len; i++) {
    //   html += '<div class="question-paragraph">' + qs[i].innerHTML + '</div>'      
    // }
    let html = ''
    let raw = ''
    let el = $('.new-question-main-container .question-body').children('.question-paragraph.init')
    el.each(function(i, q) {
      // if(i > 0) { //-- For some reason, the first two, now one is created from somewhwere...
        raw += " " + $(q).text()
        html += '<div class="question-paragraph">' + q.innerHTML + '</div>'        
      // }
    })

    // if(qzId && html !== '') {
    if(html !== '') {

      let qs = $('#ul_admin_quiz_questions').children('li.li-admin-quiz-question')

      let qObj = {
        quizId: qzId,
        content: html,
        // contentRaw: contentRaw,
        contentRaw: raw,
        order: qs.length
      }

      insertQuestion.call(qObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again. " + err)
        } else {
          toastr.info("Successfully added.")          
        }
      })
    }
  },
  'click .btn-manage-question'(e, tpl) {
    e.preventDefault()

    // let qid = $(e.currentTarget).parentsUntil('li').data('qid') //-- Not working ...
    let qid = $(e.currentTarget).closest('li.li-admin-quiz-question').data('qid')

    if(qid !== '') {
      Session.set('curQid', qid)
      // _selfAdminQuizQuestions.qCurId.set(qid)
      // _myQid = qid
      // Template.AdminQuizQuestions.__helpers.get('Question').call()

      // let el = '<div class="question-body editable" contenteditable="true" role="textbox" aria-multiline="true" tabindex="0">'
      //     el += '<div class="question-paragraph">aaaa</div>'
      //     el += '</div>'
      // $('.quiz-question-settings-container').append(el)


      // $('.quiz-question-settings-container .question-body').prop('contenteditable', true)
// console.log(qid)
    }
  },
//   'click .btn-update-question1'(e, tpl) {
//     e.preventDefault()

//     let qid = $(e.currentTarget).data('qid')

//     if(qid === Session.get('curQid')) {

//       // let html = $('#tempContent').val()
//       // let raw = $('#tempContent').text()

//       let qObj = {
//         _id: qid,
//         content: html,
//         contentRaw: raw
//       }

// console.log(qObj)

//       // updateQuestionContent.call(qObj, (err, res) => {
//       //   if(err) {
//       //     toastr.error("Something went wrong. Please try again." + err)
//       //   } else {
//       //     toastr.info("Successfully updated.")
//       //   }
//       // })

//     } else {
//       toastr.error("Something went wrong. Please try again.")
//     }
//   },  
  'click .btn-update-question'(e, tpl) {
    e.preventDefault()

    let myQid = Session.get('curQid')
    // let myQid = _selfAdminQuizQuestions.qCurId.get()
    let originLength = _selfAdminQuizQuestions.qOriginLength.get()

    let qid = $(e.currentTarget).data('qid')

    if(myQid && qid === myQid) {

      // let el = $('.quiz-question-settings-container .question-body .question-paragraph')
      let el = $('.quiz-question-settings-container .question-body').children('.question-paragraph')

      let html = ''
      let raw = ''
      //-- For some reason (prob. Blaze issue with reactive contenteditable), 
      //-- the cotent is repeated 3-> now 2 times (need to check how this happens), 
      //-- so, we need get only the last one
      //-- skipping the first two sets of question-paragraphs    
      let threshhold = originLength *1
// console.log(originLength, threshhold)
      el.each(function(i, q) {
 // console.log(i, q)
        // if(i >= threshhold ) { //-- For some reason, the first two are additionally created from somewhwere...        
          raw += " " + $(q).text()
          html += '<div class="question-paragraph">' + q.innerHTML + '</div>'          
        // }
      })

      let qObj = {
        _id: qid,
        content: html,
        contentRaw: raw
      }

      updateQuestionContent.call(qObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })

    } else {
      toastr.error("Your question session has expired. Please try again.")
    }
  },
  'click .btn-update-question-status'(e, tpl) {
    e.preventDefault()

    // let qid = $(e.currentTarget).parentsUntil('li.li-admin-quiz-question').data('qid') //-- Not working...
    let qid = $(e.currentTarget).closest('li.li-admin-quiz-question').data('qid')

    if(qid) {
      let status = $(e.currentTarget).data('status')

      let qObj = {
        _id: qid,
        status: status
      }

      updateQuestionStatus.call(qObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          toastr.info("Successfully updated.")
        }        
      })
    } else {
      toastr.error("Your question session has expired. Please try again.")
    }
  },
  'click .btn-delete-question'(e, tpl) {
    e.preventDefault()

    // let qid = $(e.currentTarget).parentsUntil('li.li-admin-quiz-question').data('qid') //-- Not working...
    let qid = $(e.currentTarget).closest('li.li-admin-quiz-question').data('qid')

    if(qid) {
      if(confirm("Are you sure to delete this question?")) {
        let status = $(e.currentTarget).data('status')

        let qObj = {
          _id: qid,
          status: 4
        }

        updateQuestionStatus.call(qObj, (err, res) => {
          if(err) {
            toastr.error("Something went wrong. Please try again." + err)
          } else {
            toastr.info("Successfully deleted.")
          }        
        })
      }
    } else {
      toastr.error("Your question session has expired. Please try again.")
    }
  }  
})

Template.AdminQuizQuestions.onDestroyed(() => {
  Session.set('curQzid', null)
  Session.set('curQid', null)
  Session.set('correctAnswers', null)
  _subsAdminQuizQuestions.clear()
})

