/**
 *  Admin Survey template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'

// import '/imports/ui/stylesheets/admin/surveys/admin-survey-template.less'
import '/imports/ui/pages/admin/surveys/admin-survey-template.html'

let _selfAdminSurveyReportTableModules
let _subsAdminSurveyReportTableModules

Template.AdminSurveyReportTableModules.onCreated(function adminSurveyReportModulesOnCreated() {

  _selfAdminSurveyReportTableModules = this

  _selfAdminSurveyReportTableModules.surveyIds = []

  _selfAdminSurveyReportTableModules.surveyId = new ReactiveVar()
  _selfAdminSurveyReportTableModules.ready = new ReactiveVar()

  _subsAdminSurveyReportTableModules = new SubsManager() 

  _selfAdminSurveyReportTableModules.autorun(() => {

    // if(_selfAdminSurveyReportTableModules.surveyId.get()) {
    if(Session.get('surveyIds')) {
      // let svid = _selfAdminSurveyReportTableModules.surveyId.get()
      // let handleModules = _subsAdminSurveyReportTableModules.subscribe('module_pages_n_modules_w_svid', svid)
      let handleModules = _subsAdminSurveyReportTableModules.subscribe('module_pages_n_modules_w_svids', Session.get('surveyIds'))
      _selfAdminSurveyReportTableModules.ready.set(handleModules.ready())
    }
  })

})

Template.AdminSurveyReportTableModules.helpers({
  numOfModules() {
    let surveyId = this.data._id || null
    // let surveyId = this.data || null
    let surveyIds = _selfAdminSurveyReportTableModules.surveyIds

    if(surveyId) {
      // _selfAdminSurveyReportTableModules.surveyId.set(surveyId)
      // console.log(surveyId, _selfAdminSurveyReportTableModules.ready.get())

      surveyIds.push(surveyId)

      let mySvIds = $.unique(surveyIds) //-- making the array is critical to get the collection data.

      _selfAdminSurveyReportTableModules.surveyIds = surveyIds

      Session.set('surveyIds', _selfAdminSurveyReportTableModules.surveyIds)

      if(_selfAdminSurveyReportTableModules.ready.get()) {
        let modules = TrainingModulePages.find({
          surveyId: surveyId
        })
        // console.log(modules.fetch())
        return modules
        
      }
    }
  }  
})

Template.AdminSurveyReportTableActions.events({
  'click .btn-view-survey-data'(e, tpl) {
    e.preventDefault()

    // alert('Not implemented yet ...')
  }
})


