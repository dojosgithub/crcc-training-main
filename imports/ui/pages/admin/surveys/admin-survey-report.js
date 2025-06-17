/**
 * Admin Survey Report template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

// import '/imports/ui/stylesheets/admin/surveys/admin-survey-report.less'
import { AdminSurveyReport } from '/imports/ui/pages/admin/surveys/admin-survey-report.html'

import { AdminSurveyTemplate } from '/imports/ui/pages/admin/surveys/admin-survey-template.js'

let _selfAdminSurveyReport

Template.AdminSurveyReport.onCreated(function adminSurveyReportOnCreated() {
  _selfAdminSurveyReport = this
})

Template.AdminSurveyReport.onRendered(function adminSurveyReportOnRendered() {

})

Template.AdminSurveyReport.helpers({
  surveysReportTableSelector() {
    return {
      status: 1
    }
  }
})

