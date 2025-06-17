/**
 *  Admin Video Edit template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'

import { updateVideo } from '/both/api/methods/training-module-videos.js'

// import '/imports/ui/stylesheets/admin/videos/admin-video-edit.less'
import { AdminVideoEdit } from '/imports/ui/pages/admin/videos/admin-video-edit.html'

Template.AdminVideoEdit.onCreated(function adminVideoEdit() {
  
})

Template.AdminVideoEdit.helpers({
  Video() {
    let data = Template.instance().data
    return TrainingModuleVideos.find(data.data)
  }  
})

Template.AdminVideoEdit.events({
  'click .btn-close-admin-video-edit'(e, tpl) {
    e.preventDefault()

    $('.row-admin-video-edit').hide()

  },
  'click .btn-submit-video-edit'(e, tpl) {
    e.preventDefault()

    let videoId = $(e.currentTarget).data('vid')

    let videoTitle = $('#input_video_edit_title').val()
    let videoDesc = $('#txta_video_edit_description').val()
    let videoSrc = $('#txta_video_edit_src').val()
    
    let canGo = true

    if(videoTitle === '') {
      toastr.warning("video title cannot be null.")
      canGo = false
    }   

    if(videoSrc === '') {
      toastr.warning("video source cannot be null.")
      canGo = false
    }

    if(canGo) {
      let objVideo = {
        _id: videoId,
        title: videoTitle,
        description: videoDesc,
        videoSrc: videoSrc
      }

      updateVideo.call(objVideo, (err, res) => {
        if(err) { //-- If something's wrong
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })

    }
  }  
})
