/**
 * Admin Page Templates logic
 *
 * @author David Kim <davidkim@craassessments.com>
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleTemplates } from '/both/api/collections/training-module-templates.js'
import { deleteTemplate, activateTemplate, deactivateTemplate } from '/both/api/methods/training-module-templates.js'

// import '/imports/ui/stylesheets/admin/templates/admin-comp-templates.less'
import { AdminCompTemplates } from '/imports/ui/pages/admin/templates/admin-comp-templates.html'

import { AdminTemplateEdit } from '/imports/ui/pages/admin/templates/admin-template-edit.js'

let _selfAdminCompTemplates
let _subsAdminCompTemplates

Template.AdminCompTemplates.onCreated(function adminCompTemplatesOnCreated() {
  _selfAdminCompTemplates = this

  _subsAdminCompTemplates = new SubsManager()
  _selfAdminCompTemplates.ready = new ReactiveVar()
  _selfAdminCompTemplates.templateToEdit = new ReactiveVar()

  _selfAdminCompTemplates.autorun(() => {
    let handleTemplates = _subsAdminCompTemplates.subscribe('training_module_templates_w_type', 'comp')
    _selfAdminCompTemplates.ready.set(handleTemplates.ready())
  })
})

Template.AdminCompTemplates.onRendered(function adminCompTemplatesOnRendered() {

})

Template.AdminCompTemplates.events({
  'click .btn-activate-template'(e, tpl) {
    e.preventDefault()

    let templateId = $(e.currentTarget).parent().data('tid')

    if(templateId !== '') {
      if(confirm("Are you sure to activate this template?")) {
        activateTemplate.call(templateId, (err, res)=>{
          if(err) {
            toastr.error("Something went wrong. " + err)
          } else {
            toastr.info("Successfully activated.")
          }
        })
      }
    }
  },
  'click .btn-deactivate-template'(e, tpl) {
    e.preventDefault()

    let templateId = $(e.currentTarget).parent().data('tid')

    if(templateId !== '') {
      if(confirm("Are you sure to deactivate this template?")) {
        deactivateTemplate.call(templateId, (err, res)=>{
          if(err) {
            toastr.error("Something went wrong. " + err)
          } else {
            toastr.info("Successfully deactivated.")
          }
        })
      }
    }
  }, 
  'click .btn-delete-template'(e, tpl) {
    e.preventDefault()

    let templateId = $(e.currentTarget).parent().data('tid')
    let systemName = $(e.currentTarget).parent().data('name')

    if(templateId !== '') {

      let obj = {
        _id: templateId,
        systemName: systemName
      }

      if(confirm("Are you sure to delete this template?")) {
        deleteTemplate.call(obj, (err, res)=>{
          if(err) {
            toastr.error("Something went wrong. " + err)
          } else {
            toastr.info("Successfully deleted.")
          }
        })
      }
    }
  },
  'click .btn-edit-template'(e, tpl) {
    e.preventDefault()

    let templateId = $(e.currentTarget).parent().data('tid')

    _selfAdminCompTemplates.templateToEdit.set(templateId)

    $('.row-admin-template-edit').show()
    
  }   
})

Template.AdminCompTemplates.helpers({
  Templates() {
    if(_selfAdminCompTemplates.ready.get()) {
      return TrainingModuleTemplates.find({type: 'comp'})
    }
  },
  templateToEdit() {    
    if(_selfAdminCompTemplates.templateToEdit.get()) {
      return _selfAdminCompTemplates.templateToEdit.get()
    }
  }  
})

Template.AdminCompTemplates.onDestroyed(()=>{
  _subsAdminCompTemplates.clear()
})
