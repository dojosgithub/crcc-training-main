/**
 *  Admin Video template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'
import { updateVideo, updateVideoStatus, deleteVideo } from '/both/api/methods/training-module-videos.js'

import { updateModulePageVideo } from '/both/api/methods/training-module-pages.js'

// import '/imports/ui/stylesheets/admin/videos/admin-video-template.less'
import '/imports/ui/pages/admin/videos/admin-video-template.html'

Template.AdminVideoActions.events({
  'click .btn-delete-table-video'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to remove this video?")) {
      let vid = $(e.currentTarget).parent().parent().data('vid')  
      let status = parseInt($(e.currentTarget).data('status'))  

      let objVideo = {
        _id: vid,
        status: status
      }

      updateVideoStatus.call(objVideo, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })   
    }
  },
  'click .btn-save-table-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).parent().parent().data('vid')
    let title = $('#input_table_video_title_'+vid).val()
    let desc = $('#txta_table_video_desc_'+vid).val()
    let src = $('#txta_table_video_src_'+vid).val()

    let videoId = $(e.currentTarget).parent().parent().data('spvid');
    
    if(vid !== '' && videoId !== '' && src !== '') {

      $('#'+vid).append(src);

      let nVideoId = src.split('embed/')[1].split('/')[0];

      let 
        player = new SV.Player({videoId: nVideoId}),
        duration = 0;
      // console.log("player: ", player);
      player.bind('ready', function(e) {
        duration = player.getDuration();
        // console.log("duration: ", duration);

        let objVideo = {
          _id: vid,        
          title: title,
          description: desc,
          video: {
            videoId: nVideoId || videoId,
            src: src,
            duration: duration
          }
        }
  
        updateVideo.call(objVideo, (err, res) => {
          if(err) {
            toastr.error("Something went wrong. " + err)
          } else {
            toastr.info("Successfully updated.")
          }
        })

      });
    }
  },
  'click .btn-update-table-video-status'(e, tpl) {
    e.preventDefault()

    let status = parseInt($(e.currentTarget).data('status'))
    let command = status === 1 ? 'activate' : 'deactivate' 

    if(confirm("Are you sure to " + command + " this video?")) {
      let vid = $(e.currentTarget).parent().parent().data('vid')    

      let objVideo = {
        _id: vid,
        status: status
      }

      updateVideoStatus.call(objVideo, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully " + command + "d.")
        }
      })   
    }
  },    
})

let _selfAdminVideoThumbnail

Template.AdminVideoThumbnail.onCreated( function adminVideoThumbnailOnCreated() {
  _selfAdminVideoThumbnail = this

  _selfAdminVideoThumbnail.video = new ReactiveDict()

})

Template.AdminVideoThumbnail.events({
  'click .btn-view-table-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).data('vid')
    let src = $(e.currentTarget).data('src')
    let title = $(e.currentTarget).data('title')

    _selfAdminVideoThumbnail.video.set('_id', vid)
    _selfAdminVideoThumbnail.video.set('title', title)
    _selfAdminVideoThumbnail.video.set('src', src)

    // $('#videoModalTitle').empty().append(title)
    // $('#videoModalSrc').empty().append(src)

    let videoToView = {
      _id: vid,
      title: title,
      src: src
    }
    // Session.set('videoToView', _selfAdminVideoThumbnail.video) //-- This wraps each value within double quot marks.
    Session.set('videoToView', videoToView)

    $('#videoModal').on('hidden.bs.modal', () => {
        
      // let iframe = $('.sproutvideo-player')
      // let iframeSrc = $(iframe).attr('src')

      // let videoId = iframeSrc.split('embed/')[1].split('/')[0]
      
      // if(videoId !== '') {
      //   var player = new SV.Player({videoId: videoId});

      //   player.pause()
      // }

      //-- This works for all media source.
      $("#videoModal iframe").attr("src", $("#videoModal iframe").attr("src"))
    })

  }
})

// Template.AdminVideoThumbnail.helpers({
//   videoTitle() {
//     return _selfAdminVideoThumbnail.video.get('title')
//   },
//   videoSrc() {
//     return _selfAdminVideoThumbnail.video.get('src')
//   },  
// })

Template.AdminVideoModal.helpers({
  Video() {
    if(Session.get('videoToView')) {
      return Session.get('videoToView')
    }
  }  
})

Template.AdminModulePageAllVideosActions.events({
  'click .btn-save-table-video'(e, tpl) {
    e.preventDefault()

    let vid = $(e.currentTarget).parent().parent().data('vid')
    let title = $('#input_table_video_title_'+vid).val()
    let desc = $('#txta_table_video_desc_'+vid).val()
    let src = $('#txta_table_video_src_'+vid).val()

    if(vid !== '') {

      let objVideo = {
        _id: vid,
        title: title,
        description: desc,
        video: {
          src: src
        }
      }

      updateVideo.call(objVideo, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })
    }
  },  
  'click .btn-select-this-video'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to select this video?")) {
      let vid = $(e.currentTarget).parent().parent().data('vid')

      let video = TrainingModuleVideos.findOne(vid)
  
      if(video && video.video.src) {

        let obj = {
          _id: Session.get("pageToBuild"),
          video: {
            videoId: video._id,
            videoSrc: video.video.src,
            videoSVid: video.video.videoId,
            videoDuration: video.video.duration
          }
        }
        console.log(obj)
        updateModulePageVideo.call(obj, (err, res) => {
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
