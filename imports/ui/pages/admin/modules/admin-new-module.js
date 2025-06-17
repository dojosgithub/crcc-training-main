/**
 * Admin New Module template logic
 */
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

import { Template } from 'meteor/templating'


import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'

import { insertModule } from '/both/api/methods/training-modules.js'

// import '/imports/ui/stylesheets/admin/modules/admin-new-module.less'
import '/imports/ui/pages/admin/modules/admin-new-module.html'


Template.AdminNewModule.onCreated(function adminNewModuleOnCreated() {

  
})

Template.AdminNewModule.onRendered(() => {

})

Template.AdminNewModule.events({
  'click .btn-submit-new-module'(e, tpl) {
    e.preventDefault()

    let moduleName = $('#input_new_module_name').val()
    let moduleDesc = $('#txta_new_module_description').val()
    
    let canGo = true

    if(moduleName === '') {
      toastr.warning("Module Name cannot be null.")
      canGo = false
    }   

    if(canGo) {
      let objModule = {
        name: moduleName,
        description: moduleDesc,
        creator: {
          fullname: Meteor.user().profile.fullname,
          userId: Meteor.userId()
        },
        status: 2
      }

      insertModule.call(objModule, (err, res) => {
        if(err) { //-- If something's wrong
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully done.")
        }
      })

    }
  }
})

