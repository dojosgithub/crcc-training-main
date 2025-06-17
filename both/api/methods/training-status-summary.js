/**
 * Training Status Summary methods
 */
// if(Meteor.isServer) {
    
import { Meteor } from 'meteor/meteor'

import { Method } from '/imports/api/lib/method.js'

import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js';
import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js';
import { SimUsersSummary } from '/both/api/collections/sim-users-summary.js'
import { TrainingModuleScoreSummary } from '/both/api/collections/training-module-score-summary.js'

export const updateTrainingStatus = new Method('updateTrainingStatus', function(obj) {
  
    try { 

        check(obj, {
            userId: String,
            moduleId: String,
            trainingStatus: String
        })        
        // console.log(obj)
        return TrainingStatusSummary.update({
            userId: obj.userId,
            moduleId: obj.moduleId
        }, {
            $set: {
                trainingStatus: obj.trainingStatus,
                modifiedAt: new Date    
            }                                                    
        });        

        // return TrainingStatusSummary.findAndModify({
        //     query: {
        //         userId: "FXGGKejaW6YzxLiKt",
        //         moduleId: "GtNsWGrWYpsWFS7Kf"
        //     },
        //     update: {
        //         $set: {
        //             trainingStatus: "Started",
        //             modifiedAt: new Date    
        //         }                 
        //     },
        //     upsert: true,
        //     new: true                                                   
        // }); 

    } catch(e) {
      // console.log( "Cannot get result data...", e )
    }  
    
})

// export const createTrainingStatusData = new Method("createTrainingStatusData", function() {
//     try { 
// 
//         let output = Meteor.wrapAsync((args, callback) => {
//             let _users = Meteor.users.find({
//                 "profile.role": '6',
//                 "profile.trainingModules": { $exists: true }
//             }).fetch();
// 
//             if(_users && _users.length > 0) {
//                 
//                 console.log("Length 1 => ", _users.length)
//                 var _bulk = TrainingStatusSummary.initializeUnorderedBulkOp();
//                 console.log("Length 2 => ", _users.length)
//                 _users.forEach((u, i) => {
//                     let 
//                         clientId = u.profile.clientId,
//                         buId = u.profile.buId,
//                         userId = u._id;
// 
//                     if(u.profile
//                         && u.profile.trainingModules 
//                         && u.profile.trainingModules.length > 0) {
// 
//                         let _sus = SimUsersSummary.findOne({
//                             userId: userId,
//                             status: { $ne: 'Deleted' },
//                             simulationName: { $regex: /^Baseline/ }
//                         });
// 
//                         if(_sus) {
//                             console.log("SUS => ", _sus._id);
//                             let _modProgressDict = [];
// 
//                             if(u.profile.moduleProgress && u.profile.moduleProgress.length > 0) {
// 
//                                 u.profile.moduleProgress.forEach((p) => {                                 
//                                     _modProgressDict[p.moduleId] = p;
//                                 })
//                                 
//                             }
// 
//     // console.log(clientId, buId, userId, _modProgressDict)
// 
// 
//                             u.profile.trainingModules.forEach((m) => {
// 
//                                 let _trainingStatus = 'Assigned';
// 
//                                 if(_modProgressDict[m]) {
//                                     let _progressPercent = _modProgressDict[m].progressPercent;
//                                     if(_progressPercent > 0) {
//                                         _trainingStatus =  _progressPercent === 100 ? 'Completed' : 'Started';
//                                     }
//                                 }
// 
//                                 // if(Meteor.isServer) {
//                                     console.log(userId, m, _sus.simulationId)
//                                     if(m) {
//                                         console.log(userId, m, _sus.simulationId)
//                                         // TrainingStatusSummary.update({
//                                         //     userId: userId,
//                                         //     moduleId: m
//                                         // }, {
//                                         //     $setOnInsert: {
//                                         //         simulationId: _sus.simulationId,
//                                         //         createdAt: new Date
//                                         //     },                                
//                                         //     $set: {                                    
//                                         //         trainingStatus: _trainingStatus,
//                                         //         modifiedAt: new Date,
//                                         //         completedAt: _modProgressDict[m].completedAt || null
//                                         //     }
//                                         // }, {
//                                         //     upsert: true
//                                         // })
// 
//                                         _bulk.find({
//                                             userId: userId,
//                                             moduleId: m
//                                         }).upsert().updateOne({
//                                             $setOnInsert: {
//                                                 simulationId: _sus.simulationId,
//                                                 createdAt: new Date
//                                             },                                
//                                             $set: {                                    
//                                                 trainingStatus: _trainingStatus,
//                                                 modifiedAt: new Date,
//                                                 completedAt: _modProgressDict[m].completedAt || null
//                                             }
//                                         });
// 
//                                     }
//                                 // }
//                             })
// 
//                         }
// 
// 
// 
//                     }
// 
//                 })
// 
//                 let _result = Promise.await(_bulk.execute());
// 
//                 callback(null, {success: true, data: _result});
// 
//             } //-- if(_users && _users.length > 0) {
// 
//         })
// 
// 
//         let result = output('dk')
// 
//         if(result) {
//             return result
//         } 
// 
// 
//     } catch(e) {
//       // console.log( "Cannot get result data...", e )
//     }     
// })

