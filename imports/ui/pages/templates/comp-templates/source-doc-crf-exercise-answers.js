/**
 * Input Findings Answers template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import '/imports/ui/pages/templates/comp-templates/source-doc-crf-exercise-answers.html'


Template.SourceDocCRFExerciseAnswers.onRendered(function inputFindingsOnRendered() {

  $('.user-input-label').html("Your Findings: ")
  $('.elem-user-input').show()

  Tracker.autorun(() => {
    $('#txta_user_input').val(Session.get('userFindingsInput'))  

    Session.set("Modules.template.comp.done", true)
  })
  
})

Template.SourceDocCRFExerciseAnswers.onDestroyed(() => {
  Session.set("Modules.template.comp.done", null)
})
