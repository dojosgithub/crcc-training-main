/**
 * Admin Page Templates logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleTemplates } from '/both/api/collections/training-module-templates.js'
import { deleteTemplate, activateTemplate, deactivateTemplate } from '/both/api/methods/training-module-templates.js'

// import '/imports/ui/stylesheets/admin/templates/admin-page-templates.less'
import { AdminPageTemplates } from '/imports/ui/pages/admin/templates/admin-page-templates.html'

import { AdminTemplateEdit } from '/imports/ui/pages/admin/templates/admin-template-edit.js'

let _selfAdminPageTemplates
let _subsAdminPageTemplates

Template.AdminPageTemplates.onCreated(function adminPageTemplatesOnCreated() {
  _selfAdminPageTemplates = this

  _subsAdminPageTemplates = new SubsManager()
  _selfAdminPageTemplates.ready = new ReactiveVar()
  _selfAdminPageTemplates.templateToEdit = new ReactiveVar()

  _selfAdminPageTemplates.autorun(() => {
    let handleTemplates = _subsAdminPageTemplates.subscribe('training_module_templates_w_type', 'page')
    _selfAdminPageTemplates.ready.set(handleTemplates.ready())
  })
})

Template.AdminPageTemplates.onRendered(function adminPageTemplatesOnRendered() {

})

Template.AdminPageTemplates.events({
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

    _selfAdminPageTemplates.templateToEdit.set(templateId)

    $('.row-admin-template-edit').show()
    
  }      
})

Template.AdminPageTemplates.helpers({
  Templates() {
    if(_selfAdminPageTemplates.ready.get()) {
      return TrainingModuleTemplates.find({type: 'page'})
    }
  },
  templateToEdit() {    
    if(_selfAdminPageTemplates.templateToEdit.get()) {
      return _selfAdminPageTemplates.templateToEdit.get()
    }
  }
})

Template.AdminPageTemplates.onDestroyed(()=>{
  _subsAdminPageTemplates.clear()
})