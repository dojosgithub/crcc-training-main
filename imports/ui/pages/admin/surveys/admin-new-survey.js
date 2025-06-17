/**
 * Admin New Survey template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { TrainingModuleSurveys } from '/both/api/collections/training-module-surveys.js'
import { insertSurvey } from '/both/api/methods/training-module-surveys.js'

// import '/imports/ui/stylesheets/admin/surveys/admin-new-survey.scss'
import { AdminNewSurvey } from '/imports/ui/pages/admin/surveys/admin-new-survey.html'

let _selfAdminNewSurvey

Template.AdminNewSurvey.onCreated(function adminNewSurveyOnCreated() {
  _selfAdminNewSurvey = this
})

Template.AdminNewSurvey.onRendered(function adminNewSurveyOnRendered() {

})

Template.AdminNewSurvey.helpers({

})

Template.AdminNewSurvey.events({
  // 'click .btn-submit-new-survey'(e, tpl) {
  'submit form#form_admin_new_survey'(e, tpl) {
    e.preventDefault()

    // let name = tpl.find.('#input_new_survey_name').val()
    // let description = tpl.find('#txta_new_survey_description').val()

    let title = e.target.surveyName.value
    let description = e.target.surveyDescription.value

    if(title !== '') {
      let obj = {
        title: title,
        description: description
      }

      insertSurvey.call(obj, (err, res) => {
        if(err) {
          toastr.error("Somethihng went wrong. Please try again: " + err)
        } else {
          toastr.info("Successfully added.")
        }
      })

    } else {
      toastr.error("Survey name cannot be null.")
    }
  }
})
