/**
 *  Admin Quiz Settings template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { TrainingModuleQuizzes } from '/both/api/collections/training-module-quizzes.js'
import { updateQuizSettings } from '/both/api/methods/training-module-quizzes.js'

// import '/imports/ui/stylesheets/admin/quizzes/admin-quiz-settings.less'
import '/imports/ui/pages/admin/quizzes/admin-quiz-settings.html'

Template.AdminQuizSettings.helpers({
  Settings() {
    return TrainingModuleQuizzes.find({
      _id: Session.get('curQzId')
    })
  }
})

Template.AdminQuizSettings.events({
  'submit form'(e, tpl) {
    e.preventDefault()

    if(Session.get('curQzId')) {

      let quizType = e.target.quiz_type.value
      let questionOrderType = e.target.question_order_type.value
      let answerOrderType = e.target.answer_order_type.value
      let answerType = e.target.answer_type.value

      let scoreOption = e.target.score_option.value
      let scoreOptionPoints = e.target.score_option_points.value

      let possibleAttempts = e.target.possible_attempts.value

      let possibleAttemptsReducePercent = e.target.possible_attempts_reduce_percent.value
      let possibleAttemptsReduceTarget = e.target.possible_attempts_reduce_target.value

      let quizDurationHours = e.target.quiz_duration_hours.value
      let quizDurationMinutes = e.target.quiz_duration_mins.value

      let showTimer = e.target.show_timer.checked
      let showWarningMessage = e.target.show_warning_message.checked
      let timerWarningMessageMinutes = e.target.timer_warning_message_mins.value
      let timerWarningMessage = e.target.timer_warning_message.value

      // console.log("Quiz Type -> ", quizType)
      // console.log("Question Order Type -> ", questionOrderType)
      // console.log("Score Option -> ", scoreOption)
      // console.log("Score Option Point -> ", scoreOptionPoint)
      // console.log("Possbile Attempts -> ", possibleAttempts)
      // console.log("Possbile Attempts Reduce Percent -> ", possibleAttemptsReducePercent)
      // console.log("Possbile Attempts Reduce Target -> ", possibleAttemptsReduceTarget)
      // console.log("Quiz Duration Hours -> ", quizDurationHours)
      // console.log("Quiz Duration Mins -> ", quizDurationMinutes)
      // console.log("Show Timer -> ", showTimer)
      // console.log("Show Warning Message -> ", showWarningMessage)
      // console.log("Timer Warning Message Minutes-> ", timerWarningMessageMinutes)
      // console.log("Timer Warning Message -> ", timerWarningMessage)
      
      let qzSettingsObj = {
        quizType: parseInt(quizType),
        questionOrderType: parseInt(questionOrderType),
        answerOrderType: parseInt(answerOrderType),
        answerType: parseInt(answerType),
        scoreOption: parseInt(scoreOption) || '',
        scoreOptionPoints: parseInt(scoreOptionPoints) || '',
        possibleAttempts: parseInt(possibleAttempts),
        possibleAttemptsReducePercent: parseInt(possibleAttemptsReducePercent) || '',
        possibleAttemptsReduceTarget: parseInt(possibleAttemptsReduceTarget),
        quizDurationHours: parseInt(quizDurationHours) || '',
        quizDurationMinutes: parseInt(quizDurationMinutes) || '',
        showTimer: showTimer || false,
        showWarningMessage: showWarningMessage || false,
        timerWarningMessageMinutes: parseInt(timerWarningMessageMinutes) || '',
        timerWarningMessage: timerWarningMessage || ''
      }
// console.log(questionOrderType, qzSettingsObj)
      let qzObj = {
        _id: Session.get('curQzId'),
        settings: qzSettingsObj
      }

      // console.log(qzObj)

      updateQuizSettings.call(qzObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again. " + err)
        } else {
          toastr.info("Successfully saved.")
        }
      })
    } else {
      toastr.error("Something went wrong. Please try again.")
    }

  }
})
