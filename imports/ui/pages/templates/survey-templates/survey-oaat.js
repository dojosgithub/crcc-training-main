/**
 * Survey One-At-A-Time template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleSurveys } from '/both/api/collections/training-module-surveys.js'
import { TrainingModuleSurveyAnswers } from '/both/api/collections/training-module-survey-answers.js'
import { TrainingModuleSurveyData } from '/both/api/collections/training-module-survey-data.js'

// import '/imports/ui/stylesheets/question.less'
// import '/imports/ui/stylesheets/templates/survey-oaat.less'
import { SurveyOAAT } from '/imports/ui/pages/templates/survey-templates/survey-oaat.html'

let _selfSurveyOAAT
let _subsSurveyOAAT
let _thisPageData

Template.SurveyOAAT.onCreated(function surveyOAATOnCreated() {
  _selfSurveyOAAT = this

  _selfSurveyOAAT.qids = []

  _thisPageData = this.data.pageData

  _subsSurveyOAAT = new SubsManager()
  _selfSurveyOAAT.ready4Survey = new ReactiveVar()
  _selfSurveyOAAT.ready4Answers = new ReactiveVar()
  _selfSurveyOAAT.ready4SurveyData = new ReactiveVar()

  _selfSurveyOAAT.curQIdx = new ReactiveVar(0)
  _selfSurveyOAAT.curQid = new ReactiveVar()
  _selfSurveyOAAT.qLength = new ReactiveVar()
  _selfSurveyOAAT.hasNextQuestion = new ReactiveVar(true)
  _selfSurveyOAAT.hasPrevQuestion = new ReactiveVar(false)
  _selfSurveyOAAT.totalNumOfQuestions = new ReactiveVar()
  _selfSurveyOAAT.moduleId = new ReactiveVar(_thisPageData.moduleId)
  // _selfSurveyOAAT.answerType = new ReactiveVar()

  _selfSurveyOAAT.autorun(() => {
    // if(_thisPageData.template) { //-- Surveyzes are consided/registered as a template.
    if(_thisPageData.surveyId) { //-- Surveyzes are consided/registered as a template.
      // let handleSurvey = _subsSurveyOAAT.subscribe('training_module_survey_n_questions_w_svid', _thisPageData.template)
      let handleSurvey = _subsSurveyOAAT.subscribe('training_module_survey_n_questions_w_svid', _thisPageData.surveyId)
      _selfSurveyOAAT.ready4Survey.set(handleSurvey.ready())
    }
    if( Session.get('_selfSurveyOAAT.qids')) {
      // console.log(_selfSurveyOAAT.qid.get())
      // let handleAnswers = _subsSurveyOAAT.subscribe('active_training_module_answers_w_qid', Session.get('_selfSurveyOAAT.qid'))
      let qObj = {        
        qids: Session.get('_selfSurveyOAAT.qids')
      }

      let handleAnswers = _subsSurveyOAAT.subscribe('active_training_module_survey_answers_w_qids', qObj)
      _selfSurveyOAAT.ready4Answers.set(handleAnswers.ready())
    }

    if(_selfSurveyOAAT.curQid.get()) {
      let qDataObj = {
        surveyId: _thisPageData.surveyId,
        userId: Meteor.userId(),
        questionId: _selfSurveyOAAT.curQid.get(),
        moduleId: _selfSurveyOAAT.moduleId.get()
      }

      let handleSurveyData = _subsSurveyOAAT.subscribe('training_module_survey_data', qDataObj)
      _selfSurveyOAAT.ready4SurveyData.set(handleSurveyData.ready())
    }

  })
})

Template.SurveyOAAT.helpers({
  Survey() {

    if(_selfSurveyOAAT.ready4Survey.get()) {
      let survey = TrainingModuleSurveys.find()

      // console.log(survey.fetch())
      if(survey && survey.fetch() && survey.fetch().length > 0) {
        let sv = survey.fetch()[0]
        let questions = sv.Questions

        let qs = []
        let curQ = []
        let curQIdx = _selfSurveyOAAT.curQIdx.get()
        let moduleId = _selfSurveyOAAT.moduleId.get()

        // let answerType = qz.settings.answerType
        // let maxAttempts = qz.settings.possibleAttempts
        // let scorePoints = qz.settings.scoreOptionPoints
        // let reducePercent = qz.settings.possibleAttemptsReducePercent
        // let reduceTarget = qz.settings.possibleAttemptsReduceTarget        

        // _selfSurveyOAAT.answerType.set(answerType)

        questions.forEach(function(q) {
          let qObj = {
            _id: q._id,
            surveyId: sv._id,
            content: q.content,
            // answerType: answerType,
            type: q.type,
            // answer: q.answer,
            // maxAttempts: maxAttempts,
            // scorePoints: scorePoints,
            // curPoints: 0,
            // reducePercent: reducePercent,
            // reduceTarget: reduceTarget,
            order: q.order,
            moduleId: moduleId
          }

          qs.push(qObj)
        })

        //-- Since DB Collection level sorting not working, 
        //-- this is critical and needed.
        qs.sort(function(q,p) {return q.order - p.order})

        _selfSurveyOAAT.qLength.set(qs.length)

        Session.set('curSurvey', sv)
        Session.set('curQuestions', qs)
        Session.set('curQuestion', qs[curQIdx])

        _selfSurveyOAAT.totalNumOfQuestions.set(qs.length)

        // Session.set('maxAttempts', qz.settings.possibleAttempts)
        // Session.set('scorePoints', qz.settings.scoreOptionPoints)
        // Session.set('reducePercent', qz.settings.possibleAttemptsReducePercents)
        // Session.set('reduceTarget', qz.settings.possibleAttemptsReduceTarget)
      }

      return survey
    }
  },
  // answerType() {
  //   return  Session.get('curQuestions').answerType
  // },
  Questions() {
    return Session.get('curQuestions')
  },
  Question() {
    return Session.get('curQuestion')
  },
  hasNextQuestion() {
    return _selfSurveyOAAT.hasNextQuestion.get()
  },
  hasPrevQuestion() {
    return _selfSurveyOAAT.hasPrevQuestion.get()
  },
  totalNumOfQuestions() {
    return _selfSurveyOAAT.totalNumOfQuestions.get()
  },
  curQuestionEntryNum() {
    return _selfSurveyOAAT.curQIdx.get() +1
  },  
  Answers() {

    let qid = this._id //-- From inside of this template.
    _selfSurveyOAAT.qids.push(qid)
    let qids = $.unique(_selfSurveyOAAT.qids) //-- This is critical. Otherwise, an infinate loop will be created. 
    
    Session.set('_selfSurveyOAAT.qids', qids) //-- To get all the questions for this survey once.

    if(_selfSurveyOAAT.ready4Answers.get()) {      
      let answers = TrainingModuleSurveyAnswers.find({
        questionId: qid
      }, {
        sort: {order: 1}
      })

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

      return answers
    }
  },
  Answer() {
    let qid = this.questionId || this._id //-- When being inside Answers vs. none (ie. open_ended)
    let moduleId =  _selfSurveyOAAT.moduleId.get()

    _selfSurveyOAAT.curQid.set(qid)

    if(_selfSurveyOAAT.ready4SurveyData.get()) {
      let data = TrainingModuleSurveyData.find({
        surveyId: Session.get('curSurvey')._id,
        questionId: qid,
        userId: Meteor.userId(),
        moduleId: moduleId
      }, {
        sort: {createdAt: -1}
      })
// console.log(this, Session.get('curSurvey')._id, qid, data.fetch())
      if(data && data.fetch().length >0) {
        return data.fetch()[0]
      }
    }
  }
})

Template.SurveyOAAT.events({
  'submit form'(e, tpl) {
    e.preventDefault()

// alert("Not fully implemented yet...")
// return false

    let curQuestion = Session.get('curQuestion')
    let qType = curQuestion.type

    let aids = []
    let myAnswer = ''

    // let answerType = _selfSurveyOAAT.answerType.get()

    // if(answerType === 2) {
    //   $(".chkb-question-answer:checked").each(function() {
    //     aids.push($(this).val())
    //   })   
    // } else {

    if(qType) {
      if(qType === 'single_choice') {
        myAnswer = $(".radio-question-answer:checked").val()
        if(myAnswer) { //-- This is critical. Otherwise, 'undefined' 
          //-- value wil be added to the aids array, and will pass 
          //-- the condition below.
          aids.push(myAnswer)
        }
      }
      else if(qType === 'open_ended') {
        myAnswer = $(".txta-survey-question-open-ended").val() || ''
      }
    } else {
      toastr.error("Question data is not retrieved fully. Please try again.")
    }
  
    if(aids.length > 0 || myAnswer !== '') {
      // if(confirm("Are you sure to submit your answer?")) {
      let moduleId = curQuestion.moduleId

      let dataObj = {
        userId: Meteor.userId(),
        moduleId: moduleId,
        surveyId: Session.get('curSurvey')._id,
        questionId: Session.get('curQuestion')._id,
        answerIds: aids,
        answer: myAnswer
      }

      TrainingModuleSurveyData.insert(dataObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again. " + err)
        } else {
          toastr.info("Successfully submitted.")
        }
      })

    } else {
      toastr.error("Please let us know what you think. We'll appreciate it.")
    }
  },
  'click .btn-next-question'(e, tpl) {
    e.preventDefault()
    
    let qLength = _selfSurveyOAAT.qLength.get()

    let curIdx = _selfSurveyOAAT.curQIdx.get()
    let newIdx = curIdx < qLength ? curIdx +1: curIdx

    _selfSurveyOAAT.curQIdx.set(newIdx)

    Session.set('curQuestion', Session.get('curQuestion')[newIdx])

    let hasNextQuestion = newIdx < qLength -1 ? true: false
    _selfSurveyOAAT.hasNextQuestion.set(hasNextQuestion)
    _selfSurveyOAAT.hasPrevQuestion.set(true)
    
  },
  'click .btn-prev-question'(e, tpl) {
    e.preventDefault()

    let qLength = _selfSurveyOAAT.qLength.get()

    let curIdx = _selfSurveyOAAT.curQIdx.get()
    let newIdx = curIdx > 0 ? curIdx -1: 0    

    _selfSurveyOAAT.curQIdx.set(newIdx)

    Session.set('curQuestion', Session.get('curQuestion')[newIdx])    

    let hasPrevQuestion = newIdx > 0 ? true: false
    _selfSurveyOAAT.hasPrevQuestion.set(hasPrevQuestion)

    let hasNextQuestion = qLength > 1 ? true: false
    _selfSurveyOAAT.hasNextQuestion.set(hasNextQuestion)
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
  }
})

Template.SurveyOAAT.onDestroyed(() => {
  _subsSurveyOAAT.clear()
  _selfSurveyOAAT.data = null
  _selfSurveyOAAT.ready4Survey.set(null)
  _selfSurveyOAAT.ready4Answers.set(null)
  _selfSurveyOAAT.ready4SurveyData.set(null)

})
