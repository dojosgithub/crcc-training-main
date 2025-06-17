/**
 * Modules template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'

import { activateModule, deactivateModule } from '/both/api/methods/training-modules.js'

// import '/imports/ui/stylesheets/admin/modules/admin-all-modules.less'
import { AdminAllModules } from '/imports/ui/pages/admin/modules/admin-all-modules.html'

import { AdminModuleEdit } from '/imports/ui/pages/admin/modules/admin-module-edit.js'

let _selfAdminAllModules
let _subsAdminAllModules

Template.AdminAllModules.onCreated(function adminAllModulesOnCreated() {
  _selfAdminAllModules = this

  _selfAdminAllModules.moduleToBuild = new ReactiveVar()
  _selfAdminAllModules.ready = new ReactiveVar()
  // _selfAdminAllModules.ready4Pages = new ReactiveVar()

  _subsAdminAllModules = new SubsManager()

  _selfAdminAllModules.autorun(() => {

    let handleAllModules = _subsAdminAllModules.subscribe('all_training_modules')
    _selfAdminAllModules.ready.set(handleAllModules.ready())


  })

})

Template.AdminAllModules.onRendered(function adminAllModulesOnRendered() {
  // $('.row-admin-module-builder').show()
})

Template.AdminAllModules.helpers({
  Modules() {
    return TrainingModules.find()
  }
})

Template.AdminAllModules.events({
  'click .btn-activate-module'(e, tpl) {
    e.preventDefault()

    let moduleId = $(e.currentTarget).parent().data('mid')

    if(moduleId !== '') {
      if(confirm("Are you sure to activate this module?")) {
        activateModule.call({_id:moduleId}, (err, res)=>{
          if(err) {
            toastr.error("Something went wrong. " + err)
          } else {
            toastr.info("Successfully activated.")
          }
        })
      }
    }
  },
  'click .btn-deactivate-module'(e, tpl) {
    e.preventDefault()

    let moduleId = $(e.currentTarget).parent().data('mid')

    if(moduleId !== '') {
      if(confirm("Are you sure to deactivate this module?")) {
        deactivateModule.call({_id:moduleId}, (err, res)=>{
          if(err) {
            toastr.error("Something went wrong. " + err)
          } else {
            toastr.info("Successfully activated.")
          }
        })
      }
    }
  },
  'click .btn-build-module'(e, tpl) {
    e.preventDefault()

    let moduleId = $(e.currentTarget).parent().data('mid')    

    Session.set('moduleIdToBuild', moduleId)

    $('.row-admin-module-builder').show()

    Template.AdminModuleBuilder.__helpers.get("Pages").call()
  },
  'click .btn-edit-module'(e, tpl) {
    e.preventDefault()

    let moduleId = $(e.currentTarget).parent().data('mid')    

    Session.set('moduleToEdit', moduleId) 

    $('.row-admin-module-edit').show()   

  }  
})

Template.AdminAllModules.onDestroyed(function AdminAllModulesOnDestroyed() {
  _subsAdminAllModules.clear()
})
