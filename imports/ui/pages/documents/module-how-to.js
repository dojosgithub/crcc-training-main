/**
 * Module How To template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'

import '/imports/ui/pages/documents/module-how-to.html'
// import '/imports/ui/stylesheets/documents/module-how-to.less'

Template.ModuleHowTo.onCreated(() => {

})

Template.ModuleHowTo.onRendered(() => {
  // $('#moduleHowToVideoModal').on('shown.bs.modal', function (e) {
  //   // do something...
  //       let _video = `
  //   <div style='position:relative;height:0;padding-bottom:56.158663883089766%'>
  //     <iframe class='sproutvideo-player' src='//videos.sproutvideo.com/embed/4c9adabf1b1cecc7c4/37b3277ff9a6fb22?playerTheme=dark&playerColor=2f3437' style='position:absolute;width:100%;height:100%;left:0;top:0' frameborder='0' allowfullscreen></iframe>
  //   </div> 
  //       `    
  //     $('#moduleHowToVideoModalSrc').append(_video)
  // }) 

    $('#moduleHowToVideoModal').on('hidden.bs.modal', () => {      
      $('#moduleHowToVideoModalSrc').empty()
    })   
})

// Template.ModuleHowTo.helpers({
//   TutorialVideo() { //-- This still causes blurry intro for about 10 seconds
//     return TrainingModuleVideos.findOne('FxNoioJpQ2EHDsTxS')
//   },
// })
