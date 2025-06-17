/**
 * Admin Module Edit template
 */ 
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { updateModule, updateModuleCoverImage } from '/both/api/methods/training-modules.js'

import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'

// import '/imports/ui/stylesheets/admin/modules/admin-module-edit.less'
import { AdminModuleEdit } from '/imports/ui/pages/admin/modules/admin-module-edit.html'

let _selfAdminModuleEdit
let _subsAdminModuleEdit

Template.AdminModuleEdit.onCreated(function adminModuleOnCreated() {

  _selfAdminModuleEdit = this

  _selfAdminModuleEdit.ready = new ReactiveVar()
  _selfAdminModuleEdit.ready4CoverImages = new ReactiveVar(false)

  _subsAdminModuleEdit = new SubsManager()

  _selfAdminModuleEdit.autorun(() => {
    
    if(_selfAdminModuleEdit.ready4CoverImages.get()) {
        
      let handleImages = _subsAdminModuleEdit.subscribe('all_training_module_images_cfs')
      _selfAdminModuleEdit.ready.set(handleImages.ready())

    }

  })
})

Template.AdminModuleEdit.helpers({
  Module() {
    
    if(Session.get("moduleToEdit")) {
      
      return TrainingModules.find(Session.get("moduleToEdit"))
    }
  },
  Images() {
    if(_selfAdminModuleEdit.ready4CoverImages.get()) {

      return TrainingModuleImagesCFS.find()
    }
  }
})

Template.AdminModuleEdit.events({
  'click .btn-close-admin-module-edit'(e, tpl) {
    e.preventDefault()

    $('.row-admin-module-edit').hide()
  },
  'click .btn-save-module-edit'(e, tpl) {
    e.preventDefault()

    let 
      moduleName = $('#input_module_edit_name').val(),
      moduleDesc = $('#txta_module_edit_description').val(),
      moduleProgressOption = $("#module_progress_option").is(':checked') || false,
      moduleOrder = $("#module_order").val();      

    let canGo = true

    if(moduleName === '') {
      toastr.warning("Module Name cannot be null.")
      canGo = false
    }

    if(canGo) {
      let objModule = {
        _id: Session.get("moduleToEdit"),
        name: moduleName,
        description: moduleDesc,
        progressOption: moduleProgressOption,
        order: moduleOrder
        // creator: {
        //   fullname: Meteor.user().profile.fullname,
        //   userId: Meteor.userId()
        // }
      }

      updateModule.call(objModule, (err, res) => {
        if(err) { //-- If something's wrong
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })

    }
  },
  'click .btn-view-cover-images'(e, tpl) {
    e.preventDefault()

    _selfAdminModuleEdit.ready4CoverImages.set(true)

  },
  'click .btn-select-for-cover-image'(e, tpl) {
    e.preventDefault()

    let iid = $(e.currentTarget).parent().data('iid')
    let name = $(e.currentTarget).parent().data('name')

    let obj = {
      _id: Session.get("moduleToEdit"),
      coverImage: {
        imageId: iid,
        imageName: name
      }
    }

    updateModuleCoverImage.call(obj, (err, res) => {
      if(err) {
        toastr.error("Something went wrong. " + err)
      } else {
        toastr.info("Successfully done.")
      }
    })
  },  
})


Template.AdminModuleEdit.onDestroyed(function adminAdminModuleEditOnDestroyed() {
  _subsAdminModuleEdit.clear()
})
