/**
 * CRF Review Process Recap Comp version template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

// import '/imports/ui/stylesheets/templates/crf-review-process-recap.less'
import { CRFReviewProcessRecap } from '/imports/ui/pages/templates/comp-templates/crf-review-process-recap-comp.html'

let _selfCRFReviewProcessRecapComp

Template.CRFReviewProcessRecapComp.onCreated(function crfReviewProcessRecapCompOnCreated() {
  _selfCRFReviewProcessRecapComp = this
})

Template.CRFReviewProcessRecapComp.onRendered(function crfReviewProcessRecapCompOnRendered() {
  let iframe = $('.sproutvideo-player')
  let iframeSrc = $(iframe).attr('src')

  if(iframeSrc) { //-- in case this template is an embedded one as a Comp template for a video
      let videoId = iframeSrc.split('embed/')[1].split('/')[0]

      if(videoId !== '') {
        let player = new SV.Player({videoId: videoId})

        player.bind('completed', function() {
          $(".col-video-container").hide()
          $(".col-crf-review-process-recap-comp").show()
          // $(".row-module-main-container").prepend( $(".col-monitoring-process-comp-container"))
        })  

        player.bind('progress', function(e) {
          if(!$('.dummy-to-focus').is(':focus')) {
            $('.dummy-to-focus').focus()
          }
        })

        player.bind('pause', function() {
          if(!$('.dummy-to-focus').is(':focus')) {
            $('.dummy-to-focus').focus()
          }
        })
         
      }
  }  
})

Template.CRFReviewProcessRecapComp.events({
  'click .crf-rp-recap-image'(e, tpl) {
    e.preventDefault()

    if(_selfCRFReviewProcessRecapComp.audio) {
      _selfCRFReviewProcessRecapComp.audio.pause()
    }

    let iid = $(e.currentTarget).data('iid')   

   $('#crf_rpg_recap_'+iid).css('visibility', 'visible')

    _selfCRFReviewProcessRecapComp.audio = new Audio('/audio/crf_review_process_'+iid+'.mp3');
    _selfCRFReviewProcessRecapComp.audio.play()

  }
})

Template.CRFReviewProcessRecapComp.onDestroyed(() => {
   if(_selfCRFReviewProcessRecapComp.audio) {
      _selfCRFReviewProcessRecapComp.audio.pause()
    }  
})
