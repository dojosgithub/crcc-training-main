/**
 * MonitoringNotesExample template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

// import '/imports/ui/stylesheets/templates/monitoring-notes-example.less'
import { MonitoringNotesExample2 } from '/imports/ui/pages/templates/page-templates/monitoring-notes-example-2.html'

Template.MonitoringNotesExample2.onCreated(function monitoringNotesExample2OnCreated() {
})

Template.MonitoringNotesExample2.events({
  'click .li-monitoring-notes-example-link a'(e, tpl) {
    e.preventDefault()

    let exid = $(e.currentTarget).data('exid')

    // let relativeX = (e.pageX - $(e.target).offset().left)
    // let relativeY = (e.pageY - $(e.target).offset().top)

    let x = $(e.target).offset().left+100
    let y = e.pageY

    $('.monitoring-notes-example-expln').hide()
    $('#monitoring_notes_example_expln_2_'+exid).css({
      display: 'inline-block',
      top: y,
      left: x
    }).fadeIn(500).draggable({
      containment: $('.module-monitoring-notes-example-container')
    })
  }
})
