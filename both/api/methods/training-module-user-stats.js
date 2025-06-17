/**
 * Training Module User Stats methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'
import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'

//import { updateTrainingStatus } from '/imports/api/methods/training-status-summary.js'
import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js'

import { TrainingModuleMonitoringNotes } from '/both/api/collections/training-module-monitoring-notes.js'

// export const insertSetting = new Method('insertSetting', function(stats) {
//   return TrainingModuleStats.insert(log, {validate: true})
// })

export const insertUserStats = new ValidatedMethod({
  name: 'TrainingModuleUserStats.methods.insertUserStats',
  // validate: new SimpleSchema(TrainingModuleUserStats.schema).validator(),
  validate: ()=>{},
  run(stats) {
    check(stats, Object)
    
    return TrainingModuleUserStats.insert(stats)
  }
})

export const upsertUserStats = new ValidatedMethod({
  name: 'TrainingModuleUserStats.methods.upsertUserStats',
  // validate: new SimpleSchema(TrainingModuleUserStats.schema).validator({clean: true}),
  // validate: new SimpleSchema(TrainingModuleUserStats.schema).validator(),
  // validate: null,
  validate: ()=>{},
  run(stats) {
    check(stats, Object)
    // check(stats, {
    //   userId: String,
    //   moduleId: String,
    //   _page: Number,
    //   numPages: Number,
    //   viewedPages: Number,
    //   completedAt: Array
    // })
    this.unblock()

    let 
      completedAt = stats.completedAt || [],
      hasCompleted = false
// console.log(stats)
    // if(stats.numPages === stats.viewedPages-1) {
    if(stats.numPages === stats.viewedPages || stats.numPages < stats.viewedPages) {
      completedAt.push(new Date)
      hasCompleted = true
    }

    let _uStat = TrainingModuleUserStats.findAndModify({
      query: {
        moduleId: stats.moduleId,
        userId: stats.userId
      },
      update: {
        $setOnInsert: {
          moduleId: stats.moduleId,
          userId: stats.userId,
          createdAt: new Date
        },
        $set: {
          completedAt: completedAt,
          modifiedAt: new Date
        },
        // $push: { pages: stats._page }
        $addToSet: { pages: stats._page } //-- This rejects duplicated values
      },
      upsert: true,
      new: true
    })

    // console.log(_uStat);
    if(_uStat && _uStat.pages && _uStat.pages.length > 1) {

      let _inactivePages = TrainingModulePages.find({
        moduleId: _uStat.moduleId,
        status: { $ne: 1}
      }).fetch();

      if(_inactivePages && _inactivePages.length > 0) {
        let _inaPages = [];
        _inactivePages.forEach((p) => {
          _inaPages.push(p.order);
        });

        let _nUStatPages = _uStat.pages.filter(page => !_inaPages.includes(page));
        // console.log(_nUStatPages);
        if(_nUStatPages && _nUStatPages.length > 0) {
          _uStat.pages = _nUStatPages;

          TrainingModuleUserStats.update({            
              moduleId: stats.moduleId,
              userId: stats.userId
            },{              
              $set: { pages: _nUStatPages }         
          })          

        }
      }

    }

    let thisModule = TrainingModules.findOne(stats.moduleId)
    let totalPages =  thisModule && thisModule.numPages || 0

    // let myViewedPages = hasCompleted && stats.numPages ? parseInt(stats.numPages) || 0 : stats.viewedPages
    let myViewedPages = _uStat.pages && _uStat.pages.length-1 || 0

// console.log(stats);
      // updateTrainingStatus.call({
      //   userId: stats.userId,
      //   moduleId: stats.moduleId,
      //   trainingStatus: "Started"
      // }, (err, res) => {
      //   console.log(res)
      //   if(err) {
      //     sAlert.error("Something went wrong. Please sign-out, then, sign-in and try again. If this message still appears, please contact us at help@craassessments.com.");
      //   }
      // })      
  
    if(totalPages > 0) {
      
      if(_uStat && _uStat.pages && _uStat.pages.length-1 === 0) { //-- if it's the very first attempt of opening the module
        TrainingStatusSummary.update({
            userId: stats.userId,
            moduleId: stats.moduleId
        }, {
            $set: {
                "progress.totalPages": totalPages,
                trainingStatus: "Started", //-- change the status to "Started"
                modifiedAt: new Date,
                startedAt: new Date
            }                                                    
        }); 
      }


      let 
        progressPercent = Math.round(myViewedPages/totalPages * 100)

      let user = Meteor.users.findOne(stats.userId)

      if(user) {

        // let myNewModuleObj = {
        //   moduleId: stats.moduleId,
        //   progressPercent : progressPercent,
        //   modulePages : totalPages,
        //   progressPages : myViewedPages,
        //   progressPercent : progressPercent              
        // }

        let progressObj = {
          moduleId: stats.moduleId,
          modulePages: totalPages,
          progressPages: myViewedPages,
          progressPercent:  progressPercent,
          completedAt: completedAt 
        }

// console.log(progressObj)
        // console.log(stats.numPages, myViewedPages, totalPages, progressObj)

        let myModules = user.profile.moduleProgress || []

// console.log("myModules1 => ", myModules, stats.moduleId, progressObj)

        let myNewModules = []

        if(myModules && myModules.length > 0) { //-- check if moduleProgress is empty
          
          let _moduleIds = []

          // myModules.forEach((m) => {

          //   // if(m.moduleId && m.moduleId === stats.moduleId) {
          //   if(m.moduleId === stats.moduleId) {
          //     // let myNewModuleObj = progressObj

          //     myNewModules.push(progressObj)
          //     // m.modulePages = progressObj.modulePages
          //     // m.progressPages = progressObj.progressPages
          //     // m.progressPercent = progressObj.progressPercent
          //     // m.modulePages = progressObj.
          //     // m = progressObj

          //     // updated = true
          //     _moduleIds.push(m.moduleId)
          //   } 
          //   // else {
          //     // myNewModules.push(m)
          //     // myNewModules.push(progressObj)
          //   // }
          // })

          myNewModules = myModules.map((m) => {
            let _m = {}
              if(m.moduleId && m.moduleId === stats.moduleId) {
                _m.moduleId = progressObj.moduleId
                _m.modulePages = progressObj.modulePages
                _m.progressPages = progressObj.progressPages
                _m.progressPercent = progressObj.progressPercent 
                _m.completedAt = progressObj.completedAt 
                
                 _moduleIds.push(m.moduleId)               
              } else {
                _m = m
              }

              return _m
          })

          if(!_moduleIds.includes(progressObj.moduleId)) {
            myNewModules.push(progressObj)
          }

          // myModules = myNewModules
        } else { //-- if no moduleProgress exists yet, add it
          // myModules.push(progressObj)
          myNewModules.push(progressObj)
        }

// console.log("myModules2 => ", myModules)

        // let _newModuleProgress = myModules.concat(myNewModules)
        // Meteor.users.update(stats.userId, {
        //   $set: {
        //     // 'profile.moduleProgress': myModules
        //     'profile.moduleProgress': myNewModules
        //   }
        // })
      }

      // let _noteObj = {
      //   userId: stats.userId,
      //   pageId: stats.pageId,
      //   moduleId: stats.moduleId
      // }

      // TrainingModuleMonitoringNotes.update(_noteObj, {
      //   $set: {
      //     status: 3
      //   }
      // })
    }

    return _uStat

  }
})

// export const upsertUserStats = new ValidatedMethod({
//   name: 'TrainingModuleUserStats.methods.upsertUserStats',
//   // validate: new SimpleSchema(TrainingModuleUserStats.schema).validator({clean: true}),
//   // validate: new SimpleSchema(TrainingModuleUserStats.schema).validator(),
//   validate: null,
//   run(stats) {
//     check(stats, Object)
//     this.unblock()

//     let 
//       completedAt = stats.completedAt || [],
//       page = stats._page || []


//     if(stats.numPages === stats.viewedPages-1) {
//       completedAt.push(new Date)
//     }

//     // var transform = function(doc) {      
//     //   if (!doc) return;
//     //   _thisStatId = doc._id
//     //   doc._transform = function() {
//     //     // console.log(this)
//     //     return doc.findOne(_thisStatId);
//     //   }

//     //   return doc
//     // }

//     let _uStat = TrainingModuleUserStats.update({
//         moduleId: stats.moduleId,
//         userId: stats.userId
//       },
//       {
//         $setOnInsert: {
//           moduleId: stats.moduleId,
//           userId: stats.userId,
//           createdAt: new Date
//         },
//         $set: {
//           completedAt: completedAt,
//           modifiedAt: new Date
//         },
//         // $push: { pages: stats._page }
//         $addToSet: { pages: page } //-- This rejects duplicated values
//       },
//       {upsert: true}
    
//       , function(res) {
//           console.log(res);

//           // return res
//       let transformed = TrainingModuleUserStats.findOne({
//         moduleId: stats.moduleId,
//         userId: stats.userId        
//       })

//       console.log(stats.moduleId, stats._page, transformed)

//       }
//     )
// // console.log(_uStat)
//     // if(_uStat) {
//       // console.log(_uStat)
//      // let _transformedUStat =_uStat._transform()
//       // let transformed = TrainingModuleUserStats.findOne({
//       //   moduleId: stats.moduleId,
//       //   userId: stats.userId        
//       // })

//       // console.log(transformed)
//     // }
    
//     // return _transformedUStat

//     return _uStat

//   }
// })

export const updateUserStatsPages = new ValidatedMethod({
  name: 'TrainingModuleUserStats.methods.updateUserStatsPages',
  // validate: new SimpleSchema(TrainingModuleUserStats.schema).validator({clean: true}),
  validate: ()=>{},
  run(stats) {
    check(stats, Object)

    return TrainingModuleUserStats.findAndModify({
      query: {
        moduleId: stats.moduleId,
        userId: stats.userId
      },
      update: {
        $setOnInsert: {
          moduleId: stats.moduleId,
          userId: stats.userId,
          createdAt: new Date
        },        
        $set: {    
          modifiedAt: new Date
        },
        $push: { pages: stats._page }
      },
      upsert: true,
      new: true
    })

  }
});

export const updateUserStatsWShortTime = new ValidatedMethod({
  name: 'TrainingModuleUserStats.methods.updateUserStatsWShortTime',
  // validate: new SimpleSchema(TrainingModuleUserStats.schema).validator({clean: true}),
  validate: ()=>{},
  run(stats) {
    check(stats, Object)

    return TrainingModuleUserStats.findAndModify({
      query: {
        moduleId: stats.moduleId,
        userId: stats.userId
      },
      update: {        
        $set: {    
          short: stats.short
        },        
      }
    })

  }
});

