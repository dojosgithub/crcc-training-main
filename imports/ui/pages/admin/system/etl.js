/**
 * ETL template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { TraningModuleVideos } from '/both/api/collections/training-module-videos.js'

import { migrateVideoObject } from '/both/api/methods/etl.js'
// import { createTrainingStatusData } from '/imports/api/methods/training-status-summary.js'

import '/imports/ui/pages/admin/system/etl.html'

// import '/imports/ui/stylesheets/admin/system/etl.less'

Template.ETL.onCreated(function etlOnCreated() {

})

Template.ETL.events({
  'click .btn-migrate-video-object'(e, tpl) {
    e.preventDefault()

    toastr.error("You are not authorized.")
    // if(Meteor.user() && Meteor.user().profile.role === '1') {
    //   migrateVideoObject.call({})
    // } else {
    //   toastr.error("You are not authorized to perform this.")
    // }

  },
  'click .btn-create-training-status-summary-data'(e, tpl) {
    e.preventDefault();

    // console.log("AAA")
    // createTrainingStatusData.call({}, (err, res) => {
    //   console.log(err, res)
    // });

    Meteor.call("createTrainingStatusData", {}, (err, res) => {
      console.log(err, res)
    })
  }
})
