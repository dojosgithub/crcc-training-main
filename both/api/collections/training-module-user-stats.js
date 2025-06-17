/**
 * TrainingModule  User Statistics collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema'

export const TrainingModuleUserStats = new Mongo.Collection('training_module_user_stats')

TrainingModuleUserStats.moduleSchema = new SimpleSchema({
  moduleId: {
    type: String,
    optional: true
  },
  pages: {
    type: Array,
    optional: true,
    defaultValue: []
  }
})

TrainingModuleUserStats.schema = new SimpleSchema({
  _id: {
    // type: Mongo.Collection.ObjectID,
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },  
  userId: {
    type: String,
    optional: true
  },
  venue: {
    type: String,
    optional: true
  }, 
  // module: {
  //   type: TrainingModuleUserStats.moduleSchema, //-- Dont' do this. FindAndModify has issues with this. Make it FLAT.
  //   optional: true,
  //   blackbox: true
  // },
  moduleId: {
    type: String,
    optional: true
  },
  pages: {
    type: Array,
    optional: true
  },
  _page: {
    type: Number,
    optional: true
  },      
  message: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true,
    defaultValue: new Date  
  },
  modifiedAt: {
    type: Date,
    optional: true,
    defaultValue: new Date
  },  
})

// TrainingModuleUserStats.attachSchema(TrainingModuleUserStats.schema);

// if(Meteor.isServer) {
// import { updateTrainingStatus } from '/imports/api/methods/training-status-summary.js';
// import { TrainingStatusSummary } from '/imports/api/collections/training-status-summary.js'

// TrainingModuleUserStats.after.insert(function(userId, doc) { 
//   // console.log(this.previous, this.transform(), userId, doc, fieldNames, modifier, options);
// 
//   if(this.transform()) {
//     let u = this.transform(); 
// 
//     if(u) {
// 
//       console.log(u)
// 
//       // TrainingStatusSummary.update({
//       //     userId: u.userId,
//       //     moduleId: u.moduleId
//       // }, {
//       //     $set: {
//       //         trainingStatus: "Started",
//       //         modifiedAt: new Date    
//       //     }                                                    
//       // });
// import { updateTrainingStatus } from '/imports/api/methods/training-status-summary.js';
// 
//       updateTrainingStatus.call({ //-- never, not working from here...
//         userId: u.userId,
//         moduleId: u.moduleId,
//         trainingStatus: "Started"
//       }, (err, res) => {
//         console.log(res)
//         if(err) {
//           sAlert.error("Something went wrong. Please sign-out, then, sign-in and try again. If this message still appears, please contact us at help@craassessments.com.");
//         }
//       })
// 
//     }
// 
//   }
// });

// }

