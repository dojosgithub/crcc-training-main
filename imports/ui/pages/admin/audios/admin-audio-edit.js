/**
 * Admin Audio Edit template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'
import { updateAudio } from '/both/api/methods/training-module-audios.js'

// import '/imports/ui/stylesheets/admin/audios/admin-audio-edit.less'
import { AdminAudioEdit } from '/imports/ui/pages/admin/audios/admin-audio-edit.html'

Template.AdminAudioEdit.onCreated(function adminAudioEditOnCreated() {

})

Template.AdminAudioEdit.onRendered(function adminAudioEditOnRendered() {

})

Template.AdminAudioEdit.helpers({
  Audio() {
    let data = Template.instance().data
    return TrainingModuleAudiosCFS.find(data.data)
  }
})

Template.AdminAudioEdit.events({
  'click .btn-close-admin-audio-edit'(e, tpl) {
    e.preventDefault()

    $('.row-admin-audio-edit').hide()
  },  
  'click .btn-submit-audio-edit'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).data('aid')

    let title = $('#input_audio_edit_title').val()
    let description = $('#txta_audio_edit_description').val()
    
    let canGo = true

    if(title === '') {
      toastr.warning("Audio title cannot be null.")
      canGo = false
    }   

    if(canGo) {
      let objAudio = {
        _id: aid,
        title: title,
        description: description
      }

      updateAudio.call(objAudio, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })

    }
  }  
})


