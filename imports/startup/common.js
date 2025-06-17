/**
 * Common start-up logic block (client-side)
 */

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

//-- The following 4 lines are needed for Tabular
//-- Install this first: meteor npm install --save datatables.net-bs 
import { $ } from 'meteor/jquery'
import dataTablesBootstrap from 'datatables.net-bs'

dataTablesBootstrap(window, $)

Meteor.startup(() => {
  //-- Code to run on client at startup

  if(Meteor.isProduction) {
  // if(Meteor.isDevelopment) {
      console.log = function() {};
  }  

  Tracker.autorun(function() {
      // if(!Meteor.userId()) {
      if(!Meteor.userId() && FlowRouter.current().path !== '/' ) {      
        // FlowRouter.go("/signin");
        FlowRouter.go("/signout");
      }
  });

  let obj = {
    width: $(window).width(),
    height: $(window).height()
  }

  $(window).resize(function(e) {

    obj.width = $(window).width()
    obj.height = $(window).height()

    Session.set("windowSize", obj);
  });

  Session.set("windowSize", obj);

  sAlert.config({
      effect: 'slide',//'stackslide',
      // position: 'top-right',
      position: 'bottom-right',
      timeout: 15000,
      html: false,
      onRouteClose: true,
      stack: true,
      // or you can pass an object:
      stack: {
          spacing: 5 // in px
          // limit: 3 // when fourth alert appears all previous ones are cleared
      },
      offset: 55, // in px - will be added to first alert (bottom or top - depends of the position in config)
      beep: false,
      // examples:
      // beep: '/beep.mp3'  // or you can pass an object:
      // beep: {
      //     info: '/beep-info.mp3',
      //     error: '/beep-error.mp3', 
      //     success: '/beep-success.mp3',
      //     warning: '/beep-warning.mp3'
      // }
      onClose: _.noop //
      // examples:
      // onClose: function() {
      //     /* Code here will be executed once the alert closes. */
      // }
  });

    $(document).on('keyup', function (e) {
        e.preventDefault();

        if(e.keyCode === 27) {
          $('.cropper-container').remove()
          $('.row-image-cropper').hide()                      
        }
    });

    if(process.env.NODE_ENV === 'development') { 
      // Meteor._reload.onMigrate(function() {
      Reload._onMigrate(function() {
        return [false];
      });    
    }

    $('.row-inject-loading').remove();
})


//-- This may not be desirable, but, works for now.
AdminImageOnload = function(e) {
  $(e.target).removeClass('pre-loading')
}

