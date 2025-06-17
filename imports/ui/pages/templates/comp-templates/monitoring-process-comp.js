/**
 * Monitoring Process Comp version template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

import { MonitoringProcessComp } from '/imports/ui/pages/templates/comp-templates/monitoring-process-comp.html'
// import '/imports/ui/stylesheets/templates/monitoring-process-comp.less'

let _selfMonitoringProcessComp

Template.MonitoringProcessComp.onCreated(function monitoringProcessCompOnCreated() {
  _selfMonitoringProcessComp = this
  _selfMonitoringProcessComp.pageData = this.data || Session.get("pageData")
  // console.log(_selfMonitoringProcessComp.pageData)

  // _selfMonitoringProcessComp.done = false
})

Template.MonitoringProcessComp.onRendered(function monitoringProcessCompOnRendered() {
  let iframe = $('.sproutvideo-player')
  let iframeSrc = $(iframe).attr('src')

  if(iframeSrc) { //-- in case this template is an embedded one as a Comp template for a video
      let videoId = iframeSrc.split('embed/')[1].split('/')[0]

      if(videoId !== '') {
        let player = new SV.Player({videoId: videoId})

        player.bind('completed', function() {
          // console.log(videoId)
          
          $('#monitoring_process_comp_intro_modal').modal('show');

          $(".col-video-container").hide()
          $(".col-monitoring-process-comp-container").show()
          // $(".row-module-main-container").prepend( $(".col-monitoring-process-comp-container"))
          $('li.li-monitoring-process-comp img').eq(0).css({
            opacity: 1,
            'pointer-events': 'visible'
          })
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

  // if(_selfMonitoringProcessComp.done) {
  if(Session.get("MonitoringProcessComp.done")) {
      $('li.li-monitoring-process-comp img').css({
        opacity: 1,
        'pointer-events': 'visible'
      })    
  }

})

Template.MonitoringProcessComp.events({
  'click img.monitoring-process-comp-image'(e, tpl) {
    e.preventDefault()

    if(_selfMonitoringProcessComp.audio) {
      _selfMonitoringProcessComp.audio.pause()
    }

    let 
      iid = $(e.currentTarget).data('iid'),
      idx =  $('li.li-monitoring-process-comp img').index($(e.currentTarget));
    
    $('#monitoring_process_comp_'+iid).addClass('on').css('visibility', 'visible')

    _selfMonitoringProcessComp.audio = new Audio('/audio/monitoring_process_'+iid+'.mp3');
    _selfMonitoringProcessComp.audio.play()


    $(_selfMonitoringProcessComp.audio).bind('ended', function() {
      if(idx < 2) {
        $('li.li-monitoring-process-comp img').eq(idx+1).css({
          opacity: 1,
          'pointer-events': 'visible'
        })
        // $('li.li-monitoring-process-comp img').eq(idx+1).css('pointer-events', 'visible') 
      } 
      else if(idx === 2) {
        // $('.btn-module-navigation.btn-go-next').not('.btn-disabled').webuiPopover('show'); //-- unsafe-inline issue
        toastr.success("Click 'Next' To Proceed"); //-- this fixes unsafe-iinline issue
        Session.set("MonitoringProcessComp.done", true)
      }    
    })  

    //-- To move on to the next page, the trainee should view all three items.
    let viewedItems = $('.monitoring-process-comp-desc.on')

    if(viewedItems.length === 3) {      

      let statsObj = {           
        userId: Meteor.userId(),
        moduleId: _selfMonitoringProcessComp.pageData.moduleId,
        _page: _selfMonitoringProcessComp.pageData.index
      }

      upsertUserStats.call(statsObj, (err, res) => {
        if(err) {}
        else {
          Session.set('myUserStats', res)          
          // _selfMonitoringProcessComp.done = true
          // $('.btn-module-navigation.btn-go-next').webuiPopover('show');
// console.log(res)
          //-- This should be delayed. Otherwise, the page title 
          //-- will change to the viewed style immediated it's open.
          // _selfModule.pages = res.pages 
        }
      })
    }      

  }
})

Template.MonitoringProcessComp.onDestroyed(() => {
   if(_selfMonitoringProcessComp.audio) {
      _selfMonitoringProcessComp.audio.pause()
    }  
})