Meteor.methods({

"createTrainingStatusData"() {
    try { 
// console.log("BBB")
        let output = Meteor.wrapAsync((args, callback) => {
            var _users = Meteor.users.find({
                "profile.role": '6',
                "profile.trainingModules": { $exists: true }
            }).fetch();

// console.log("Length 1 => ", _users.length)

            if(_users && _users.length > 0) {
                
                var _bulk = TrainingStatusSummary.rawCollection().initializeUnorderedBulkOp();
                // console.log("Length 2 => ", _users.length)
                _users.forEach((u, i) => {
                    let 
                        clientId = u.profile.clientId,
                        buId = u.profile.buId,
                        userId = u._id;

                    if(u.profile
                        && u.profile.trainingModules 
                        && u.profile.trainingModules.length > 0) {

                        let _sus = SimUsersSummary.findOne({
                            userId: userId,
                            status: { $ne: 'Deleted' },
                            // simulationName: { $regex: /^Baseline/ }
                            $or: [
                              { simulationName: { $regex: /^Baseline/ } },
                              { simulationName: { $regex: /^Prehire/ } }
                            ]                             
                        });

                        if(_sus) {
                            // console.log("SUS => ", _sus._id);
                            let _modProgressDict = [];

                            if(u.profile.moduleProgress && u.profile.moduleProgress.length > 0) {

                                u.profile.moduleProgress.forEach((p) => {                                 
                                    _modProgressDict[p.moduleId] = p;
                                })
                                
                            }

    // console.log(clientId, buId, userId, _modProgressDict)


                            u.profile.trainingModules.forEach((m, j) => {

                                let 
                                    _trainingStatus = 'Assigned',
                                    _progressPercent = 0,
                                    _totalPages = 0,
                                    _pages = 0;

                                if(_modProgressDict[m]) {
                                    _progressPercent = _modProgressDict[m].progressPercent;
                                    _totalPages = _modProgressDict[m].modulePages;
                                    _pages = _modProgressDict[m].progressPages;

                                    if(_progressPercent > 0) {
                                        _trainingStatus =  _progressPercent === 100 ? 'Completed' : 'Started';
                                    }
                                }

                                // if(Meteor.isServer) {
                                    // console.log(userId, m, _sus.simulationId)
                                    if(m) {
                                        // console.log(userId, m, _sus.simulationId)
                                        // TrainingStatusSummary.update({
                                        //     userId: userId,
                                        //     moduleId: m
                                        // }, {
                                        //     $setOnInsert: {
                                        //         simulationId: _sus.simulationId,
                                        //         createdAt: new Date
                                        //     },                                
                                        //     $set: {                                    
                                        //         trainingStatus: _trainingStatus,
                                        //         modifiedAt: new Date,
                                        //         completedAt: _modProgressDict[m].completedAt || null
                                        //     }
                                        // }, {
                                        //     upsert: true
                                        // })

                                        let _tmus = TrainingModuleUserStats.findOne({
                                            userId: userId,
                                            moduleId: m
                                        });

                                        let _score = TrainingModuleScoreSummary.findOne({
                                            userId: userId,
                                            moduleId: m
                                        });

                                        if(!_score || _score.total === 0) {
                                            _trainingStatus = _progressPercent > 0 ? "Started" : "Assigned";
                                        }
// if(userId === 'HFbJP6KodK5aPoCdZ') {
//     console.log(_score)
//     console.log(_trainingStatus)
// }
// console.log(_sus)
                                        _bulk.find({
                                            userId: userId,
                                            moduleId: m
                                        }).upsert().updateOne({
                                            $setOnInsert: {
                                                // simulationId: _sus.simulationId,
                                                createdAt: new Date,
                                                // assignedAt: _sus.distributedAt || _sus.training.createdAt
                                            },                                
                                            $set: {
                                                status: 1,
                                                checked: true,
                                                clientId: _sus.clientId,
                                                buId: _sus.buId,
                                                simulationId: _sus.simulationId,                                   
                                                trainingStatus: _trainingStatus,
                                                progress: {
                                                    percent: _progressPercent,
                                                    total: _totalPages,
                                                    pages: _pages
                                                },
                                                score: {
                                                    correct: _score && _score.correct || 0,
                                                    total: _score && _score.total || 0,
                                                    percent: _score && _score.percent || 0
                                                },
                                                modifiedAt: new Date,
                                                startedAt: _tmus && _tmus.createdAt || null,
                                                assignedAt: _sus.distributedAt || (_sus.training && _sus.training.createdAt) || (_tmus && _tmus.createdAt) || null,
                                                completedAt: _modProgressDict[m] && _modProgressDict[m].completedAt || null
                                            }
                                        });

                                        // if(i === _users.length -1 && j === u.profile.TrainingModules.length -1) {
                                        //     let _result = Promise.await(_bulk.execute());
                                        //     callback(null, {success: true, data: _result});
                                        // }
                                    }
                                // }
                            })

                        }



                    }

                })
// 
                let _result = Promise.await(_bulk.execute());

                callback(null, {success: true, data: _result});

            } //-- if(_users && _users.length > 0) {

        })


        let result = output('dk')
// console.log(result)
        if(result) {
            return result
        } 


    } catch(e) {
        console.log(e)
      // console.log( "Cannot get result data...", e )
    }     
}

});
