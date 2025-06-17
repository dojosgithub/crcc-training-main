/**
 * MonitoringNotesExample template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

// import '/imports/ui/stylesheets/templates/monitoring-notes-example.less'
import { MonitoringNotesExample1 } from '/imports/ui/pages/templates/page-templates/monitoring-notes-example-1.html'

Template.MonitoringNotesExample1.onCreated(function monitoringNotesExample1OnCreated() {
})

Template.MonitoringNotesExample1.onRendered(function monitoringNotesExample1OnRendered() {
  $("audio").bind('timeupdate', function(e) {
    
    let currentTime = Math.floor(this.currentTime) 

    if(currentTime === 10) {
      console.log('note example 1 => ', currentTime)
    }
  })    
})

Template.MonitoringNotesExample1.events({
  'click .li-monitoring-notes-example-link a'(e, tpl) {
    e.preventDefault()

    let exid = $(e.currentTarget).data('exid')

    // let relativeX = (e.pageX - $(e.target).offset().left)
    // let relativeY = (e.pageY - $(e.target).offset().top)

    let x = $(e.target).offset().left+100
    let y = e.pageY

    $('.monitoring-notes-example-expln').hide()
    $('#monitoring_notes_example_expln_1_'+exid).css({
      display: 'inline-block',
      top: y,
      left: x
    }).fadeIn(500).draggable({
      containment: $('.module-monitoring-notes-example-container')
    })
  }
})
