/**
 * Admin Template Edit template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleTemplates } from '/both/api/collections/training-module-templates.js'
import { updateTemplate } from '/both/api/methods/training-module-templates.js'

// import '/imports/ui/stylesheets/admin/templates/admin-template-edit.less'
import { AdminTemplateEdit } from '/imports/ui/pages/admin/templates/admin-template-edit.html'

Template.AdminTemplateEdit.onCreated(function adminTemplateEditOnCreated() {

})

Template.AdminTemplateEdit.onRendered(function adminTemplateEditOnRendered() {

})

Template.AdminTemplateEdit.helpers({
  Template() {
    let data = Template.instance().data

    return TrainingModuleTemplates.find(data.data)
  }
})

Template.AdminTemplateEdit.events({
  'click .btn-close-admin-template-edit'(e, tpl) {
    e.preventDefault()

    $('.row-admin-template-edit').hide()
  },  
  'click .btn-submit-template-edit'(e, tpl) {
    e.preventDefault()

    let tid = $(e.currentTarget).data('tid')

    let type = $('#sel_template_edit_type').val()
    let label = $('#input_template_edit_label').val()
    let systemName = $('#input_template_edit_system_name').val()
    let description = $('#txta_template_edit_description').val()
    
    let canGo = true

    if(type === -1) {
      toastr.warning("Please select template type.")
      canGo = false
    }

    if(systemName === '') {
      toastr.warning("System name cannot be null.")
      canGo = false
    }   

    if(canGo) {
      let objTemplate = {
        _id: tid,
        type: type,
        label: label,
        systemName: systemName,
        description: description
      }

      updateTemplate.call(objTemplate, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })

    }
  }  
})
