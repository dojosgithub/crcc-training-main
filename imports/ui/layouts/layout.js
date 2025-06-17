/**
 * Layout modules. Depending on the page layout, 
 * side-bars can also be included (ie. the left/right 
 * sidebar modules in imports/ui/sidebars). 
 */

import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'

// import '/imports/ui/stylesheets/header.less'
// import '/imports/ui/stylesheets/footer.less'

import '/imports/ui/layouts/header.html'
import '/imports/ui/layouts/footer.html'
import '/imports/ui/layouts/layout.html'

import { ImageCropper } from '/imports/ui/pages/admin/images/admin-image-cropper.js'
import { AdminModuleBuilder } from '/imports/ui/pages/admin/modules/admin-module-builder.js'

// _moduleFooterTimer = null;
// _moduleFooterPageTimer = null;
// _moduleFooterVideoTimer = null;

Template.Layout.onCreated(() => {

  Tracker.autorun(() => {
    let isProduction = process.env.NODE_ENV === 'production' ? true : false

    Session.set("isProduction", isProduction)
  })
})

Template.Layout.onRendered(() => {
  // let _craaCookieAcceptance = Meteor.libMethods.setCRAACookieAcceptance("_CRAA_CA"); //-- commented out, leaving only one to app site (03/12/2022)
})
