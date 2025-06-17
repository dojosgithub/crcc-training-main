/**
 * Quiz One-At-A-Time template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleQuizzes } from '/both/api/collections/training-module-quizzes.js'
import { TrainingModuleAnswers } from '/both/api/collections/training-module-answers.js'
import { TrainingModuleScores } from '/both/api/collections/training-module-scores.js'

import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

// import '/imports/ui/stylesheets/question.less'
// import '/imports/ui/stylesheets/templates/quiz-oaat.less'
import { QuizOAAT } from '/imports/ui/pages/templates/quiz-templates/quiz-oaat.html'

import { Util } from '/imports/api/lib/util.js'

let _selfQuizOAAT
let _subsQuizOAAT
let _thisPageData

Template.QuizOAAT.onCreated(function quizOAATOnCreated() {
  _selfQuizOAAT = this
  // console.log("aa", Session.get('curQuestions'))
  Session.set('curQuestions', null)
  Session.set('wrongAnswers', null)

  _selfQuizOAAT.qids = []
  _selfQuizOAAT.wrongAnswers = null

  // _thisPageData = this.data.pageData
  _thisPageData = this.data
  _selfQuizOAAT.pageData = this.data;
// console.log(_thisPageData)

  let myUserStats = Session.get('myUserStats')
  // console.log(myUserStats)
  _thisPageData.viewedPages = myUserStats.pages.length || 0
  _thisPageData.completedAt = myUserStats.completedAt || []

  _subsQuizOAAT = new SubsManager()
  _selfQuizOAAT.ready4Quiz = new ReactiveVar()
  _selfQuizOAAT.ready4Answers = new ReactiveVar()
  _selfQuizOAAT.ready4Scores = new ReactiveVar()

  _selfQuizOAAT.curQIdx = new ReactiveVar(0)
  _selfQuizOAAT.questionOrderType = new ReactiveVar()
  _selfQuizOAAT.qLength = new ReactiveVar()
  _selfQuizOAAT.hasNextQuestion = new ReactiveVar(true)
  _selfQuizOAAT.hasPrevQuestion = new ReactiveVar(false)
  _selfQuizOAAT.totalNumOfQuestions = new ReactiveVar()
  _selfQuizOAAT.answerType = new ReactiveVar()
  _selfQuizOAAT.answerOrderType = new ReactiveVar()
  _selfQuizOAAT.moduleId = new ReactiveVar(_thisPageData.moduleId)
  _selfQuizOAAT.showScoreFeedback = new ReactiveVar(_thisPageData.quizShowScoreFeedback)
  _selfQuizOAAT.isShuffled = new ReactiveVar(false)

  _selfQuizOAAT.autorun(() => {
    // if(_thisPageData.template) { //-- Quizzes are consided/registered as a template.
    if(_thisPageData.quizId) { //-- Quizzes are consided/registered as a template.
      // let handleQuiz = _subsQuizOAAT.subscribe('training_module_quiz_n_questions_w_qzid', _thisPageData.template)
      let handleQuiz = _subsQuizOAAT.subscribe('training_module_quiz_n_questions_w_qzid', _thisPageData.quizId)
      _selfQuizOAAT.ready4Quiz.set(handleQuiz.ready())

      let obj = {
        userId: Meteor.userId(),
        moduleId: _thisPageData.moduleId,
        quizId: _thisPageData.quizId,
      }

      let handleScores = _subsQuizOAAT.subscribe("training_module_scores_by_qz", obj)
      _selfQuizOAAT.ready4Scores.set(handleScores.ready())

    }
    if( Session.get('_selfQuizOAAT.qids')) {
      // console.log(_selfQuizOAAT.qid.get())
      // let handleAnswers = _subsQuizOAAT.subscribe('active_training_module_answers_w_qid', Session.get('_selfQuizOAAT.qid'))
      let qObj = {
        qids: Session.get('_selfQuizOAAT.qids')
      }
      let handleAnswers = _subsQuizOAAT.subscribe('active_training_module_answers_w_qids', qObj)
      _selfQuizOAAT.ready4Answers.set(handleAnswers.ready())
    }    
  })
})

Template.QuizOAAT.onRendered(function quizOAATOnRendered() {
  Tracker.autorun(() => {
    if(_selfQuizOAAT.ready4Answers.get()) {
      let allAnswers = TrainingModuleAnswers.find()

      // console.log('All Answers: ', allAnswers.fetch())

      if(allAnswers && allAnswers.fetch() && allAnswers.fetch().length > 0) {
        
        let _allAnswers = allAnswers.fetch()

        if(_selfQuizOAAT.questionOrderType.get() === 2) { //-- Random order
          _allAnswers.sort(function() { return 0.5 - Math.random() })
        }

        Session.set('allAnswers', _allAnswers)

      }      
    }
  })

  $('#quiz_oaat_intro_modal').modal('show')
})

Template.QuizOAAT.helpers({
  Quiz() {
    if(_selfQuizOAAT.ready4Quiz.get()) {    

      let quiz = !Session.get('curQz') ? TrainingModuleQuizzes.find({_id: _selfQuizOAAT.data.quizId}) : Session.get('curQz')

      // console.log("Quiz: ", quiz.fetch())
      if(quiz && quiz.fetch() && quiz.fetch().length > 0) {
        let qz = quiz.fetch()[0]
        let questions = qz.Questions

        let qs = []        
        let curQ = []
        let curQIdx = _selfQuizOAAT.curQIdx.get()
        let moduleId = _selfQuizOAAT.moduleId.get()
        let showScoreFeedback = _selfQuizOAAT.showScoreFeedback.get()

        let questionOrderType = qz.settings.questionOrderType
        let answerType = qz.settings.answerType
        let answerOrderType = qz.settings.answerOrderType
        let maxAttempts = qz.settings.possibleAttempts
        let scorePoints = qz.settings.scoreOptionPoints
        let reducePercent = qz.settings.possibleAttemptsReducePercent
        let reduceTarget = qz.settings.possibleAttemptsReduceTarget        

        _selfQuizOAAT.questionOrderType.set(questionOrderType)
        _selfQuizOAAT.answerType.set(answerType)
        _selfQuizOAAT.answerOrderType.set(answerOrderType)

        // let scores = TrainingModuleScores.find({
        //   userId: Meteor.userId(),
        //   moduleId: moduleId,
        //   quizId: qz._id          
        // })

        // let wrongAnswers
        // if(!Session.get('curQuestions')) {
        //   wrongAnswers = []

        //   if(scores && scores.fetch() && scores.fetch().length > 0) {          
            
        //     scores.fetch().forEach((s) => {
        //       if(s.feedback === 'wrong') {
        //         wrongAnswers.push.apply(wrongAnswers, s.answerIds)
        //       }
        //     })
        //   } 
        // }

        // if(!Session.get('curQuestions')) {
        //   if(questionOrderType === 2) { //-- Random order          
        //     questions.sort(function() { return 0.5 - Math.random() })
        //   } else {
        //     //-- Since DB Collection level sorting not working, 
        //     //-- this is critical and needed.
        //     questions.sort(function(q,p) {return q.order - p.order})          
        //   }
        //   // Session.set('curQuestions', _qs)
        // }

        if(_selfQuizOAAT.ready4Scores.get()) {
          let scores = TrainingModuleScores.find({
            userId: Meteor.userId(),
            moduleId: moduleId,
            quizId: qz._id          
          })

          // wrongAnswers = []

          if(scores && scores.fetch() && scores.fetch().length > 0) {          
            
            _selfQuizOAAT.wrongAnswers = []

            scores.fetch().forEach((s) => {
              if(s.feedback === 'wrong') {
                _selfQuizOAAT.wrongAnswers.push.apply( _selfQuizOAAT.wrongAnswers, s.answerIds)
              }
            })

            Session.set('wrongAnswers', _selfQuizOAAT.wrongAnswers)
          }
        }

        let _qs
        if(!Session.get('curQuestions')) {

          questions.forEach(function(q) {
            if(q.status === 1) {
              let qObj = {
                _id: q._id,
                content: q.content,
                answerType: answerType,
                answer: q.answer,
                maxAttempts: maxAttempts,
                scorePoints: scorePoints,
                curPoints: 0,
                reducePercent: reducePercent,
                reduceTarget: reduceTarget,
                order: q.order,
                moduleId: moduleId,
                showScoreFeedback: showScoreFeedback,
                dropdown: q.content.includes('[dropdown]')
                // wrongAnswers: _selfQuizOAAT.wrongAnswers
              }

              if(qObj.dropdown) {
                let 
                  contentH = q.content.split('[dropdown]')[0], //-- Head
                  contentT = q.content.split('[dropdown]')[1]  //-- Tail

                qObj.contentH = contentH
                qObj.contentT = contentT
              }

              qs.push(qObj)
              _selfQuizOAAT.qids.push(q._id)
            }
          })

          _qs = $.unique(qs)

          if(questionOrderType === 2) { //-- Random order     
          // console.log('_qs.sort: ', _qs)     
            _qs.sort(function() { return 0.5 - Math.random() })
          } else {
            //-- Since DB Collection level sorting not working, 
            //-- this is critical and needed.
            _qs.sort(function(q,p) {return q.order - p.order})          
          }
          Session.set('curQuestions', _qs)
          Session.set('curQuestion', _qs[curQIdx])

        } else {
          _qs = Session.get('curQuestions')
          // Session.set('curQuestions', _qs)
          Session.set('curQuestion',  Session.get('curQuestions')[_selfQuizOAAT.curQIdx.get()])
        }

        // if(!Session.get('curQuestions')) {
        //   if(questionOrderType === 2) { //-- Random order     
        //   // console.log('_qs.sort: ', _qs)     
        //     _qs.sort(function() { return 0.5 - Math.random() })
        //   } else {
        //     //-- Since DB Collection level sorting not working, 
        //     //-- this is critical and needed.
        //     _qs.sort(function(q,p) {return q.order - p.order})          
        //   }
        //   Session.set('curQuestions', _qs)
        //   Session.set('curQuestion', _qs[curQIdx])
        // } else {
        //   Session.set('curQuestion',  Session.get('curQuestions')[_selfQuizOAAT.curQIdx.get()])
        // }

// console.log("bb", Session.get('curQuestions'), _qs, curQIdx, _qs[curQIdx] )        

          _selfQuizOAAT.qLength.set(_qs.length)        

          Session.set('curQuiz', qz)

          // Session.set('curQuestion', _qs[curQIdx])

          let qids = $.unique(_selfQuizOAAT.qids) //-- This is critical. Otherwise, an infinate loop will be created. 
          Session.set('_selfQuizOAAT.qids', qids)

          _selfQuizOAAT.totalNumOfQuestions.set(_qs.length)
        

        // Session.set('maxAttempts', qz.settings.possibleAttempts)
        // Session.set('scorePoints', qz.settings.scoreOptionPoints)
        // Session.set('reducePercent', qz.settings.possibleAttemptsReducePercents)
        // Session.set('reduceTarget', qz.settings.possibleAttemptsReduceTarget)
      }
// console.log('ddd', quiz.fetch())
      return quiz
    }
  },
  // answerType() {
  //   return  Session.get('curQuestions').answerType
  // },
  Questions() {
    return Session.get('curQuestions')
  },
  Question() {
    
    // return Session.get('curQuestion')
    // if(Session.get('curQuestions')) {
      // Session.set('curQuestion', Session.get('curQuestions')[_selfQuizOAAT.curQIdx.get()])
    // console.log("ccc", _selfQuizOAAT.curQIdx.get(), Session.get('curQuestions'), Session.get('curQuestions')[_selfQuizOAAT.curQIdx.get()])
    // return Session.get('curQuestions')[_selfQuizOAAT.curQIdx.get()]
      return Session.get('curQuestion')
    // return Session.get('curQuestions')[_selfQuizOAAT.curQIdx.get()]
    // }
  },
  hasNextQuestion() {
    return _selfQuizOAAT.hasNextQuestion.get()
  },
  hasPrevQuestion() {
    return _selfQuizOAAT.hasPrevQuestion.get()
  },
  totalNumOfQuestions() {
    return _selfQuizOAAT.totalNumOfQuestions.get()
  },
  curQuestionEntryNum() {
    return _selfQuizOAAT.curQIdx.get() +1
  },  
  Answers() {
    let qid = this._id //-- From inside of this template.

    let answers = Session.get('allAnswers')
    let _answers = []

    if(answers && answers.length > 0) {
      answers.forEach((a) => {
        if(a.questionId === qid) {
          _answers.push(a)
        }
      })

      return _answers
    }
  },
  Answers0() {

    let qid = this._id //-- From inside of this template.

    let allAnswers = Session.get('allAnswers')
// console.log('aaa', allAnswers)

    if(!Session.get('isShuffled')) {
      console.log('bbb', allAnswers)
    if(Util.hasKey(allAnswers, 'qid', qid, 'answers')) {

      // console.log(Util.hasKey(allAnswers, qid))

      return Util.hasKey(allAnswers, 'qid', qid, 'answers')

    } else {

      let _answers
      // _selfQuizOAAT.qids.push(qid)
      // let qids = $.unique(_selfQuizOAAT.qids) //-- This is critical. Otherwise, an infinate loop will be created. 
      
      // Session.set('_selfQuizOAAT.qids', qids) //-- To get all the questions for this quiz once.

      if(_selfQuizOAAT.ready4Answers.get()) {      
        let answers = TrainingModuleAnswers.find({
          questionId: qid
        }, {
          sort: {order: 1}
        })

        // let ans = []
        // if(answers && answers.fetch() && answers.fetch().length > 0) {
        //   answers.fetch().forEach(function(a) {
        //     let aObj = {
        //       _id: a._id,
        //       content: a.content,
        //       questionId: a.questionId,
        //     }

        //     ans.push(aObj)
        //   })
        // }
  // console.log(_selfQuizOAAT.isShuffled.get() )
        // if(_selfQuizOAAT.isShuffled.get() === false && _selfQuizOAAT.answerOrderType.get() === 2) { //-- Random order
        // if(Session.get('isShuffled') === false && _selfQuizOAAT.answerOrderType.get() === 2) { //-- Random order
        if(_selfQuizOAAT.answerOrderType.get() === 2) { //-- Random order
          if(answers && answers.fetch() && answers.fetch().length > 0) {  
            _answers = answers.fetch().sort(function() { return 0.5 - Math.random() })
            
            // _selfQuizOAAT.isShuffled.set(true)

            // Session.set('hasAnswersShuffled'+qid, true)

            

            // return _answers
          }
        } else {
          _answers = answers.fetch()
        }

        let _allAnswers = allAnswers || []
        let curAnswers = {
          qid: qid,
          answers: _answers
        }

        _allAnswers.push(curAnswers)
        
        Session.set('allAnswers', _allAnswers)
        Session.set('isShuffled', true)

        return _answers
      }
    }
    }
  },
  Score() {
    // console.log("Session.get('curQuestion'))
    if(Session.get('curQuestion')) {
      let qid = this._id
      let qzid = Session.get('curQuiz')._id
      let uid = Meteor.userId()
      let moduleId = this.moduleId

      // let obj = {
      //   userId: uid,
      //   moduleId: moduleId,
      //   quizId: qzid,
      //   questionId: qid
      // }
      // let handleScores = _subsQuizOAAT.subscribe("training_module_scores", obj)
      // _selfQuizOAAT.ready4Scores.set(handleScores.ready())

      if(_selfQuizOAAT.ready4Scores.get()) {

        let scoresCursor = TrainingModuleScores.find({
          userId: uid,
          moduleId: moduleId,
          quizId: qzid,
          questionId: qid
        }) 

        let curQ = Session.get('curQuestion')
        let scores = scoresCursor.fetch()

        let numAttempts = scores.length
        let curPoints = scores.length > 0 ? scores[scores.length-1].score : 0
        let gotCorrect = scores.length > 0 && scores[scores.length-1].feedback === 'correct' ? true : false        
        let canSubmit = numAttempts < (curQ && curQ.maxAttempts) && !gotCorrect      

        curQ.numAttempts = numAttempts
        curQ.canSubmit = canSubmit
        curQ.curPoints = curPoints
        curQ.gotCorrect = gotCorrect
        Session.set('curQuestion', curQ)
// console.log(scoresCursor.fetch())
        return scoresCursor
      }
    }
  },
  wrongAnswers() {
    if(_selfQuizOAAT.ready4Scores.get()) {
      return Session.get('wrongAnswers')
    }
  },
  Instructions() {
    return _selfQuizOAAT.pageData.instructions;
  },  
})

Template.QuizOAAT.events({
  'submit form'(e, tpl) {
  // 'click .btn-submit-question'(e, tpl) {    
    e.preventDefault()

    Session.set('isShuffled', true)

    let aids = []

    let answerType = _selfQuizOAAT.answerType.get()

    let 
      // qid = $(e.currentTarget).data('qid'),
      qid = Session.get('curQuestion')._id,
      // dropdown = $(e.currentTarget).data('dropdown') || false;    
      dropdown = Session.get('curQuestion').dropdown || false;    

    if(answerType === 2) {
      $(".chkb-question-answer:checked").each(function() {
        aids.push($(this).val())
      })   
    } 
    else if(dropdown) {
      let answer = $('#sel_question_'+qid).val()
      if(answer && parseInt(answer) !== -1) {
        aids.push(answer)
      }       
    }
    else {
      let myAnswer = $(".radio-question-answer:checked").val()
      if(myAnswer) { //-- This is critical. Otherwise, 'undefined' 
        //-- value wil be added to the aids array, and will pass 
        //-- the condition below.
        aids.push(myAnswer)
      }
    }
  
// console.log(dropdown, qid, $('#sel_question_'+qid).val(), aids);

    if(aids.length > 0) {

      let curQz = Session.get('curQuiz')
      let possibleAttempts = parseInt(curQz.settings.possibleAttempts)
      let allQIds = Session.get('_selfQuizOAAT.qids')

      // if(confirm("Are you sure to submit your answer?")) {
        let curQuestion = Session.get('curQuestion')
        
        let moduleId = curQuestion.moduleId
        let correctAnswer = curQuestion.answer
        let correctAnswerLength = correctAnswer.length
        let score = 0
        let feedback = ''        

        let count = 0
        correctAnswer.forEach(function(a) {
          if(aids.indexOf(a) !== -1) {
            $(':checkbox[value="'+a+'"]').siblings('span').addClass('correct')
            count++
          } else {}
          
        })

        let attempts = curQuestion.numAttempts +1
        if(aids.length === correctAnswerLength && count === correctAnswerLength) {          
          // $('#question_feedback_'+curQuestion._id).html("You got it correct!")
          feedback = 'correct'
          if(curQuestion.reduceTarget === 1) {
            score = curQuestion.scorePoints * (curQuestion.reducePercent/100)            
          } else {
            score = curQuestion.scorePoints * Math.pow((curQuestion.reducePercent/100), curQuestion.numAttempts)
          }
        } else {
          
          // if(aids.length > correctAnswerLength) {
          //   $('#question_feedback_'+curQuestion._id).html("You picked too many answers.")
          // } else {
          //   $('#question_feedback_'+curQuestion._id).html("Please try again.")
          // }
          feedback = 'wrong'          
        }

        let scoreObj = {
          userId: Meteor.userId(),
          moduleId: moduleId,
          quizId: Session.get('curQuiz')._id,
          questionId: Session.get('curQuestion')._id,
          answerIds: aids,
          feedback: feedback,
          score: score,
          attempts: attempts
        }

        TrainingModuleScores.insert(scoreObj, (err, res) => {
          if(err) {}
          else {
            let allMyScores = TrainingModuleScores.find({
              moduleId: moduleId,
              quizId: curQz._id,
              userId: Meteor.userId(),              
              $or: [
                {attempts: possibleAttempts},
                {feedback: 'correct'}
              ]
            })

            // console.log(allMyScores.fetch())
            if(allMyScores && allMyScores.fetch() && allMyScores.fetch().length > 0) {

              let doneThisPage = true
              let scoredQIds = []

              allMyScores.fetch().forEach(function(s) {
                scoredQIds.push(s.questionId)            
              })

              if(scoredQIds.length < allQIds.length) {
                doneThisPage = false
              } else {
                allQIds.forEach(function(q) {
                  if(scoredQIds.indexOf(q) === -1) {
                    doneThisPage = false
                  }
                })
              }
// console.log(scoredQIds, allQIds)
              if(doneThisPage) {

                // let statsObj = {           
                //   userId: Meteor.userId(),
                //   moduleId: moduleId,
                //   _page: _thisPageData.index
                // }

                let statsObj = {           
                  userId: Meteor.userId(),
                  moduleId: moduleId,
                  _page: _thisPageData.index,
                  numPages: _thisPageData.numPages,            
                  viewedPages: _thisPageData.viewedPages,            
                  completedAt: _thisPageData.completedAt
                }

                upsertUserStats.call(statsObj, (err, res) => {
                  if(err) {}
                  else {
                    Session.set('myUserStats', res)
                    // $('.btn-module-navigation.btn-go-next').webuiPopover('show'); //-- unsafe-inline issue
                    toastr.success("Click 'Next' To Proceed"); //-- this fixes unsafe-iinline issue
                  }
                }) 

              }
            }
          }
          // _this.button("reset")
        })        

      // }
    } else {
      toastr.error("Please select an answer before submitting.")
    }
  },
  'click .btn-next-question'(e, tpl) {
    e.preventDefault()
    
    _selfQuizOAAT.isShuffled.set(false)
    Session.set('isShuffled', false)

    let qLength = _selfQuizOAAT.qLength.get()

    let curIdx = _selfQuizOAAT.curQIdx.get()
    let newIdx = curIdx < qLength ? curIdx +1: curIdx

    _selfQuizOAAT.curQIdx.set(newIdx)

    Session.set('curQuestion', Session.get('curQuestion')[newIdx])

    let hasNextQuestion = newIdx < qLength -1 ? true: false
    _selfQuizOAAT.hasNextQuestion.set(hasNextQuestion)
    _selfQuizOAAT.hasPrevQuestion.set(true)
    
  },
  'click .btn-prev-question'(e, tpl) {
    e.preventDefault()

    _selfQuizOAAT.isShuffled.set(false)
    Session.set('isShuffled', false)

    let qLength = _selfQuizOAAT.qLength.get()

    let curIdx = _selfQuizOAAT.curQIdx.get()
    let newIdx = curIdx > 0 ? curIdx -1: 0    

    _selfQuizOAAT.curQIdx.set(newIdx)

    Session.set('curQuestion', Session.get('curQuestion')[newIdx])    

    let hasPrevQuestion = newIdx > 0 ? true: false
    _selfQuizOAAT.hasPrevQuestion.set(hasPrevQuestion)

    let hasNextQuestion = qLength > 1 ? true: false
    _selfQuizOAAT.hasNextQuestion.set(hasNextQuestion)
  },
  'click .btn-view-my-answers'(e, tpl) {
    e.preventDefault()

    let fid = $(e.currentTarget).data('fid')
    $(e.currentTarget).blur()

    let scores = TrainingModuleScores.findOne(fid)
    if(scores && scores.answerIds && scores.answerIds.length > 0) {
      $('.btn-show-correct-answer i').removeClass('viewing')
      $('.btn-view-my-answers i').removeClass('viewing')
      $('.chkb-question-answer').prop('checked', false)
      $('.radio-question-answer').prop('checked', false)

      scores.answerIds.forEach(function(aid) {
        $('input[type=checkbox][value='+aid+']').prop('checked', true)
        $('input[type=radio][value='+aid+']').prop('checked', true)
        // $('input[type=checkbox][value='+aid+']').closest('span').addClass(scores.feedback)
      })

      $(e.currentTarget).find('i').addClass('viewing')
    }
  },
  'click .btn-show-correct-answer'(e, tpl) {
    e.preventDefault()

    let qid = $(e.currentTarget).data('qid')

    // let q = TrainingModuleQuestions.findOne(qid)
    let qs = Session.get('curQuestions')

    $('.btn-view-my-answers i').removeClass('viewing')
    $('.btn-show-correct-answer i').removeClass('viewing')

    if(qs && qs.length > 0) {
      let q = qs.filter((q) => {
        return q._id === qid
      })
      
      let answerIds = q[0].answer

      // console.log(q, answerIds)

      $("#ul_answers_"+qid+" li.li-answer input").each(function(i) {
        // console.log($(this).val())
        if(answerIds.indexOf($(this).val()) !== -1) {
          $(this).prop('checked', true)
        }
      })

      $(e.currentTarget).find('i').addClass('viewing')

    }

    // console.log(qs, q)
    $(e.currentTarget).blur()
  }  
})

Template.QuizOAAT.onDestroyed(() => {
  _subsQuizOAAT.clear()
  _selfQuizOAAT.data = null
  _selfQuizOAAT.ready4Quiz.set(null)
  _selfQuizOAAT.ready4Answers.set(null)
  _selfQuizOAAT.ready4Scores.set(null)
  Session.set('curQuestions', null)
  Session.set('wrongAnswers', null)

})
