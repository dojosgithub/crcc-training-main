/**
 * Admin New Video template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'
import { insertVideo, updateVideoStatus } from '/both/api/methods/training-module-videos.js'

// import '/imports/ui/stylesheets/admin/videos/admin-new-video.less'
import { AdminNewVideo } from '/imports/ui/pages/admin/videos/admin-new-video.html'

import { AdminVideoEdit } from '/imports/ui/pages/admin/videos/admin-video-edit.js'

let _selfAdminNewVideo
let _subsAdminNewVideo

Template.AdminNewVideo.onCreated(function adminNewVideoOnCreated() {
  _selfAdminNewVideo = this

  _subsAdminNewVideo = new SubsManager()

  _selfAdminNewVideo.ready4Videos = new ReactiveVar()
  _selfAdminNewVideo.videoToEdit = new ReactiveVar()
  _selfAdminNewVideo.addedVideoIds = new ReactiveVar([])

  _selfAdminNewVideo.autorun(() => {
    if(_selfAdminNewVideo.addedVideoIds.get().length > 0) {
      let handleVideos = _subsAdminNewVideo.subscribe('training_module_videos_w_ids', _selfAdminNewVideo.addedVideoIds.get())
      _selfAdminNewVideo.ready4Videos.set(handleVideos.ready())
    }
  })

})

Template.AdminNewVideo.helpers({
  addedVideos() {
    if(_selfAdminNewVideo.addedVideoIds.get().length > 0) {
      // console.log(_selfAdminNewVideo.addedVideoIds.get(), _selfAdminNewVideo.addedVideoIds.get().length, TrainingModuleVideos.find().fetch())
      return TrainingModuleVideos.find({
        _id: {$in: _selfAdminNewVideo.addedVideoIds.get()}
      })
    }
  },
  videoToEdit() {
    return _selfAdminNewVideo.videoToEdit.get()
  }
})

Template.AdminNewVideo.events({
  'click .btn-submit-new-video'(e, tpl) {
    e.preventDefault()

    $(e.currentTarget).button('loading')

    let videoTitle = $('#input_new_video_title').val()
    let videoDesc = $('#txta_new_video_description').val()
    let videoSrc = $('#txta_new_video_src').val()
    
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

      $('.video-temp-holder').append(videoSrc)

      let videoId = videoSrc.split('embed/')[1].split('/')[0]

      // console.log(videoId)

      if(videoId !== '') {

        let player = new SV.Player({videoId: videoId})
        let duration
        let i = 0
        player.bind('ready', function(e) {
          duration = player.getDuration()
          // console.log(duration)

          if(duration && videoId && i === 0) {
            i++
            let objVideo = {
              title: videoTitle,
              description: videoDesc,
              video: { 
                src: videoSrc,
                videoId: videoId,
                duration: duration
              },        
              creator: {
                fullname: Meteor.user().profile.fullname,
                userId: Meteor.userId()
              }
            }

            insertVideo.call(objVideo, (err, res) => {
              if(err) { //-- If something's wrong
                toastr.error("Something went wrong. " + err)
              } else {
                toastr.info("Successfully added.")
                
                $('.video-temp-holder').empty()

                let addedVideoIds = _selfAdminNewVideo.addedVideoIds.get()
                addedVideoIds.push(res)
                _selfAdminNewVideo.addedVideoIds.set(addedVideoIds)
              }
              $('button').button('reset')
            })
          } else {
            $('button').button('reset');
          }

        })
        // let duration = player.getDuration()        
        // console.log(duration)
      }   
       


      // insertVideo(objVideo, (err, res) => {
      //   if(err) { //-- If something's wrong
      //     toastr.error("Something went wrong. " + err)
      //   } else {
      //     toastr.info("Successfully done.")

      //     let addedVideoIds = _selfAdminNewVideo.addedVideoIds.get()
      //     addedVideoIds.push(res)
      //     _selfAdminNewVideo.addedVideoIds.set(addedVideoIds)
      //   }        
      // }) 

    }
  },
  'click .btn-delete-video'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to delete this video?")) {
      let vid = $(e.currentTarget).parent().data('vid')

      let video = {
        _id: vid,
        status: 4
      }
      updateVideoStatus.call(video, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })
    }
  },
  'click .btn-edit-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).parent().data('vid')
    _selfAdminNewVideo.videoToEdit.set(vid)    

    $('.row-admin-video-edit').show()

  },
  'click .btn-activate-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).parent().data('vid')   
   
    if(confirm("Are you sure to activate this video?")) {

      let video = {
        _id: vid,
        status: 1
      }
      
      updateVideoStatus.call(video, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully activated.")
        }
      })

    }
  },
  'click .btn-deactivate-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).parent().data('vid')   

    if(confirm("Are you sure to deactivate this video?")) {

      let video = {
        _id: vid,
        status: 2
      }
      
      updateVideoStatus.call(video, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deactivated.")
        }
      })
 
    }
  },  
})

Template.AdminNewVideo.onDestroyed(function adminNewVideoOnDestroyed() {
  _subsAdminNewVideo.clear()
})

