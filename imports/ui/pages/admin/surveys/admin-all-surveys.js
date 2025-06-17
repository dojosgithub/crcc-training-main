/**
 * Admin All Surveys template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { updateSurvey, updateSurveyStatus, deleteSurvey } from '/both/api/methods/training-module-surveys.js'

// import '/imports/ui/stylesheets/admin/surveys/admin-all-surveys.less'
import { AdminAllSurveys } from '/imports/ui/pages/admin/surveys/admin-all-surveys.html'

// import { AdminSurveySettings } from '/imports/ui/pages/admin/surveys/admin-survey-settings.js'
import { AdminSurveyQuestions } from '/imports/ui/pages/admin/surveys/admin-survey-questions.js'
import { AdminSurveyTemplate } from '/imports/ui/pages/admin/surveys/admin-survey-template.js'

let _selfAdminAllSurveys

Template.AdminAllSurveys.onCreated(function adminAllSurveysOnCreated() {
  _selfAdminAllSurveys = this
})

Template.AdminAllSurveys.onRendered(function adminAllSurveysOnRendered() {

})

Template.AdminAllSurveys.helpers({
  surveysTableSelector() {
    return {
      status: {$ne: 4}
    }
  }
})

Template.AdminAllSurveys.events({
  'click .btn-survey-settings'(e, tpl) {
    e.preventDefault()

    let svid = $(e.currentTarget).parent().parent().data('svid')

    Session.set('curSvId', svid)
    $('.admin-survey-settings-form-container').show()
  },
  'click .btn-close-survey-settings'(e, tpl) {
    e.preventDefault()

    Session.set('curSvId', null)
    $('.admin-survey-settings-form-container').hide()
  },  
  'click .btn-manage-survey-questions'(e, tpl) {
    e.preventDefault()

    let svid = $(e.currentTarget).parent().parent().data('svid')

    Session.set('curSvId', svid)

    $('.row-admin-survey-questions').show()
  },
  'click .btn-save-survey'(e, tpl) {
    e.preventDefault()

    let svid = $(e.currentTarget).parent().parent().data('svid')

    if(svid) {
      let title = $('#input_survey_title_'+svid).val()
      let desc = $('#txta_survey_desc_'+svid).val()

      if(title !== '') {
        let surveyObj = {
          _id: svid,
          title: title,
          description: desc
        }

        updateSurvey.call(surveyObj, (err, res) => {
          if(err) {
            toastr.error("Something went wrong. Please try again. " + err)
          } else {
            toastr.info("Successfully updated.")
          }
        })

      } else {
        toastr.error("Survey Title cannot be null.")
      }
    }
  },
  'click .btn-update-survey-status'(e, tpl) {
    e.preventDefault()

    let svid = $(e.currentTarget).parent().parent().data('svid')

    if(svid) {
     
      let status = $(e.currentTarget).data('status')

      let svObj = {
        _id: svid,
        status: status
      }

      updateSurveyStatus.call(svObj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again. " + err)
        } else {
          toastr.info("Successfully updated.")
        }        
      })
    }
  },
  'click .btn-delete-survey'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to delete this survey?")) {
      let svid = $(e.currentTarget).parent().parent().data('svid')  
      let status = parseInt($(e.currentTarget).data('status'))  

      let objSurvey = {
        _id: svid,
        status: status
      }

      updateSurveyStatus.call(objSurvey, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })   
    }
  },      
})
