/**
 * Admin Image Edit template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'
import { updateImage } from '/both/api/methods/training-module-images.js'

// import '/imports/ui/stylesheets/admin/images/admin-image-edit.less'
import { AdminImageEdit } from '/imports/ui/pages/admin/images/admin-image-edit.html'


Template.AdminImageEdit.onCreated(function adminImageEditOnCreated() {

})

Template.AdminImageEdit.helpers({
  Image() {
    let data = Template.instance().data

    return TrainingModuleImagesCFS.find(data.data)
  }
})

Template.AdminImageEdit.events({
  'click .btn-close-admin-image-edit'(e, tpl) {
    e.preventDefault()

    $('.row-admin-image-edit').hide()
  },
  'click .btn-submit-image-edit'(e, tpl) {
    e.preventDefault()

    let iid = $(e.currentTarget).data('iid')

    let label = $('#input_image_edit_label').val()
    let description = $('#txta_image_edit_description').val()
    
    let canGo = true

    if(label === '') {
      toastr.warning("Image label cannot be null.")
      canGo = false
    }   

    if(canGo) {
      let objImage = {
        _id: iid,
        label: label,
        description: description
      }

      updateImage.call(objImage, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })

    }
  }   
})

