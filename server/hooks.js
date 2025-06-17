//-- Never, not working...

// import { updateTrainingStatus } from '/imports/api/methods/training-status-summary.js';
// // import { TrainingStatusSummary } from '/imports/api/collections/training-status-summary.js'
// 
// import { TrainingModuleUserStats } from '/imports/api/collections/training-module-user-stats.js'
// 
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
// // import { updateTrainingStatus } from '/imports/api/methods/training-status-summary.js';
// 
//       updateTrainingStatus.call({ //-- not working from here...
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
