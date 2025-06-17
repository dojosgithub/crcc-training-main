/**
 * Monitoring Process template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

// import '/imports/ui/stylesheets/templates/monitoring-process.less'
import { MonitoringProcess } from '/imports/ui/pages/templates/page-templates/monitoring-process.html'

let _selfMonitoringProcess

Template.MonitoringProcess.onCreated(function monitoringProcessOnCreated() {
  _selfMonitoringProcess = this
  _selfMonitoringProcess.pageData = this.data
})

Template.MonitoringProcess.onRendered(function monitoringProcessOnRendered() {
  let iframe = $('.sproutvideo-player')
  let iframeSrc = $(iframe).attr('src')

  if(iframeSrc) { //-- in case this template is an embedded one as a Comp template for a video
      let videoId = iframeSrc.split('embed/')[1].split('/')[0]
      
      if(videoId !== '') {
        let player = new SV.Player({videoId: videoId})

        player.bind('completed', function() {
          _selfInputFindings.ready4FindingsInputButton.set(true)
        })  

        player.bind('progress', function(e) {
          _selfInputFindings.ready4FindingsInputButton.set(false)
        })
      }
  }
})

Template.MonitoringProcess.events({
  'click .monitoring-process-image'(e, tpl) {
    e.preventDefault()

    if(_selfMonitoringProcess.audio) {
      _selfMonitoringProcess.audio.pause()
    }

    let iid = $(e.currentTarget).data('iid')

    // $('.monitoring-process-desc').hide();

    // $('#monitoring_process_'+iid).css({
    //   display: 'inline-block'
    // }).fadeIn(500)  

    // let x = $(e.target).offset().left+100
    // let y = e.pageY

    // $('#monitoring_process_'+iid).css({
    //   display: 'inline-block',
    //   top: y,
    //   left: x-100
    // }).fadeIn(500).draggable({
    //   containment: $('.monitoring-process-container')
    // })

    // $('#monitoring_process_'+iid).show()
    $('#monitoring_process_'+iid).addClass('on').css('visibility', 'visible')

    _selfMonitoringProcess.audio = new Audio('/audio/monitoring_process_'+iid+'.mp3');
    _selfMonitoringProcess.audio.play()

    //-- To move on to the next page, the trainee should view all three items.
    let viewedItems = $('.monitoring-process-desc.on')

    if(viewedItems.length === 3) {
      // console.log(_selfMonitoringProcess)

      let statsObj = {           
        userId: Meteor.userId(),
        moduleId: _selfMonitoringProcess.pageData.moduleId,
        _page: _selfMonitoringProcess.pageData.index
      }

      upsertUserStats.call(statsObj, (err, res) => {
        if(err) {}
        else {
          Session.set('myUserStats', res)
          //-- This should be delayed. Otherwise, the page title 
          //-- will change to the viewed style immediated it's open.
          // _selfModule.pages = res.pages 
        }
      })
    }
  }
})

Template.MonitoringProcess.onDestroyed(() => {
   if(_selfMonitoringProcess.audio) {
      _selfMonitoringProcess.audio.pause()
    }  
})

