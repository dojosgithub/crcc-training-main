/**
 * Quiz All-At-Once template logic
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
// import '/imports/ui/stylesheets/templates/quiz-aao.less'
import { QuizAAO } from '/imports/ui/pages/templates/quiz-templates/quiz-aao.html'

let _selfQuizAAO
let _subsQuizAAO
let _thisPageData

Template.QuizAAO.onCreated(function quizAAOOnCreated() {
  
  Session.set('_selfQuizAAO.wrongAnswers', [])

  _selfQuizAAO = this

  _selfQuizAAO.shuffled = {
    q: false, //-- questions
    a: false //-- answers
  };
  
  // _selfQuizAAO.qids = [];
  _selfQuizAAO.allQsByIds = [];
  _selfQuizAAO.allQsById = [];
  _selfQuizAAO.settings = {};
  _selfQuizAAO.scoreDict = [];

  Session.set('_selfQuizAAO.qids', [])
  Session.set("QuizAAO.shuffled", null); //-- to avoid shuffling questions/answers again when user submit the answer, 

  // _selfQuizAAO.qHasAnswersShuffled = [] //-- array of Q(id)'s with shuffled answers

  // _thisPageData = this.data.pageData
  _thisPageData = this.data;
  _selfQuizAAO.pageData = this.data;

  _selfQuizAAO.moduleId = _thisPageData.moduleId;

  _subsQuizAAO = new SubsManager()
  _selfQuizAAO.ready4Quiz = new ReactiveVar()
  _selfQuizAAO.ready4MyQuiz = new ReactiveVar()
  _selfQuizAAO.ready4Answers = new ReactiveVar()
  _selfQuizAAO.ready4Scores = new ReactiveVar()

  _selfQuizAAO.curQIdx = new ReactiveVar(0)
  _selfQuizAAO.totalNumOfQuestions = new ReactiveVar()
  _selfQuizAAO.answerType = new ReactiveVar()
  _selfQuizAAO.answerOrderType = new ReactiveVar(1)
  // _selfQuizAAO.moduleId = new ReactiveVar(_thisPageData.moduleId)
  _selfQuizAAO.showScoreFeedback = new ReactiveVar(_thisPageData.quizShowScoreFeedback)

  _selfQuizAAO.autorun(() => {
    // // if(_thisPageData.template) { //-- Quizzes are consided/registered as a template.
    // if(_thisPageData.quizId //-- Quizzes are consided/registered as a template.
    //   //-- meteor/db update seems to cause reactive var to create an infinite loop/high CPU usage (11/21/2018, dq)
    //   //-- no question appears,so,this condition is critical to show quiz questions
    //   && !_selfQuizAAO.ready4Quiz.get()) { 
    //   // let handleQuiz = _subsQuizAAO.subscribe('training_module_quiz_n_questions_w_qzid', _thisPageData.template)
    //   let handleQuiz = _subsQuizAAO.subscribe('training_module_quiz_n_questions_w_qzid', _thisPageData.quizId)
    //   _selfQuizAAO.ready4Quiz.set(handleQuiz.ready())

    //   let obj4MyQuiz = {
    //     userId: Meteor.userId(),
    //     quizId: _thisPageData.quizId
    //   }
    //   let handleMyQuiz = _subsQuizAAO.subscribe('training_module_user_quizzes_by_uid_n_qzid', obj4MyQuiz)
    //   _selfQuizAAO.ready4MyQuiz.set(handleMyQuiz.ready())

    // }
    // if( Session.get('_selfQuizAAO.qids') 
    //   && !_selfQuizAAO.ready4Answers.get()) { //-- this condition is critical to avoid an infinite loop (11/21/2018, dq)
    //   // console.log(_selfQuizAAO.qid.get())
    //   // let handleAnswers = _subsQuizAAO.subscribe('active_training_module_answers_w_qid', Session.get('_selfQuizAAO.qid'))
    //   let qObj = {
    //     qids: Session.get('_selfQuizAAO.qids')
    //   }
    //   let handleAnswers = _subsQuizAAO.subscribe('active_training_module_answers_w_qids', qObj)
    //   _selfQuizAAO.ready4Answers.set(handleAnswers.ready())
    // }    
  })

  Template.QuizAAO.__helpers.get("getQuizData").call();
})

Template.QuizAAO.onRendered(function quizAAOOnRendered() {

  // _selfQuizAAO.qHasAnswersShuffled = []

  Tracker.autorun(() => {
    // if(_selfQuizAAO.ready4Quiz.get()) {

    //   let quiz = TrainingModuleQuizzes.find({}, {
    //     sort: {'order': 1}
    //   })

    //   if(quiz && quiz.fetch() && quiz.fetch().length > 0) {
    //     let qz = quiz.fetch()[0]
    //     let questions = qz.Questions

    //     console.log(questions)
    //   }

    // }


    // if(_selfQuizAAO.ready4Answers.get()) {      
    //   let answers = TrainingModuleAnswers.find({
    //     // questionId: qid
    //   }, {
    //     sort: {order: 1}
    //   }, { reactive: false })

    //   let ans = []
    //   if(answers && answers.fetch() && answers.fetch().length > 0) {
    //     answers.fetch().forEach(function(a) {
    //       let aObj = {
    //         _id: a._id,
    //         content: a.content,
    //         questionId: a.questionId,
    //       }

    //       ans.push(aObj)
    //     })
    //   }

    //   let _answers = []
  
    //   if(answers && answers.fetch() && answers.fetch().length > 0) {  
    //     if(_selfQuizAAO.answerOrderType.get() === 2) { //-- Random order
    //       _answers = answers.fetch().sort(function() { return 0.5 - Math.random() })
    //       console.log(_answers)
          
    //       _selfQuizAAO.qHasAnswersShuffled.push(qid)
    //       _selfQuizAAO.allQsByIds[qid].answers = _answers
          
    //     } else {
    //       _answers = answers.fetch()
    //     }
    //   }

    let scores = TrainingModuleScores.find({
      userId: Meteor.userId(),
      moduleId: _thisPageData.moduleId,
      quizId: _thisPageData.quizId          
    })

    let wrongAnswers = []

    if(scores && scores.fetch() && scores.fetch().length > 0) {          
      
      scores.fetch().forEach((s) => {
        if(s.feedback === 'wrong') {
          wrongAnswers.push.apply(wrongAnswers, s.answerIds)
        }
      })

      Session.set('_selfQuizAAO.wrongAnswers', wrongAnswers)
    }

  })

  $('#quiz_aao_intro_modal').modal('show')

})

Template.QuizAAO.helpers({
  getQuizData() {

    let 
      _userId = Meteor.userId(),
      _moduleId = _selfQuizAAO.moduleId,
      _quizId = _selfQuizAAO.data.quizId;

    let _scoreObj = {
      userId: _userId,
      moduleId: _moduleId,
      quizId: _quizId      
    }
      
    Meteor.subscribe("training_module_scores_by_qz", _scoreObj)
// console.log(_thisPageData)
    Meteor.call("Quiz.AAO.getData", {
      moduleId: _moduleId,
      quizId: _quizId,
      userId: _userId,
      pageIdx: _thisPageData.index || 0
    }, (err, res) => {
      if(err) {

      } else {
        // console.log(res);

        if(res && res.success) {
          if(res.data && res.data.quizData && res.data.quizData.length > 0) {

            if(res.data.scoreData && res.data.scoreData.length > 0) {
              res.data.scoreData.forEach((s) => {
                if(!_selfQuizAAO.scoreDict[s.questionId]) {
                  _selfQuizAAO.scoreDict[s.questionId] = {
                    numAttempts: 0,
                    gotCorrect: false,
                    correctAnswers: [],
                    wrongAnswers: []
                  }
                }

                _selfQuizAAO.scoreDict[s.questionId].numAttempts++;
                if(s.feedback === 'correct') {
                  _selfQuizAAO.scoreDict[s.questionId].gotCorrect = true;
                  if(s.answerIds && s.answerIds.length > 0) {
                    s.answerIds.forEach((w) => {
                      _selfQuizAAO.scoreDict[s.questionId].correctAnswers.push(w);
                    })
                  }                  
                }
                else if(s.feedback === 'wrong') {
                  if(s.answerIds && s.answerIds.length > 0) {
                    s.answerIds.forEach((w) => {
                      _selfQuizAAO.scoreDict[s.questionId].wrongAnswers.push(w);
                    })
                  }                  
                }

              });
            }

            let 
              _qzData = [],
              _qzObj = {
                _id: null,
                numQs: 0,
                settings: {},
                questions: [],
                moduleId: _moduleId
              };

            res.data.quizData.forEach((d, i) => {
              if(i === 0) { //-- actually res.data has only one data, so, this may not be needed, but, just in case...
                
                let 
                  _qzSettings = d.settings,
                  _qs = [],
                  _shuffled = Session.get("QuizAAO.shuffled") || false;

                _selfQuizAAO.settings = _qzSettings;

                if(d.questions && d.questions.length > 0) {
                  
                  _selfQuizAAO.qids = [];

                  d.questions.forEach((q) => {

                    let
                      _qid = q.q._id,
                      _content = q.q.content,
                      _answer = q.q.answer, //-- correct answer id(s)
                      _correctAnswers =  _selfQuizAAO.scoreDict[_qid] && _selfQuizAAO.scoreDict[_qid].correctAnswers || [], //-- array of correct answer ids the user picked
                      _wrongAnswers =  _selfQuizAAO.scoreDict[_qid] && _selfQuizAAO.scoreDict[_qid].wrongAnswers || [], //-- array of wrong answer ids the user picked
                      _ans = q.ans, //-- list of answer choices
                      _maxAttempts = _qzSettings.possibleAttempts,
                      _reduceTarget = _qzSettings.possibleAttemptsReduceTarget,
                      _reducePercent = _qzSettings.possibleAttemptsReducePercent,
                      _scoreOption = _qzSettings.scoreOption,
                      _scorePoints = _qzSettings.scoreOptionPoints;

                    if(_qzSettings.answerOrderType === 2) { //-- answers in a random order
                      _ans = shuffle(q.ans);
                    }

                    let 
                      _numAttempts = _selfQuizAAO.scoreDict[_qid] && _selfQuizAAO.scoreDict[_qid].numAttempts || 0,
                      _gotCorrect = _selfQuizAAO.scoreDict[_qid] && _selfQuizAAO.scoreDict[_qid].gotCorrect || false,
                      _canSubmit = _numAttempts < _maxAttempts && !_gotCorrect,
                      _isDropdown = _content.includes('[dropdown]');

                    let _qObj = {
                      _id: _qid,
                      qzId: _quizId,
                      content: _content,
                      dropdown: _isDropdown,                      
                      answers: _ans,
                      answer: _answer,
                      correctAnswers: _correctAnswers,
                      wrongAnswers: _wrongAnswers,
                      answerType: _qzSettings.answerType,
                      moduleId: _moduleId,
                      numAttempts: _numAttempts,
                      gotCorrect: _gotCorrect,
                      maxAttempts: _maxAttempts,
                      canSubmit: _canSubmit,
                      scoreOption: _scoreOption,
                      scorePoints: _scorePoints,

                    }

                    if(_isDropdown) {
                      let 
                        contentH = _content.split('[dropdown]')[0], //-- Head
                        contentT = _content.split('[dropdown]')[1];  //-- Tail

                      _qObj.contentH = contentH;
                      _qObj.contentT = contentT;
                    }                   

                    _qs.push(_qObj);

                    _selfQuizAAO.allQsById[_qid] = _qObj;
                    _selfQuizAAO.qids.push(_qid);

                  }) //-- d.questions.forEach((q) => {

                  if(_qzSettings.questionOrderType === 2) { //-- questions in a random order
                    _qs = shuffle(_qs);
                  }

                  _qzObj.questions = _qs;
                }

                _qzObj._id = d.qzId;
                _qzObj.settings = _qzSettings;
                _qzObj.numQs = d.numQs;

// console.log(_shuffled, _qs, _qzObj)

                _qzData.push(_qzObj);

                Session.set("QuizAAO.data", _qzObj);

                Session.set('curQuiz', _qzObj)
                Session.set('curQuestions', _qs)                  
              } //-- i === 0
            })
          }
        }
      }
    })
  },
  QuizData() {
    if(Session.get("QuizAAO.data")) {
      // console.log(Session.get("QuizAAO.data"))
      return Session.get("QuizAAO.data")
    }
  },
  Instructions() {
    // console.log(_selfQuizAAO.pageData.instructions)
    return _selfQuizAAO.pageData.instructions
  },
  Quiz0() {

    // let _qz = [0];
// console.log('Quiz => ', _selfQuizAAO.ready4Quiz.get())
    if(_selfQuizAAO.ready4Quiz.get()) {
      let quiz = TrainingModuleQuizzes.find({
        _id: _selfQuizAAO.data.quizId
      }, {
        sort: {'order': 1}
      }, {reactive: false})
   
      if(quiz && quiz.fetch() && quiz.fetch().length > 0) {
        qz = quiz.fetch()[0]
        let questions = qz.Questions

        let qs = []
        let qIds = []
        let curQ = []
        let curQIdx = _selfQuizAAO.curQIdx.get()
        let moduleId = _selfQuizAAO.moduleId.get()
        let showScoreFeedback = _selfQuizAAO.showScoreFeedback.get()

        let questionOrderType = qz.settings.questionOrderType
        let answerType = qz.settings.answerType
        let answerOrderType = qz.settings.answerOrderType
        if(answerOrderType === 2) {
          _selfQuizAAO.answerOrderType.set(2)
        }
        let maxAttempts = qz.settings.possibleAttempts
        let scorePoints = qz.settings.scoreOptionPoints
        let reducePercent = qz.settings.possibleAttemptsReducePercent
        let reduceTarget = qz.settings.possibleAttemptsReduceTarget        

        _selfQuizAAO.answerType.set(answerType)

        // let scores = TrainingModuleScores.find({
        //   userId: Meteor.userId(),
        //   moduleId: moduleId,
        //   quizId: qz._id          
        // }, { reactive: false })

        // let wrongAnswers = []

        // if(scores && scores.fetch() && scores.fetch().length > 0) {          
          
        //   scores.fetch().forEach((s) => {
        //     if(s.feedback === 'wrong') {
        //       wrongAnswers.push.apply(wrongAnswers, s.answerIds)
        //     }
        //   })
        // }

        if(questions) {
          questions.forEach(function(q) {
            
            if(q.status === 1) {
              let qObj = {
                _id: q._id,
                content: q.content,
                answerType: answerType,
                answerOrderType: answerOrderType,
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
                // wrongAnswers: wrongAnswers              
              }
// console.log(qObj)
              if(qObj.dropdown) {
                let 
                  contentH = q.content.split('[dropdown]')[0], //-- Head
                  contentT = q.content.split('[dropdown]')[1]  //-- Tail

                qObj.contentH = contentH
                qObj.contentT = contentT
              }

              qs.push(qObj)
              // qIds.push({qid: q._id, answers: []})
              _selfQuizAAO.allQsByIds[q._id] = qObj            
            }

          }) //-- questions.forEach(function(q) {

          if(questionOrderType === 2 && !_selfQuizAAO.shuffled.q) { //-- Random order
            // qs.sort(function() { return 0.5 - Math.random() })
            qs = shuffle(qs);

            _selfQuizAAO.shuffled.q = true;
            // qIds.sort(function() { return 0.5 - Math.random() })

            // import('/imports/api/methods/training-module-user-quizzes').then(methods => {
            //   const { upsertUserQuiz } = methods

            //   let userQuizObj = {
            //     userId: Meteor.userId(),
            //     moduleId: moduleId,
            //     quizId: qz._id,
                
            //   }
            //   // TrainingModuleUserQuizzes.insert()
            //   // upsertUserQuiz.call(obj, (err, res) => {

            //   // })
            // })
            
          } else {
            //-- Since DB Collection level sorting not working, 
            //-- this is critical and needed.
            qs.sort(function(q,p) {return q.order - p.order})          
          }

          // //-- Since DB Collection level sorting not working, 
          // //-- this is critical and needed.
          // qs.sort(function(q,p) {return q.order - p.order})
          
          Session.set('curQuiz', qz)
          Session.set('curQuestions', qs)        

          _selfQuizAAO.totalNumOfQuestions.set(qs.length)

          // Session.set('maxAttempts', qz.settings.possibleAttempts)
          // Session.set('scorePoints', qz.settings.scoreOptionPoints)
          // Session.set('reducePercent', qz.settings.possibleAttemptsReducePercents)
          // Session.set('reduceTarget', qz.settings.possibleAttemptsReduceTarget)

          // quiz.fetch()[0].questions = qs

        } //-- if(questions) {

        // console.log(quiz)

        // return quiz
        // return quiz.fetch();
        return quiz

        // let _quiz = quiz.fetch()[0]
        // _quiz['_Questions'] = qs

        // return [_quiz] //-- this is critical, otherwise #each cannot work b/c it's not an array or a cursor

      }

      // _selfQuizAAO.ready4Quiz.set(false);

    } //-- if(_selfQuizAAO.ready4Quiz.get()) {

    // return _selfQuizAAO.ready4Quiz.get()

    // return _qz;
  },
  // answerType() {
  //   return  Session.get('curQuestions').answerType
  // },
  _Questions() {
    // console.log('Questions')
    // console.log(Session.get('curQuestions'))
    return Session.get('curQuestions')
  },
  Question() {
    return Session.get('curQuestion')
  },
  hasNextQuestion() {
    return _selfQuizAAO.hasNextQuestion.get()
  },
  hasPrevQuestion() {
    return _selfQuizAAO.hasPrevQuestion.get()
  },
  totalNumOfQuestions() {
    return _selfQuizAAO.totalNumOfQuestions.get()
  },
  curQuestionEntryNum() {
    return _selfQuizAAO.curQIdx.get() +1
  },  
  Answers() {

    // console.log('Answers')

    let qid = this._id //-- From inside of this template.
    _selfQuizAAO.qids.push(qid)
    let qids = $.unique(_selfQuizAAO.qids) //-- This is critical. Otherwise, an infinate loop will be created. 
    
    Session.set('_selfQuizAAO.qids', qids) //-- To get all the questions for this quiz once.

    if(_selfQuizAAO.ready4Answers.get()) {
      let answers = TrainingModuleAnswers.find({
        questionId: qid
      }, {
        sort: {order: 1}
      }, { reactive: false })

      let ans = []
      if(answers && answers.fetch() && answers.fetch().length > 0) {
        answers.fetch().forEach(function(a) {
          let aObj = {
            _id: a._id,
            content: a.content,
            questionId: a.questionId,
          }

          ans.push(aObj)
        })
      }

      if(answers && answers.fetch() && answers.fetch().length > 0) {
        let _answers

        if(!_selfQuizAAO.allQsByIds[qid].answers) {
          if(this.answerOrderType === 2 && !_selfQuizAAO.shuffled.a) { //-- Random order          
            // _answers = answers.fetch().sort(function() { return 0.5 - Math.random() })
            _answers = shuffle(answers.fetch());
            _selfQuizAAO.shuffled.a = true;
          } else {
            _answers = answers.fetch()
          }        
          
          // _selfQuizAAO.qHasAnswersShuffled.push(qid)
          _selfQuizAAO.allQsByIds[qid].answers = _answers
// console.log(_answers)
          return _answers
        } else {

// console.log(_selfQuizAAO.allQsByIds[qid].answers)          
          return _selfQuizAAO.allQsByIds[qid].answers
        }
      }

      // _selfQuizAAO.ready4Answers.set(false);
    }
  },
  AnswersDropdown() {

    let qid = this._id //-- From inside of this template.
    _selfQuizAAO.qids.push(qid)
    let qids = $.unique(_selfQuizAAO.qids) //-- This is critical. Otherwise, an infinate loop will be created. 
    
    Session.set('_selfQuizAAO.qids', qids) //-- To get all the questions for this quiz once.

    // if(_selfQuizAAO.ready4Answers.get()) {
      let answers = TrainingModuleAnswers.find({
        questionId: qid
      }, {
        sort: {order: 1}
      }, { reactive: false })

      let ans = []
      if(answers && answers.fetch() && answers.fetch().length > 0) {
        answers.fetch().forEach(function(a) {
          let aObj = {
            _id: a._id,
            content: a.content,
            questionId: a.questionId,
          }

          ans.push(aObj)
        })
      }

      if(answers && answers.fetch() && answers.fetch().length > 0) {
        let _answers

        if(!_selfQuizAAO.allQsByIds[qid].answers) {
          if(this.answerOrderType === 2 && !_selfQuizAAO.shuffled.a) { //-- Random order          
            // _answers = answers.fetch().sort(function() { return 0.5 - Math.random() })
            _answers = shuffle(answers.fetch());
            _selfQuizAAO.shuffled.a = true;
          } else {
            _answers = answers.fetch()
          }        
          
          // _selfQuizAAO.qHasAnswersShuffled.push(qid)
          _selfQuizAAO.allQsByIds[qid].answers = _answers

          return _answers
        } else {
          return _selfQuizAAO.allQsByIds[qid].answers
        }
      }
    // }
  },  
  Score0() {
    // console.log(this)
    // if(Session.get('curQuestion')) {
      let qid = this._id
      let qzid = Session.get('curQuiz')._id
      let uid = Meteor.userId()
      let moduleId = this.moduleId

      let obj = {
        userId: uid,
        moduleId: moduleId,
        quizId: qzid,
        questionId: qid
      }

      // let handleScores = _subsQuizAAO.subscribe("training_module_scores", obj) //-- This causes infinite loop when the number of questions is more than 7
      Meteor.subscribe("training_module_scores", obj) //-- so, this is the solution for now...
      // _selfQuizAAO.ready4Scores.set(handleScores.ready())

      // if(_selfQuizAAO.ready4Scores.get()) {

        let scoresCursor = TrainingModuleScores.find({
          userId: uid,
          moduleId: moduleId,
          quizId: qzid,
          questionId: qid
        }) 

        // if(scoresCursor && scoresCursor.fetch().length > 0) { //-- this blocks showing correct answer reactively
          let curQ = _selfQuizAAO.allQsByIds[qid]
          let scores = scoresCursor.fetch()

          let numAttempts = scores.length
          let curPoints = scores.length > 0 ? scores[scores.length-1].score : 0
          let gotCorrect = scores.length > 0 && scores[scores.length-1].feedback === 'correct' ? true : false        
          let canSubmit = numAttempts < (curQ && curQ.maxAttempts) && !gotCorrect

          curQ.numAttempts = numAttempts
          curQ.canSubmit = canSubmit
          curQ.curPoints = curPoints
          curQ.gotCorrect = gotCorrect
          _selfQuizAAO.allQsByIds[qid] = curQ

          //-- This doesn't look good, but needed to make it 
          //- reactive and show the correct answer for now.
          let allQs = Session.get('curQuestions')
          let newAllQs = []
          allQs.forEach(function(q) {
            if(q._id === qid) {
              q.numAttempts = numAttempts
              q.canSubmit = canSubmit
              q.curPoints = curPoints
              q.gotCorrect = gotCorrect
            }

            newAllQs.push(q)
          })

          Session.set('curQuestions', newAllQs)

          return scoresCursor
        // }
      // }
    // }
  },
  wrongAnswers() {    
    return Session.get('_selfQuizAAO.wrongAnswers')
  }
})

Template.QuizAAO.events({
  'click .btn-submit-question'(e, tpl) {
    e.preventDefault()

    let 
      qid = $(e.currentTarget).data('qid'),
      dropdown = $(e.currentTarget).data('dropdown') || false;

    let 
      curQuestion = _selfQuizAAO.allQsById[qid],
      curQz = Session.get('QuizAAO.data');
// console.log(qid, curQuestion)
    if(curQz && curQz.settings && curQz.settings.possibleAttempts &&
      curQuestion && (curQuestion.maxAttempts > 0) && (curQuestion.numAttempts >= 0) 
      && (curQz.settings.possibleAttempts-1 >= curQuestion.numAttempts)) {

      let aids = []

      let answerType = _selfQuizAAO.settings.answerType;
  // console.log(answerType)
      if(answerType === 2) { //-- multiple answers
        $("#ul_answers_"+qid).find('.chkb-question-answer:checked').each(function() {
          aids.push($(this).val())
        })   
      } 
      else if(dropdown) {
        let answer = $('#sel_question_'+qid).val()
        if(parseInt(answer) !== -1) {
          aids.push(answer)
        } 
        // else {
        //   toastr.error("Please select an answer.")
        // }
      }
      else {
        let myAnswer = $("#ul_answers_"+qid).find(".radio-question-answer:checked").val()
        if(myAnswer) { //-- This is critical. Otherwise, 'undefined' 
          //-- value wil be added to the aids array, and will pass 
          //-- the condition below.
          aids.push(myAnswer)
        }
      }

      if(aids.length > 0) {

        let 
          _this = $(e.currentTarget),
          // curQz = Session.get('curQuiz'),
          // curQz = Session.get('QuizAAO.data'),
          // curQuestion = _selfQuizAAO.allQsById[qid],
          possibleAttempts = curQz.settings.possibleAttempts,
          numAttempts = curQuestion.numAttempts,
          maxAttempts = curQuestion.maxAttempts,
          allQIds = _selfQuizAAO.qids,
          moduleId = _selfQuizAAO.moduleId,
          correctAnswer = curQuestion.answer,
          canSubmit = curQuestion.canSubmit,
          correctAnswerLength = correctAnswer.length,
          correctAnswers = curQuestion.correctAnswers,
          wrongAnswers = curQuestion.wrongAnswers,
          score = 0,
          feedback = '';

        let uid = Meteor.userId();

        let _trScoreObj = {
          userId: uid,
          moduleId: moduleId,
          quizId: curQz._id,
          questionId: qid
        };

          let 
            count = 0,
            _myWrongAnswers = [];

          correctAnswer.forEach(function(a,i) {
            if(aids.indexOf(a) !== -1) { //-- if the answer is one of the correct answers
              $("#ul_answers_"+qid).find(':checkbox[value="'+a+'"]').siblings('span').addClass('correct')
              $("#ul_answers_"+qid).find(':radio[value="'+a+'"]').siblings('span').addClass('correct')
              
              count++;

              // curQuestion.correctAnswers.push(a);
              _selfQuizAAO.allQsById[qid].correctAnswers.push(a);

            } else {
              // _myWrongAnswers.push()
              // curQuestion.wrongAnswers.push(aids[i]);
              _selfQuizAAO.allQsById[qid].wrongAnswers.push(aids[i]);
            }
            
          })

          // curQuestion.wrongAnswers.

  // console.log(aids, correctAnswer, curQuestion.wrongAnswers);

          let attempts = curQuestion.numAttempts +1
          // curQuestion.numAttempts += 1;
          // console.log(attempts, curQuestion.numAttempts)
          if(aids.length === correctAnswerLength && count === correctAnswerLength) {          
            // $('#question_feedback_'+curQuestion._id).html("You got it correct!")
            feedback = 'correct'
            if(curQuestion.reduceTarget === 1) {
              score = curQuestion.scorePoints * (curQuestion.reducePercent/100)            
            } else {
              score = curQuestion.scorePoints * Math.pow((curQuestion.reducePercent/100), attempts)
            }

            // curQuestion.gotCorrect = true;
            // curQuestion.canSubmit = false;

            _selfQuizAAO.allQsById[qid].gotCorrect = true;
            _selfQuizAAO.allQsById[qid].canSubmit = false;
          } else {
            
            // if(aids.length > correctAnswerLength) {
            //   $('#question_feedback_'+curQuestion._id).html("You picked too many answers.")
            // } else {
            //   $('#question_feedback_'+curQuestion._id).html("Please try again.")
            // }
            feedback = 'wrong'   

            // let wrongAnswers = Session.get('_selfQuizAAO.wrongAnswers')
            // wrongAnswers.push(aids[0])
            // curQuestion.wrongAnswers.push()
            // let _wrongAnswers = $.unique(wrongAnswers)

            // curQuestion.gotCorrect = false;

            // Session.set('_selfQuizAAO.wrongAnswers', _wrongAnswers)
          }
  // console.log(attempts, maxAttempts)
          if(attempts === maxAttempts) {
            // curQuestion.canSubmit = false;
            _selfQuizAAO.allQsById[qid].canSubmit = false;
          }

          _selfQuizAAO.allQsById[qid].numAttempts = attempts;

          let scoreObj = {
            userId: Meteor.userId(),
            moduleId: moduleId,
            quizId: curQz._id,
            questionId: qid,
            answerIds: aids,
            feedback: feedback,
            score: score,
            attempts: attempts,
            // attempts: curQuestion.numAttempts
          }

  // console.log(scoreObj)

          TrainingModuleScores.insert(scoreObj, (err, res) => {
            if(err) {}
            else {            

              let _nQs = [];

              curQz.questions.forEach((q) => {
                let _nQ = q;
                if(q._id === qid) {                
                  // curQuestion.numAttempts = attempts;
                  _nQ = _selfQuizAAO.allQsById[qid];
                }

                _nQs.push(_nQ);
              })

              curQz.questions = _nQs;

              Session.set("QuizAAO.data", curQz); //-- to update the question data

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
                let 
                  _scoredQIds = [],
                  scoredQIds = []

                allMyScores.fetch().forEach(function(s) {
                  if(!_scoredQIds.includes(s.questionId)) {
                    _scoredQIds.push(s.questionId);
                  } 
                })

                scoredQIds = unique(_scoredQIds);

                if(scoredQIds.length < allQIds.length) {
                  doneThisPage = false
                } else {
                  allQIds.forEach(function(q) {
                    if(scoredQIds.indexOf(q) === -1) {
                      doneThisPage = false
                    }
                  })
                }

  // console.log(scoredQIds.length, allQIds.length, doneThisPage)
  // console.log(scoredQIds, allQIds, doneThisPage)

                if(doneThisPage) {

                  let statsObj = {           
                    userId: Meteor.userId(),
                    moduleId: moduleId,
                    _page: _thisPageData.index            
                  }

                  upsertUserStats.call(statsObj, (err, res) => {
                    // console.log(err, res)
                    if(err) {}
                    else {
                      Session.set('myUserStats', res)

                      // $('.btn-module-navigation.btn-go-next').not('.btn-disabled').webuiPopover('show'); //-- unsafe-inline issue
                      toastr.success("Click 'Next' To Proceed"); //-- this fixes unsafe-iinline issue
                    }
                  }) 

                }
              } //-- if(allMyScores && allMyScores.fetch() && allMyScores.fetch().length > 0) {
            }
            // _this.button("reset")

            // Session.set("QuizAAO.shuffled", true);
            // Template.QuizAAO.__helpers.get("getQuizData").call();
          })

        // }
      } else {
        toastr.error("Please select an answer before submitting.")
      }

    } else {
      toastr.error("If this issue persists, please contact us at help@craassessments.com.");
      toastr.error("Please sign-out and sign-in again if this message still appears.");
      toastr.error("Please go back to the 'Modules' page, then, come back and take this Quiz again.");
      toastr.error("Not all data is valid. Please check your internet connection.");
    }
  },  
  'click .btn-submit-question0'(e, tpl) {
    e.preventDefault()

    let 
      qid = $(e.currentTarget).data('qid'),
      dropdown = $(e.currentTarget).data('dropdown') || false;

    let aids = []

    let answerType = _selfQuizAAO.answerType.get()

    if(answerType === 2) { //-- multiple answers
      $("#ul_answers_"+qid).find('.chkb-question-answer:checked').each(function() {
        aids.push($(this).val())
      })   
    } 
    else if(dropdown) {
      let answer = $('#sel_question_'+qid).val()
      if(parseInt(answer) !== -1) {
        aids.push(answer)
      } 
      // else {
      //   toastr.error("Please select an answer.")
      // }
    }
    else {
      let myAnswer = $("#ul_answers_"+qid).find(".radio-question-answer:checked").val()
      if(myAnswer) { //-- This is critical. Otherwise, 'undefined' 
        //-- value wil be added to the aids array, and will pass 
        //-- the condition below.
        aids.push(myAnswer)
      }
    }

    if(aids.length > 0) {

      let curQz = Session.get('curQuiz')
      let possibleAttempts = curQz.settings.possibleAttempts
      let _allQIds = Session.get('_selfQuizAAO.qids')
      // let allQIds = $.unique(_allQIds); //-- not working
      let allQIds = unique(_allQIds); //-- not working
// console.log("Unique All QIds => ",allQIds)
      // if(confirm("Are you sure to submit your answer?")) {
        
        let _this = $(e.currentTarget)
        // _this.button("loading")

        let curQuestion = _selfQuizAAO.allQsByIds[qid]
        let moduleId = curQuestion.moduleId
      
        let correctAnswer = curQuestion.answer
        let correctAnswerLength = correctAnswer.length
        let score = 0
        let feedback = ''        

        let count = 0
        correctAnswer.forEach(function(a) {
          if(aids.indexOf(a) !== -1) {
            $("#ul_answers_"+qid).find(':checkbox[value="'+a+'"]').siblings('span').addClass('correct')
            $("#ul_answers_"+qid).find(':radio[value="'+a+'"]').siblings('span').addClass('correct')
            count++
          } else {}
          
        })

        let attempts = curQuestion.numAttempts +1
        // console.log(attempts, curQuestion.numAttempts)
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

          let wrongAnswers = Session.get('_selfQuizAAO.wrongAnswers')
          wrongAnswers.push(aids[0])
          let _wrongAnswers = $.unique(wrongAnswers)

          Session.set('_selfQuizAAO.wrongAnswers', _wrongAnswers)
        }

        let scoreObj = {
          userId: Meteor.userId(),
          moduleId: moduleId,
          quizId: curQz._id,
          questionId: qid,
          answerIds: aids,
          feedback: feedback,
          score: score,
          attempts: attempts,

        }

        TrainingModuleScores.insert(scoreObj, (err, res) => {
          if(err) {}
          else {
            let allMyScores = TrainingModuleScores.find({
              moduleId: moduleId,
              quizId: curQz._id,              
              $or: [
                {attempts: possibleAttempts},
                {feedback: 'correct'}
              ]
            })

            // console.log(allMyScores.fetch())
            if(allMyScores && allMyScores.fetch() && allMyScores.fetch().length > 0) {

              let doneThisPage = true
              let 
                _scoredQIds = [],
                scoredQIds = []

              allMyScores.fetch().forEach(function(s) {
                if(!_scoredQIds.includes(s.questionId)) {
                  _scoredQIds.push(s.questionId);
                } 
              })

              scoredQIds = unique(_scoredQIds);

              if(scoredQIds.length < allQIds.length) {
                doneThisPage = false
              } else {
                allQIds.forEach(function(q) {
                  if(scoredQIds.indexOf(q) === -1) {
                    doneThisPage = false
                  }
                })
              }

// console.log(scoredQIds.length, allQIds.length, doneThisPage)
// console.log(scoredQIds, allQIds, doneThisPage)

              if(doneThisPage) {

                let statsObj = {           
                  userId: Meteor.userId(),
                  moduleId: moduleId,
                  _page: _thisPageData.index            
                }

                upsertUserStats.call(statsObj, (err, res) => {
                  if(err) {}
                  else {
                    Session.set('myUserStats', res)

                    // $('.btn-module-navigation.btn-go-next').not('.btn-disabled').webuiPopover('show'); //-- unsafe-inline issue
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
  'click .btn-view-my-answers'(e, tpl) {
    e.preventDefault()

    let fid = $(e.currentTarget).data('fid')
    $(e.currentTarget).blur()

    let scores = TrainingModuleScores.findOne(fid)
    if(scores && scores.answerIds && scores.answerIds.length > 0) {      
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

    }

    // console.log(qs, q)
  }
})

Template.QuizAAO.onDestroyed(() => {
  _subsQuizAAO.clear()
  _selfQuizAAO.data = null
  _selfQuizAAO.ready4Quiz.set(null)
  _selfQuizAAO.ready4Answers.set(null)
  _selfQuizAAO.ready4Scores.set(null)
  // _selfQuizAAO.qHasAnswersShuffled = []

})


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function unique(array) {
    return $.grep(array, function(el, index) {
        return index == $.inArray(el, array);
    });
}

