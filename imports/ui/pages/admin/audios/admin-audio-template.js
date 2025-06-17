/**
 *  Admin Audio template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'
import { updateAudio, updateAudioStatus, deleteAudio } from '/both/api/methods/training-module-audios.js'

import { updateModulePageAudio } from '/both/api/methods/training-module-pages.js'

// import '/imports/ui/stylesheets/admin/audios/admin-audio-template.less'
import '/imports/ui/pages/admin/audios/admin-audio-template.html'

Template.AdminAudioActions.events({
  'click .btn-delete-table-audio'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to remove this audio?")) {
      let aid = $(e.currentTarget).parent().parent().data('aid')  
      let status = parseInt($(e.currentTarget).data('status'))  

      let objAudio = {
        _id: aid,
        status: status
      }

      updateAudioStatus.call(objAudio, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })   
    }
  },
  'click .btn-save-table-audio'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).parent().parent().data('aid')
    let title = $('#input_table_audio_title_'+aid).val()
    let desc = $('#txta_table_audio_desc_'+aid).val()
    let src = $('#txta_table_audio_src_'+aid).val()
    let duration = $('#input_table_audio_duration_'+aid).val()

    if(aid !== '') {

      let objAudio = {
        _id: aid,
        title: title,
        description: desc,
        audio: {
          src: src
        },
        duration: Number(duration)
      }

      updateAudio.call(objAudio, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })
    }
  },
  'click .btn-update-table-audio-status'(e, tpl) {
    e.preventDefault()

    let status = parseInt($(e.currentTarget).data('status'))
    let command = status === 1 ? 'activate' : 'deactivate' 

    if(confirm("Are you sure to " + command + " this audio?")) {
      let aid = $(e.currentTarget).parent().parent().data('aid')    

      let objAudio = {
        _id: aid,
        status: status
      }

      updateAudioStatus.call(objAudio, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully " + command + "d.")
        }
      })   
    }
  },    
})

let _selfAdminAudioThumbnail

Template.AdminAudioThumbnail.onCreated( function adminAudioThumbnailOnCreated() {
  _selfAdminAudioThumbnail = this

  _selfAdminAudioThumbnail.audio = new ReactiveDict()

})

Template.AdminAudioThumbnail.events({
  'click .btn-view-table-audio'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).data('aid')
    let name = $(e.currentTarget).data('name')
    let title = $(e.currentTarget).data('title')

    // $('#audioModalSrc').attr('src', src)

    // let audio = new Audio('/cfs/files/training_module_audios_cfs/'+aid+'/'+name)

    // _selfAdminAudioThumbnail.audio.set('_id', aid)
    // _selfAdminAudioThumbnail.audio.set('title', title)
    // _selfAdminAudioThumbnail.audio.set('src', src)

    // let src = '/cfs/files/training_module_audios_cfs/'+aid+'/'+name
    // $('#audioModalTitle').empty().append(title)
    

    // let audio      = document.createElement('audio');
    // audio.id       = 'audioModalPlayer';
    // audio.controls = 'controls'
    // audio.src      = '/cfs/files/training_module_audios_cfs/'+aid+'/'+name
    // audio.type     = 'audio/mpeg'
    
    // $('#audioModalSrc').empty().append(audio);

    // $('#audioModal').on('hidden.bs.modal', () => {
    //     audio.pause()
    // })

    let audioObject = {
      _id: aid,
      name: name,
      title: title
    }

    Session.set('audioToView', audioObject)

  }
})

Template.AdminAudioThumbnail.helpers({
  audioTitle() {
    return _selfAdminAudioThumbnail.audio.get('title')
  },
  audioSrc() {
    return _selfAdminAudioThumbnail.audio.get('src')
  },  
})

Template.AdminAudioModal.helpers({
  Audio() {
    // let data = Template.instance().data //-- Not working. 
    let data = Session.get('audioToView') //-- So, session seems to be the solution for now.

    if(data && data._id) {
      $('#audioModalTitle').empty().append(data.title)    

      let audio      = document.createElement('audio')
      audio.id       = 'audioModalPlayer';
      audio.controls = 'controls'
      audio.src      = '/cfs/files/training_module_audios_cfs/'+data._id+'/'+data.name
      audio.type     = 'audio/mpeg'
      
      $('#audioModalSrc').empty().append(audio)

      //-- When the modal window is closed, stop(pause) the audio.
      $('#audioModal').on('hidden.bs.modal', () => {
          audio.pause()
      })

    }
  }
})

Template.AdminModulePageEditAllAudiosActions.events({
  'click .btn-save-table-audio'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).parent().parent().data('aid')
    let title = $('#input_table_audio_title_'+aid).val()
    let desc = $('#txta_table_audio_desc_'+aid).val()
    let src = $('#txta_table_audio_src_'+aid).val()

    if(aid !== '') {

      let objAudio = {
        _id: aid,
        title: title,
        description: desc,
        audio: {
          src: src
        }
      }

      updateAudio.call(objAudio, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })
    }
  },  
  'click .btn-select-this-audio'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to select this audio?")) {
      let aid = $(e.currentTarget).parent().parent().data('aid')

      let audio = TrainingModuleAudiosCFS.findOne(aid)

      if(audio && audio._id) {

        let obj = {
          _id: Session.get("pageToBuild"),
          audio: {
            audioId: audio._id,
            audioName: audio.original.name,
            audioDuration: audio.duration
          }
        }
        
        updateModulePageAudio.call(obj, (err, res) => {
          if(err) {
            toastr.info("Something went wrong. " + err)
          } else {
            toastr.info("Successfully updated.")
          }
        })

      }
    }
  },   
})
