/**
 * Admin New Templates logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { insertTemplate } from '/both/api/methods/training-module-templates.js'

// import '/imports/ui/stylesheets/admin/templates/admin-new-template.less'
import { AdminNewTemplate } from '/imports/ui/pages/admin/templates/admin-new-template.html'

Template.AdminNewTemplate.onCreated(function adminNewTemplateOnCreated() {

})

Template.AdminNewTemplate.onRendered(function adminNewTemplateOnRendered() {

})

Template.AdminNewTemplate.events({
  'click .btn-submit-new-template'(e, tpl) {
    e.preventDefault()

    // let templateName = $('#input_new_template_name').val()
    let templateDesc = $('#txta_new_template_description').val()
    let templateType = $('#sel_new_template_type').val()
    let templateSystemName = $('#input_new_template_system_name').val()
    
    let canGo = true

    if(templateSystemName === '') {
      toastr.warning("System-name cannot be null.")
      canGo = false
    }   

    if(canGo) {
      let objTemplate = {
        // name: templateName,
        description: templateDesc,
        type: templateType,
        systemName: templateSystemName,
        creator: {
          fullname: Meteor.user().profile.fullname,
          userId: Meteor.userId()
        }
      }

      insertTemplate.call(objTemplate, (err, res) => {
        if(err) { //-- If something's wrong
          toastr.error("Something went wrong. " + err)
        } else {          
          if(res) {
            if(res.code) {
              if(res.code === 11000) {
                toastr.error("Duplicated System-Name. Please try again with a different System-Name.")
              } else {
                toastr.error("Something went wrong. Error code: " + res.code)
              }
            } else {
              toastr.info("Successfully added.")
            }
          }          
        }
      })

      // insertTemplate(objTemplate, (err, res) => {
      //   console.log(err, res)
      // })

    }
  }
})

Template.AdminNewTemplate.helpers({

})
