/**
 * CRF Review Process Recap template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

// import '/imports/ui/stylesheets/templates/crf-review-process-recap.less'
import { CRFReviewProcessRecap } from '/imports/ui/pages/templates/page-templates/crf-review-process-recap.html'

let _selfCRFReviewProcessRecap

Template.CRFReviewProcessRecap.onCreated(function crfReviewProcessRecapOnCreated() {
    _selfCRFReviewProcessRecap = this
    _selfCRFReviewProcessRecap.pageData = this.data
    _selfCRFReviewProcessRecap.viewed = []
})

Template.CRFReviewProcessRecap.onRendered(function crfReviewProcessRecap() {
  // $("audio#module_page_audio").load()
  // $("audio#module_page_audio").play()
  // console.log('aaa')
  // $("audio#module_page_audio").bind('timeupdate', function(e) {
  //   // console.log(e, this)
  //   // let currentTime = Math.floor(this.currentTime) 

  //   // if(currentTime === 5) {
  //     // console.log(currentTime)
  //   // }
  // })  

  if(Session.get('hasCRFReviewProcessRecapAudioDone')) {
    $('li.li-crf-review-process-recap img').css('pointer-events', 'visible')
  } else {
    $("audio#module_page_audio").bind('ended', function(e) {
      Session.set('hasCRFReviewProcessRecapAudioDone', true)
      // $('li.li-crf-review-process-recap img').css('pointer-events', 'visible')
      $('li.li-crf-review-process-recap img').eq(0).css('pointer-events', 'visible')
      $('.crf-review-process-recap-item').not('.crf-review-process-recap-source').css({
        opacity: 0.5
      })
    }) 
  }

  // Tracker.autorun(() => {
  //   if(Session.get("CRFReviewProcessRecap.viewed")) {

  //   }
  // })

  if(Session.get("CRFReviewProcessRecap.done")) {
    $('li.li-crf-review-process-recap img').css('pointer-events', 'visible')
    $('.crf-review-process-recap-item').css({
      opacity: 1
    })    
  }

})

Template.CRFReviewProcessRecap.events({
  'click .crf-rp-recap-image'(e, tpl) {
    e.preventDefault()

    if(_selfCRFReviewProcessRecap.audio) {
      _selfCRFReviewProcessRecap.audio.pause()
    }

    let 
      iid = $(e.currentTarget).data('iid'),
      idx = $('li.li-crf-review-process-recap img').index($(e.currentTarget));

   $('#crf_rpg_recap_'+iid).addClass('on').css('visibility', 'visible')

   // if(idx < 3) {
    // setTimeout(function() {
    //   $('.crf-review-process-recap-item').eq(idx+1).css({opacity: 1})
    //   $('li.li-crf-review-process-recap img').eq(idx+1).css('pointer-events', 'visible')
    // }, 3000)
   // }

    _selfCRFReviewProcessRecap.audio = new Audio('/audio/crf_review_process_'+iid+'.mp3');
    _selfCRFReviewProcessRecap.audio.play()

    $(_selfCRFReviewProcessRecap.audio).bind('ended', function() {
      if(idx < 3) {
        $('.crf-review-process-recap-item').eq(idx+1).css({opacity: 1})
        $('li.li-crf-review-process-recap img').eq(idx+1).css('pointer-events', 'visible') 
      } 
      else if(idx === 3) {
        // $('.btn-module-navigation.btn-go-next').not('.btn-disabled').webuiPopover('show'); //-- unsafe-inline issue
        toastr.success("Click 'Next' To Proceed"); //-- this fixes unsafe-iinline issue
        Session.set("CRFReviewProcessRecap.done", true)
      }    
    })

    //-- To move on to the next page, the trainee should view all three items.
    let viewedItems = $('.crf-review-process-recap-desc.on')

    if(viewedItems.length === 4) {      

      let statsObj = {           
        userId: Meteor.userId(),
        moduleId: _selfCRFReviewProcessRecap.pageData.moduleId,
        _page: _selfCRFReviewProcessRecap.pageData.index
      }

      upsertUserStats.call(statsObj, (err, res) => {
        if(err) {}
        else {
          Session.set('myUserStats', res)          
          // $('.btn-module-navigation.btn-go-next').webuiPopover('show');

          //-- This should be delayed. Otherwise, the page title 
          //-- will change to the viewed style immediated it's open.
          // _selfModule.pages = res.pages 
        }
      })
    }
  }
})

Template.CRFReviewProcessRecap.onDestroyed(() => {
   if(_selfCRFReviewProcessRecap.audio) {
      _selfCRFReviewProcessRecap.audio.pause()
    } 

    Session.set('hasCRFReviewProcessRecapAudioDone', null) 
})
