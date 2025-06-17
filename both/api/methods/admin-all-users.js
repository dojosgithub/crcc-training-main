/**
 * Admin All Users methods
 */
import { Meteor } from 'meteor/meteor'

// import { Accounts } from 'meteor/accounts-base'

import { Promise } from 'meteor/promise';
import { check } from 'meteor/check';

import { Clients } from '/both/api/collections/clients.js';
import { Simulations } from '/both/api/collections/simulations.js';
import { SimUsersSummary } from '/both/api/collections/sim-users-summary.js';
import { SimulationSettings } from '/both/api/collections/simulation-settings.js';
import { UserNotes } from '/both/api/collections/user-notes.js';
import { SimulationUsersStatus } from '/both/api/collections/simulation-users-status.js';
import { EmailTemplates } from '/both/api/collections/email-templates.js';

import { TrainingModuleUserLogs } from '/both/api/collections/training-module-user-logs.js';
import { TrainingModuleScores } from '/both/api/collections/training-module-scores.js';
import { TrainingModuleScoreSummary } from '/both/api/collections/training-module-score-summary.js';

import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js';

import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js';

import { APIConfig } from '/both/startup/config/api-config.js'
import { Wrapper } from '/imports/api/lib/wrappers.js'

import { Method } from '/imports/api/lib/method.js';

import { Util } from '/imports/api/lib/util.js'

const apiURL = APIConfig[process.env.NODE_ENV].apiURL
let headers = {
    'X-Auth-Token': APIConfig.XAuthToken,
    'X-User-Id': APIConfig.XUserId
}

const ObjectID = (rnd = r16 => Math.floor(r16).toString(16)) =>
    rnd(Date.now()/1000) + ' '.repeat(16).replace(/./g, () => rnd(Math.random()*16));

export const getAllAppUsers = new Method('getAllAppUsers', function() {
  
  try {

      let url = apiURL + '/all_app_users'
      // let url = apiURL + '/all_simulations_status'

      let result = Wrapper.httpWrapAsync(url, headers)

      if(result) {
          return result.data.data
      }

  } catch(e) {
      console.log( "Cannot get result data...", e )
  }  
  
})

//-- via RemoteCollectionDriver
export const getActiveUsersWSummary = new Method('getActiveUsersWSummary', function(cronjob) {  
  try {
    
    if(Meteor.isServer) {

      let myUid = cronjob ? null : Meteor.userId()

      let output = Meteor.wrapAsync((args, callback) => {

        // let 
          // rawSimUsersSummary = SimUsersSummary.rawCollection(),
          // aggregateQuerySimUsersSummary = Meteor.wrapAsync(rawSimUsersSummary.aggregate, rawSimUsersSummary)

        let pipelineSimUsersSummary = 
        [
          { 
            $match: {
              // status: 'Active.'
              status: { $ne: 'Deleted' }
            }
          },
          {
            $group: {
              "_id": "$userId",
              clientName: {"$first": "$clientName"},
              clientId: {"$first": "$clientId"},
              buName: {"$first": "$buName"},
              buId: {"$first": "$buId"},
              username: {"$first": "$username"},
              lastname: {"$first": "$lastname"},          
              firstname: {"$first": "$firstname"},
              fullname: {"$first": "$fullname"},
              initial: {"$first": "$initial"},
              email: {"$first": "$email"},
              roleKey: {"$first": "$roleKey"},
              managerName: {"$first": "$managerName"},
              managerId: {"$first": "$managerId"},
              country: {"$first": "$country"},
              regionName: {"$first": "$regionName"},
              userGroup: {"$first": "$userGroup"},
            }
          },
          {
            $lookup: {
              from: 'users',
              // localField: 'userId',
              localField: '_id', //-- Take the grouped userId
              foreignField: '_id',
              as: 'User'
            }
          },
          {
            $unwind: "$User"
          },
          // {
          //   $match: {
          //     "User.profile.status": { $ne: 4 }
          //   }
          // },
          {
            $project: {
              "clientName": 1,
              "clientId": 1,
              "buName": 1,
              "buId": 1,
              "username": 1,
              "lastname": 1,
              "firstname": 1,
              "fullname": 1,
              "initial": 1,
              "email": 1,
              "roleKey": 1,
              "managerName": 1,
              "managerId": 1,
              "country": 1,
              "regionName": 1,
              "userGroup": 1,
              // "User._id": 1,
              // "User.emails": 1,
              // "User.services": 1,
              // "User.profile.status": 1,
              // "User.createdAt": 1,
              "User": "$User"
            }
          }        
        ]

        // let result = aggregateQuerySimUsersSummary(pipelineSimUsersSummary)
        // let result = aggregateQuerySimUsersSummary(pipelineSimUsersSummary)
        let result = Promise.await(SimUsersSummary.rawCollection().aggregate(pipelineSimUsersSummary).toArray());

// console.log(result.length)

        // let url = apiURL + '/active_users_w_unique_sim_summary'

        // let result = Wrapper.httpWrapAsync(url, headers)

        if(result) {
         
          let uLength = result.length
          let i = 0
// console.log(uLength)
          let newUsers = []
          
          // resolve(users)

          result.forEach((su) => {
            i++

            // let u = su.User[0]
            let u = su.User

            // console.log(su, u.emails && u.emails[0].address)

            let firstname = su.firstname,
                lastname = su.lastname,
                fullname = su.fullname,
                initial = su.initial,
                email = su.email,
                clientName = su.clientName,
                clientId = su.clientId,
                buName = su.buName,
                buId = su.buId,
                username = su.username,
                roleKey = su.roleKey,
                managerName = su.managerName,
                managerId = su.managerId,
                country = su.country,
                regionName = su.regionName,
                userGroup = su.userGroup,
                status = u && u.profile.status          

            let trUser = Meteor.users.find(u._id)
// console.log(u._id)        
// if(trUser.fetch()[0]['emails'][0].address === 'christopher5735@gmail.com')   {
//   console.log(u._id, trUser.fetch()[0])          
// }
            if(trUser && trUser.fetch()[0]) { //-- if user already exists, update the user info
              let curUser = trUser.fetch()[0]
              if((myUid === null || u._id !== myUid) && (curUser && curUser.profile&& !curUser.profile.online)) {   

                let _trUserEmail = curUser['emails'][0]['address'];

                // if(_trUserEmail && _trUserEmail.includes("quintiles")) {
                //   console.log(_trUserEmail)
                // }

                let _$set = {
                  emails: u.emails,
                  // "emails.0.address": email,
                  services: u.services,
                  username: username,
                  // profile: { //-- This will reset profile data, including trainingModules...
                  "profile.firstname": firstname, //-- so, we have to go this way...
                  "profile.lastname": lastname,
                  "profile.fullname": fullname,
                  "profile.initial": initial,
                  "profile.status": status,
                  "profile.role": roleKey,
                  "profile.clientName": clientName,
                  "profile.clientId": clientId,
                  "profile.buName": buName,
                  "profile.buId": buId,
                  "profile.managerName": managerName,
                  "profile.managerId": managerId,
                  "profile.country": country,
                  "profile.regionName": regionName,
                  "profile.userGroup": userGroup,
                  // status: u.status,                  
                  "profile.modifiedAt": new Date
                }

                // Meteor.users.update(u._id, {
                Meteor.users.update(curUser._id, {
                  $set: _$set
                })

              }
            } //-- if(trUser && trUser.fetch()[0]) {
            else { //-- otherwise, add the user           
              // console.log(su._id)

              // let _trUserWEmail = Meteor.users.findOne({
              //   'emails.address': email
              // })
              let _trUserWEmail = Meteor.users.findOne({
                'emails.address': email
              })              
// console.log(_trUserWEmail.fetch()[0])
              // if(1===1) {
              if(!_trUserWEmail) { //-- to avoid Email dup error: for some reason, for some users, Email Dup error happens
                let user = {
                  _id: su._id,
                  emails: u.emails,
                  username: username,
                  profile: {
                    clientName: clientName,
                    clientId: clientId,
                    buName: buName,
                    buId: buId,
                    firstname: firstname,
                    lastname: lastname,
                    fullname: fullname,
                    role: roleKey,
                    status: status,
                    initial: initial,
                    managerName: managerName,
                    managerId: managerId,
                    country: country,
                    regionName: regionName,
                    userGroup: userGroup,
                    addedAt: new Date,
                    modifiedAt: new Date
                  },
                  services: u.services,
                  // status: u.status,
                  // trainingModules : [],
                  createdAt: u.createdAt,
                }

                // if(Meteor.isServer) {
                  Meteor.users.insert(user)
                  // Accounts.createUser(user)
                // }            

                newUsers.push(user)
              } //-- if(!_trUserWEmail) {
              else { //-- this could raise the Email Dup error, so, let's get informed
                if(process.env.NODE_ENV === "production") {
                  Email.send({
                    to: "david.kim@craassessments.com",
                    from: "admin@craassessments.com",               
                    subject: "TRUser: check",
                    html: _trUserWEmail.profile.fullname + "<br>" + email
                  }); 
                }                 
              }
            }

            if(uLength === i) {
              callback(null, {success: true, data: newUsers})
            }
          })

        } else {
          callback(null, {success: false})
        }

      })

      let result = output('dk')

      if(result) {
        return result
      }    

    } //-- if isServer

  } catch(e) {
      console.log( "Cannot get result data...", e )
  }
})

export const syncUserData = new Method('syncUserData', function(user) {
  // console.log("syncUserData => ", user)
  try {

    check(user, Object)

    if(Meteor.isServer) {

      // import { CoreDB } from '/both/startup/config/db-config.js';

      let output = Meteor.wrapAsync((args, callback) => { 

        let pipelineSimUsersSummary = [
          {
            $match: {
              userId: user._id              
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "users"
            }     
          },
          {
            $unwind: "$users"
          },
          {
            $group: {
              _id: "$userId",
              // _id: null,
              firstname: { $first: "$firstname" },
              lastname: { $first: "$lastname" },
              fullname: { $first: "$fullname" },
              initial: { $first: "$initial" },
              email: { $first: "$email" },
              clientName: { $first: "$clientName" },
              clientId: { $first: "$clientId" },
              buName: { $first: "$buName" },
              buId: { $first: "$buId" },
              username: { $first: "$username" },
              roleKey: { $first: "$roleKey" },
              managerName: { $first: "$managerName" },
              managerId: { $first: "$managerId" },
              country: { $first: "$country" },
              regionName: { $first: "$regionName" },
              userGroup: { $first: "$userGroup" },
              status: { $first: "$users.profile.status" },
              emails: { $first: "$users.emails" },
              services: { $first: "$users.services" },
              _slt: { $first: "$users.profile._slt"}
            }
          },
          {
            $project: {
              // _id: 0,
              uid: "$_id",
              firstname: "$firstname",
              lastname: "$lastname",
              fullname: "$fullname",
              initial: "$initial",
              email: "$email",
              clientName: "$clientName",
              clientId: "$clientId",
              buName: "$buName",
              buId: "$buId",
              username: "$username",
              roleKey: "$roleKey",
              managerName: "$managerName",
              managerId: "$managerId",
              country: "$country",
              regionName: "$regionName",
              userGroup: "$userGroup",
              status: "$status",
              emails: "$emails",
              services: "$services",
              _slt: "$_slt"
            }
          }

        ]

        let result = Promise.await(SimUsersSummary.rawCollection().aggregate(pipelineSimUsersSummary).toArray());
// console.log(result)
        if(result && result.length > 0) {
          // return result.data.data

          result.forEach((u,i) => {
// console.log(i, u, u.clientName)
            Meteor.users.update(u.uid, {
              $set: {
                emails: u.emails,
                services: u.services,
                username: u.username,
                // profile: { //-- This will reset profile data, including trainingModules...
                "profile.firstname": u.firstname, //-- so, we have to go this way...
                "profile.lastname": u.lastname,
                "profile.fullname": u.fullname,
                "profile.initial": u.initial,
                "profile.status": u.status,
                "profile.role": u.roleKey,
                "profile.clientName": u.clientName,
                "profile.clientId": u.clientId,
                "profile.buName": u.buName,
                "profile.buId": u.buId,
                "profile.managerName": u.managerName,
                "profile.managerId": u.managerId,
                "profile.country": u.country,
                "profile.regionName": u.regionName,
                "profile.userGroup": u.userGroup,
                // status: u.status,                  
                "profile.modifiedAt": new Date,
                "profile._slt": u._slt
              }
            });
          })            
        }

        callback(null, {success: true, user: result[0]});
      }) //-- let output = Meteor.wrapAsync((args, callback) => { 
           
      let _result = output('dq')

      if(_result) {
        return _result
      }


    } //-- if(Meteor.isServer)
    
  } catch(e) {
      console.log( "Cannot get result data...", e )
  }

})

export const syncUserPassword = new Method('syncUserPassword', function(user) {
  
  try {

    check(user, Object)

    return new Promise((resolve, reject) => {

      let result = Wrapper.httpWrapAsync(url, headers)

      if(result) {
        // return result.data.data

        let user = result.data.data

        if(user && user[0]) {
          let su = user[0],
              u = su.User[0]

          let firstname = su.firstname,
              lastname = su.lastname,
              fullname = su.fullname,
              initial = su.initial,
              email = su.email,
              clientName = su.clientName,
              clientId = su.clientId,
              buName = su.buName,
              buId = su.buId,
              username = su.username,
              roleKey = su.roleKey,
              managerName = su.managerName,
              managerId = su.managerId,
              country = su.country,
              regionName = su.regionName,
              userGroup = su.userGroup,
              status = u.profile.status 

          Meteor.users.update(u._id, {
            $set: {
              emails: u.emails,
              services: u.services,
              username: username,
              // profile: { //-- This will reset profile data, including trainingModules...
              "profile.firstname": firstname, //-- so, we have to go this way...
              "profile.lastname": lastname,
              "profile.fullname": fullname,
              "profile.initial": initial,
              "profile.status": status,
              "profile.role": roleKey,
              "profile.clientName": clientName,
              "profile.clientId": clientId,
              "profile.buName": buName,
              "profile.buId": buId,
              "profile.managerName": managerName,
              "profile.managerId": managerId,
              "profile.country": country,
              "profile.regionName": regionName,
              "profile.userGroup": userGroup,
              // status: u.status,                  
              "profile.modifiedAt": new Date
            }
          }, (err, res) => {
            if(err) {
              resolve({success: false})
            } else {
              resolve({success: true, pwd: u.services.password})
            }
          })
          
        }

      }
    })

  } catch(e) {
      console.log( "Cannot get result data...", e )
  }
})

export const getAllClients = new Method('getAllClients', function() {
  
  try {    

    if(Meteor.isServer) {

      // import { CoreDB } from '/both/startup/config/db-config.js';

      let cLength = 0;

      let output = Meteor.wrapAsync((args, callback) => { 

        let _clients = Clients.find({ //-- Get simulations allotted
          status: 1
        }).fetch();    

        // console.log(_clients);

        if(_clients) {

          let clients = _clients;
          cLength = clients.length;
          let i = 0

          let newClients = []

          clients.forEach((c) => {
            i++                    

            Clients.upsert({
              _id: c._id
            }, {
              $set: {
                name: c.name,
                createdAt: c.createdAt,
                modifiedAt: c.modifiedAt,
                status: c.status,
                creator: c.creator,
                bus: c.bus,
                simulations: c.simulations,
                syncedAt: new Date
              }
            })         

            if(cLength === i) {
              // return _clients;
            }
          })
        }

        callback(null, {success: true, data: cLength})
      })

      let result = output('dk')

      if(result) {
        return result
      }

    }

  } catch(e) {
      console.log( "Cannot get result data...", e )
  }  
  
})

export const assignSimulation = new Method('assignSimulation', function(user) {
  this.unblock()
  
  try {
    if(Meteor.isServer) { //-- this seems to be critical for this: import { CoreDB } from '/server/config/db-config.js'

      check(user, {
        user_id: String,
        client_id: Match.Optional(Match.OneOf(undefined, null, String)),
        bu_id: Match.Optional(Match.OneOf(undefined, null, String)),
        module_id: String,
        email: String,
        manager_id: Match.Optional(Match.OneOf(undefined, null, String)),
        manager_name: Match.Optional(Match.OneOf(undefined, null, String)),
        moduleDuration: Match.Optional(Match.OneOf(undefined, null, String)),
        moduleName: Match.Optional(Match.OneOf(undefined, null, String)),
        fullname: Match.Optional(Match.OneOf(undefined, null, String)),
        ts: {
          mt: Number,
          mvt: Number
        }
      })

      // console.log(user);

      let 
        canGo = true,
        isTimeShort = false;

      //-- tentative logic to pick the correc NA or Global FUS (07/30/2019, dq)
      //-- otherwise, it can be NA FUS even though the user took Global baseline.
      let 
        _NAorGlobal = null, //-- tentative logic key to assign the correct NA or Global FUS
        _NAorGlobalQuery = '';

      if(!user.client_id || !user.bu_id) { //-- maybe the user is CRAA Admin user
        // canGo = false;
        let _sus = SimUsersSummary.findOne({
          userId: user.user_id
        });

        if(_sus) {
          user['client_id'] = _sus.clientId;
          user['bu_id'] = _sus.buId;
          // console.log(_sus);
          // console.log(user);          
        } else {
          canGo = false;
          callback(null, {success: false, data: -1});
        }
      }    

      let output = Meteor.wrapAsync((args, callback) => {  

        let 
          _trModCompletedAt = new Date(),
          // _trModCompletedAt = new Date('2017-11-21T20:54:47.287-0600'), //-- test sample: Munir
          _trModUserLog = TrainingModuleUserLogs.findOne({
            uid: user.user_id,
            mid: user.module_id,
            page: 1
          }),
          _trModUserLogs = TrainingModuleUserLogs.find({
            uid: user.user_id,
            mid: user.module_id,
            page: { $exists: true }
          },{
            sort: {
              cAt: 1
            }
          }).fetch(),          
          _trUserModStats = TrainingModuleUserStats.findOne({
            userId: user.user_id,
            moduleId: user.module_id,
            // short: true              
          });

        // console.log("TR Mod User Log => ", _trModUserLog);
        // console.log("TR Mod User Logs => ", _trModUserLogs);

        let 
          _logs = [],
          _logDiff = 0;

        if(_trModUserLogs.length > 0) {

          _trModUserLogs.forEach((t,i) => {
            _logs[i] = t;
            if(i > 0) {
              let _diff = Util.timeSpentDates(t.cAt, _logs[i-1].cAt);
              // console.log(_diff);
              if(_diff > 600) {
                _diff = 60;
              }
              
              _logDiff += _diff;
            }
          })

          _logDiff += 60; //-- for the last slide, just add 1 min as avg time of the last slides is 50 seconds or so
        }

        // console.log(_logDiff);
        if(_logDiff) {
          TrainingStatusSummary.update({
            userId: user.user_id,
            moduleId: user.module_id
          },{
              $set: {
                  // timer: {
                  //     t: _userData[mid].t || 0,
                  //     vt: _userData[mid].vt || 0,
                  //     page: _pData
                  // }
                  'timer.lt': _logDiff
                  // 'timer.vt': _userData[mid].vt || 0,
                  // 'timer.page': _pData
              }
          });
        }        

        if(_trModUserLog && _trModUserLog.cAt) {
          
          //-- new timer was added on 01/29/2021, so, whoever logged in after that date should go with the new timer
          //-- unless the new key timer_old is set to true for tr site          
          // let _dateDiff = ( (!_trUserModStats.timer_old || (_trUserModStats.timer_old && !_trUserModStats.timer_old.tr) ) && _trModUserLog.cAt >= new Date(2021, 0, 29) && user.ts.mt) || (_trModCompletedAt - _trModUserLog.cAt) / 1000          
          let _dateDiff = ( 
              (!_trUserModStats.timer_old || (_trUserModStats.timer_old && !_trUserModStats.timer_old.tr) ) && _trModUserLog.cAt >= new Date(2021, 0, 29) && user.ts.mt
            ) || _logDiff;         

          // console.log(user.ts.mt, _logDiff, _dateDiff)
          // console.log(_trModUserLog.cAt >= new Date(2021, 1, 29), _dateDiff);

          if((_logDiff-user.ts.mt) > 600) { //-- if log time is bigger than fb time by 10 minutes,
            _dateDiff = _logDiff; //-- use log time instead b/c fb timer prob. was broken and stopped working from sometime...
          }

          if(_dateDiff > 0 && user.moduleDuration) {
            
            let 
              _aModDur = user.moduleDuration.split(':'),
              _modDurSeconds = (+_aModDur[0]) * 60 * 60 + (+_aModDur[1]) * 60 + (+_aModDur[2])

            // if(_trUserModStats && _trUserModStats.short && _trUserModStats.shortTime) { //-- no needed any more
            //   // _modDurSeconds = _modDurSeconds + _trUserModStats.shortTime;
            //   _modDurSeconds = Math.abs(_trUserModStats.shortTime);
            // }

            if(user.ts.mt > 0) {
              //-- do nothing as this user is with the new timer
              // if((_logDiff-user.ts.mt) > 600) { //-- if log time is bigger than fb time by 10 minutes,
              // if((_logDiff-user.ts.mt) > 300) { //-- if log time is bigger than fb time by 5 minutes,
              //   _dateDiff = _logDiff; //-- use log time instead b/c fb timer prob. was broken and stopped working from sometime...
              // }
            } else {
              // if(_trUserModStats && _trUserModStats.short && _trUserModStats.shortTime) {
              //   // _modDurSeconds = _modDurSeconds + _trUserModStats.shortTime;
              //   _modDurSeconds = Math.abs(_trUserModStats.shortTime);
              // }
            }
                        
            let _timeDiff = _dateDiff - _modDurSeconds;

            // console.log("mt: ", user.ts.mt," logDiff: ", _logDiff," dateDiff: ", _dateDiff," shortime: ", _trUserModStats.shortTime," dur: ", _modDurSeconds," timeDiff: ", _timeDiff )
            // console.log(_trModCompletedAt, _trModUserLog.cAt, _dateDiff, _trUserModStats && _trUserModStats.shortTime, _modDurSeconds, _timeDiff)
            // console.log(user.user_id, _timeDiff)

            // if(_timeDiff && _timeDiff < -300) { //-- if it's even less than -5 minutes
            if(_timeDiff && _timeDiff < -300) { //-- if it's even less than -5 minutes
            // if(_timeDiff && _timeDiff < -600) { //-- if it's even less than -10 minutes              

              // if(!_trUserModStats.status || (_trUserModStats.status === 'Completed' && _trUserModStats.short)) {

                isTimeShort = true;

                let noteObj = {
                  userId: user.user_id,
                  author: null,
                  comment: "Short training time: " + user.moduleName + " (" + _timeDiff + ")",
                  privacy: 1,
                  createdAt: new Date
                }

                UserNotes.insert(noteObj);

                if(process.env.NODE_ENV === "production") {

                  if(user.user_id !== 'RhCKr4BuKdt3f3GTs') {
                    Email.send({
                      to: "help@craassessments.com",
                      from: "admin@craassessments.com",               
                      subject: "TR: Short training time",
                      html: user.fullname + "<br>" + user.email + "<br>" + user.moduleName + "<br>" + _timeDiff + " seconds"
                    }); 
                  }

                }              

                if(_timeDiff < -600) {
                  // console.log("_timeDiff < -600 => ", isTimeShort)
                  canGo = false //-- don't assign FUS

                  TrainingModuleUserStats.update({
                    userId: user.user_id,
                    moduleId: user.module_id  
                  }, {
                    $set: {
                      short: isTimeShort,
                      shortTime: _timeDiff,
                      // status: "Completed"
                    }
                  });

                  callback(null, {success: false, data: -1, short: isTimeShort, key: 0})
                }

              // } //-- if(!_trUserModStats.status || (_trUserModStats.status === 'Completed' && _trUserModStats.short)) {
            }            
          }

        } //-- if(_trModUserLog && _trModUserLog.cAt) {

        // console.log("CanGo => ", canGo)
        // console.log("mt: ", user.ts.mt," logDiff: ", _logDiff," dateDiff: ", _dateDiff," shortime: ", _trUserModStats.shortTime," dur: ", _modDurSeconds," timeDiff: ", _timeDiff )

        if(canGo) {
          let _duration = '04:00:00'

          // import { CoreDB } from '/both/startup/config/db-config.js';

          let _client = Clients.findOne({ //-- Get simulations allotted
            _id: user.client_id
          })

          let _sims = [];

          //-- Added for AstraZeneca case as their sims don't have 
          //-- 'NA' or 'Global' name tag (06/24/2023)          
          let _clientBaselineSimIds = [];
          let _clientFUSimIds = [];

          if(_client) {
            if(_client.bus) {
              _client.bus.forEach((b) => {
                if(b._id === user.bu_id) {
                  if(b.simulations) {
                    b.simulations.forEach((s) => {
                      let _key = 's'+s.id
                      s.duration = _duration
                      if(user.manager_id) {
                        s.subadmin = {
                          id: user.manager_id,
                          name: user.manager_name
                        }
                      }
                      _sims[_key] = s;

                      //-- Added for AstraZeneca case as their sims don't have 
                      //-- 'NA' or 'Global' name tag (06/24/2023)                      
                      if(s.name.includes("Baseline")) {
                        _clientBaselineSimIds.push(s.id);                      
                      }
                      else if(s.name.includes("Followup")) {
                        _clientFUSimIds.push(s.id);                      
                      }

                    })
                  }
                }
              })
            }
          } else {
            callback(null, {success: false, data: 0})
          }

          // console.log(_sims)

          let _simSettings = SimulationSettings.find({ //-- Get required Training Modules for this user
            bu_id: user.bu_id,
            training_modules: {$exists: true}
          }).fetch()

          // console.log("_simSettings 0 => ", _simSettings)

          if(_simSettings && _simSettings.length > 0) {

            let simToAssign = 0

            //-- tentative logic to pick the correc NA or Global FUS (07/30/2019, dq)
            //-- Get the Baseline sim this trainee took, so that we can map the correct 
            //-- FUS, otherwise, it can be NA FUS even though the user took Global baseline.
            let _baselineTook = SimUsersSummary.findOne({
              userId: user.user_id,
              clientId: user.client_id,
              buId: user.bu_id,
              simulationName: { $regex: /Baseline/ },
              simStatus: 'Completed'
            },{
              sort: {
                publishedAt: -1, distributedAt: -1
              }
            });
// console.log("Baseline => ", _baselineTook)
            if(_baselineTook) {
              _NAorGlobal = _baselineTook.simulationName.includes("Global") ? "Global" : null;
              _NAorGlobal = _baselineTook.simulationName.includes("NA") ? "NA" : null;
              // _NAorGlobalQuery = '/'+_NAorGlobal+'/';
              _NAorGlobalQuery = 'Followup.*'+_NAorGlobal;
            }

            //-- tentative logic to pick the correc NA or Global FUS (07/30/2019, dq)
            //-- Collect FU sims based on the baseline sim this trainee took
            let _fusSims = Simulations.find({
              status: 1,
              // name: { $regex: /Followup/ },
              // name: { $regex: _NAorGlobalQuery }
              // name: new RegExp(_NAorGlobal)
              name: new RegExp(_NAorGlobalQuery) //-- this one works for dyanmic Regex value
              // $and: [

              // ]
            }).fetch(),
            _fusSimsDict = [];

            // Added for Pfizer's taking the new v3 sims (08/04/2023)
            if(_baselineTook && _baselineTook.aType) {
              if(_baselineTook.aType.followupSimulations) {
                const _aTypeFuSimIds = _baselineTook.aType.followupSimulations.map(Number);

                _fusSims = Simulations.find({
                  id: { $in: _aTypeFuSimIds },
                  status: 1
                }).fetch();                
              }
            }

            //-- Added for AstraZeneca case as their sims don't have 
            //-- 'NA' or 'Global' name tag (06/24/2023)
            if(_fusSims.length === 0) {
              _fusSims = Simulations.find({
                status: 1,
                id: { $in: _clientFUSimIds }
              }).fetch();
            }
            // console.log(_clientFUSimIds, _fusSims);
            if(_fusSims && _fusSims.length > 0) {
              _fusSims.map((f) => {
                if(!_fusSimsDict['f'+f.id]) {
                  _fusSimsDict['f'+f.id] = f.name;
                }
              })
            }
// console.log(_baselineTook.aType)
// console.log(_fusSims)
            _simSettings.forEach((s) => {
              if(s.training_modules) {
                s.training_modules.forEach((t) => {
                  if(t === user.module_id) {
                    
                    let __sid = s.simulation_id;
                    // console.log("_simSettings => ",__sid, _fusSimsDict);
                    //-- tentative logic to pick the correc NA or Global FUS (07/30/2019, dq)
                    //-- otherwise, NA FUS can be assigned even though the trainee took a Global baseline (eg. Covance Thais case)
                    if(_fusSimsDict['f'+__sid] && _fusSimsDict['f'+__sid].includes(_NAorGlobal)) {
                      simToAssign = parseInt(s.simulation_id) //-- The simulation to assign
                    }
                    //-- Added for AstraZeneca case as their sims don't have 
                    //-- 'NA' or 'Global' name tag (06/24/2023)                     
                    else if(_fusSimsDict['f'+__sid]) {
                      simToAssign = parseInt(s.simulation_id);
                    }
                  }
                })
              }
            })
    // console.log("simToAssign => ", simToAssign)

  
  // console.log(isTimeShort);
  
  TrainingModuleUserStats.update({
    userId: user.user_id,
    moduleId: user.module_id  
  }, {
    $set: {
      short: isTimeShort,
      status: "Completed"
    }
  });

            if(simToAssign > 0) { //-- proceed only when the simulation to assign is identified

              let _hasSus = SimUsersSummary.findOne({
                userId: user.user_id,
                clientId: user.client_id,
                buId: user.bu_id,
                simulationId: simToAssign,
                // checked: true
                trainingQuiz: { $exists: true }
              });
  // console.log(_hasSus)
              if(_hasSus) { //-- when already sim is assigned, do nothing
                callback(null, {success: true, data: 1})              
              } else {

                let _trUser = Meteor.users.findOne({_id: user.user_id})

                // console.log("profile => ", _trUser.profile)

                let 
                  arrClients = [],
                  arrBus =  [],
                  arrSimulations =  [];

                // if(_trUser) { //-- this may overwrite/reset the sim's data if its training module is re-viewed
                //-- so, for safety's sake, proceed only when there's no in-progress sim at the moment          
                // if(_trUser && !_trUser.profile.currentSim) {   

                if(_trUser) { //-- switched back to this with _hasSus above to avoid any issue with sim assignment
                  //-- when the trainee does this while taking a FUS sim

                  if(_trUser.profile && _trUser.profile.clients) {
                    _trUser.profile.clients.forEach((c) => {
                      if(c._id === user.client_id) {
                        if(c.bus) {
                          c.bus.forEach((b) => {
                            if(b._id === user.bu_id) {
                              if(b.simulations) {
                                // let _has = false
                                // b.simulations.forEach((s) => {
                                //   if(s.id === simToAssign) { //-- if the sim to assign exists
                                //     s.checked = true
                                //     s.duration = _duration
                                //     _has = true
                                //   }
                                //   arrSimulations.push(s)
                                // })
        
        
                                // if(!_has) { //-- if the sim to assign doesn't exist
                                //   arrSimulations.push(_sims['s'+simToAssign]) //-- add the one from 'Clients' 
                                //   // console.log(_sims['s'+simToAssign])
                                // }
                                  let _sus = SimUsersSummary.findOne({
                                    userId: user.user_id,
                                    clientId: user.client_id,
                                    buId: user.bu_id,
                                    // $or: [ //-- pick the Baseline sim for this user as a data template (eg. to keep userGroup piece)
                                    //   { simulationId: 9 },
                                    //   { simulationId: 10 },                                  
                                    //   { simulationId: 15 },
                                    //   { simulationId: 19 },
                                    //   { simulationId: 23 },
                                    //   { simulationId: 24 },
                                    //   { simulationId: 29 },
                                    //   { simulationId: 30 },
                                    //   { simulationId: 31 }
                                    // ]
                                    simulationName: { $regex: /^Baseline/ }
                                    // training: {$exists: true} //-- this means it's a Baseline sim
                                  })
      // console.log("SUS => ", _sus)

                                  // if(_sus) { //-- moved to down there, see the comments there (05/31/2019)

let _qzScores = TrainingModuleScores.find({
  userId: user.user_id,
  moduleId: user.module_id
}).fetch()

let 
  _qzScoreObj = {
    moduleId: user.module_id,
    total: 0,
    correct: 0,
    wrong: 0,
    percent: 0
  }

if(_qzScores.length > 0) {
  _qzScores.forEach((q) => {
    if(q.feedback) {
      if(q.feedback === 'correct') {
        _qzScoreObj.correct++
      } else {
        _qzScoreObj.wrong++
      }

      // _qzScoreObj.total++
    }
  })
  _qzScoreObj.total = _qzScoreObj.correct + _qzScoreObj.wrong

  if(_qzScoreObj.total > 0) {
    _qzScoreObj.percent = Math.round(_qzScoreObj.correct/_qzScoreObj.total *100)
  }

// console.log(_qzScoreObj)

  TrainingModuleScoreSummary.upsert({
    userId: user.user_id,
    moduleId: user.module_id
  }, {
    $setOnInsert: {
      createdAt: new Date
    },
    $set: {
      correct: _qzScoreObj.correct,
      wrong: _qzScoreObj.wrong,
      total: _qzScoreObj.total,
      percent: _qzScoreObj.percent,
      modifiedAt: new Date,
      short: isTimeShort
    }
  })  
}

// console.log(isTimeShort);

// TrainingModuleUserStats.update({
//   userId: user.user_id,
//   moduleId: user.module_id  
// }, {
//   $set: {
//     short: isTimeShort
//   }
// });
                                  //-- moved to this spot from above to create Score Summary when being completed (05/31/2019 16:57:37)
                                  //-- so that Admin UserCard can show TR Quiz Scores as soon as TR Module is done even though no FUS is assigned...
                                  if(_sus) {
// console.log(_qzScoreObj)
TrainingStatusSummary.update({
    userId: user.user_id,
    moduleId: user.module_id
}, {
    $set: {
      "progress.percent": 100,
      score: {
        correct: _qzScoreObj.correct,
        total: _qzScoreObj.total,
        percent: _qzScoreObj.percent
      },
      // trainingStatus: "Completed", //-- change the status to "Started"
      trainingStatus: "Completed", //-- change the status to "Started"
      modifiedAt: new Date,
      oCompletedAt: new Date
    },
    $push: { completedAt: new Date }                                                    
});


let _fusChecked = true

//-- Removing this condition upon Chris' request (12282018, dq, see email messages regarding Terri Lucas case)
if(user && user.client_id === '2TuJmaiD7LbrxupGi') { //-- DCRI, FUS will be manually assigned. (re-uncommented upon Chris' request on 02/27/2019)
  _fusChecked = false //-- FUS will be assigned manually later, but, we want to show TR Quiz scores inside UserCard
}

                                    // CoreDB.mongo.insert('sim_users_summary', _susObj) //-- Forcefully insert new sim to SimUsersSummary 
                                    let _upsertSetOnInsert = {
                                      _id: ObjectID(),                                    
                                      userId: user.user_id,
                                      clientId: user.client_id,
                                      buId: user.bu_id,
                                      simulationId: simToAssign,
                                      username: _sus.username,
                                      clientName: _sus.clientName,
                                      buName: _sus.buName,                                    
                                      accountCreatedAt: _sus.accountCreatedAt,
                                      lastLogin: _sus.lastLogin,                                    
                                      simStatus: 'Assigned',
                                      adjudicatorId: _sus.adjudicatorId,
                                      adjudicatorName: _sus.adjudicatorName,
                                      status: 'Active.',
                                      checked: _fusChecked,
                                      lastname: _sus.lastname,
                                      firstname: _sus.firstname,
                                      fullname: _sus.fullname,
                                      email: _sus.email,
                                      initial: _sus.initial,
                                      roleKey: _sus.roleKey,
                                      roleName: _sus.roleName,
                                      userGroup: _sus.userGroup,
                                      emailVerifiedAt: _sus.emailVerifiedAt,                                    
                                      managerId: _sus.managerId,
                                      managerName: _sus.managerName,
                                      duration: _duration,                                    
                                      country: _sus.country,
                                      code: _sus.code,
                                      regionId: _sus.regionId,
                                      regionName: _sus.regionName,
                                      clientIdNum: _sus.clientIdNum,
                                      createdAt: new Date()
                                    };

                                    let _upsertSet = {
                                      simulationName: _sims['s'+simToAssign].name,
                                      trainingQuiz: _qzScoreObj                                  
                                    }                                    

                                    SimUsersSummary.upsert({
                                      userId: user.user_id,
                                      clientId: user.client_id,
                                      buId: user.bu_id,
                                      simulationId: simToAssign
                                    }, 
                                    {
                                      $setOnInsert: _upsertSetOnInsert,
                                      $set: _upsertSet
                                    })
                                    
                                    let 
                                      _pfizer = Util.isPfizer(user.client_id),
                                      _abbvie = Util.isAbbvie(user.client_id),
                                      _greenLight = Util.isGreenLight(user.client_id),
                                      _beigene = Util.isBeigene(user.client_id),
                                      _syneos = Util.isSyneos(user.client_id),
                                      _kps = Util.isKPS(user.client_id),
                                      _az = Util.isAstraZeneca(user.client_id);

                                    if(_pfizer) {
                                      SimUsersSummaryPfizer.upsert({
                                        userId: user.user_id,
                                        clientId: user.client_id,
                                        buId: user.bu_id,
                                        simulationId: simToAssign
                                      }, 
                                      {
                                        $setOnInsert: _upsertSetOnInsert,
                                        $set: _upsertSet
                                      })                                      
                                    }
                                    else if(_abbvie) {
                                      SimUsersSummaryAbbvie.upsert({
                                        userId: user.user_id,
                                        clientId: user.client_id,
                                        buId: user.bu_id,
                                        simulationId: simToAssign
                                      }, 
                                      {
                                        $setOnInsert: _upsertSetOnInsert,
                                        $set: _upsertSet
                                      })                                      
                                    }
                                    else if(_greenLight) {
                                      SimUsersSummaryGreenLight.upsert({
                                        userId: user.user_id,
                                        clientId: user.client_id,
                                        buId: user.bu_id,
                                        simulationId: simToAssign
                                      }, 
                                      {
                                        $setOnInsert: _upsertSetOnInsert,
                                        $set: _upsertSet
                                      })                                      
                                    }
                                    else if(_beigene) {
                                      SimUsersSummaryBeigene.upsert({
                                        userId: user.user_id,
                                        clientId: user.client_id,
                                        buId: user.bu_id,
                                        simulationId: simToAssign
                                      }, 
                                      {
                                        $setOnInsert: _upsertSetOnInsert,
                                        $set: _upsertSet
                                      })                                      
                                    }
                                    else if(_syneos) {
                                      SimUsersSummarySyneos.upsert({
                                        userId: user.user_id,
                                        clientId: user.client_id,
                                        buId: user.bu_id,
                                        simulationId: simToAssign
                                      }, 
                                      {
                                        $setOnInsert: _upsertSetOnInsert,
                                        $set: _upsertSet
                                      })                                      
                                    }
                                    else if(_kps) {
                                      SimUsersSummaryKPS.upsert({
                                        userId: user.user_id,
                                        clientId: user.client_id,
                                        buId: user.bu_id,
                                        simulationId: simToAssign
                                      }, 
                                      {
                                        $setOnInsert: _upsertSetOnInsert,
                                        $set: _upsertSet
                                      })                                      
                                    }
                                    else if(_az) {
                                      SimUsersSummaryAstraZeneca.upsert({
                                        userId: user.user_id,
                                        clientId: user.client_id,
                                        buId: user.bu_id,
                                        simulationId: simToAssign
                                      }, 
                                      {
                                        $setOnInsert: _upsertSetOnInsert,
                                        $set: _upsertSet
                                      })                                      
                                    }
                                    


                                    //-- Removing this condition upon Chris' request (12282018, dq, see email messages regarding Terri Lucas case)
                                    if(user.client_id !== '2TuJmaiD7LbrxupGi') { //-- DCRI, FUS will be manually assigned. (re-uncommented upon Chris' request on 02/27/2019)

                                       SimulationUsersStatus.insert({
                                          userId: user.user_id,
                                          clientId: user.client_id,
                                          buId: user.bu_id,
                                          simulationId: parseInt(simToAssign),
                                          asmtId: null,
                                          status: 'Assigned',
                                          checked: true,
                                          statusAt: new Date
                                        })                                    

                                      // } //-- if(user.client_id !== '2TuJmaiD7LbrxupGi') { //-- DCRI
// console.log(_fusChecked)
                                        let _has = false

                                        //-- user's current simulations data
                                        b.simulations.forEach((s) => { 
  
                                          if(s.id === simToAssign) { //-- if the sim to assign already exists in the user's sim data
                                            // console.log(s, _sus)

                                            //-- if DCRI, initially false, but, when it's assigned later, it should 
                                            //-- keep it, otherwise, we can just assume this FUS was assigned 
                                            //-- (this can be an issue for non-DCRI users in case this FUS is unassigned later...
                                            //-- ah, it's ok b/c nothing'll be done if the user's sim summary has this FUS)

                                            // let __checked = _fusChecked === false ? s.checked : true //-- no need ...
                                            // s.checked = true
                                            // s.checked = __checked
                                            s.checked = _fusChecked //-- if DCRI, then false, otherwise, it's true
                                            s.duration = _duration
                                            s.userGroup = _sus.userGroup || null
                                            if(_sus.managerId && _sus.managerName) {
                                              s.subadmin = {
                                                id: _sus.managerId,
                                                name: _sus.managerName
                                              }
                                            }
                                            _has = true
                                          }

                                          arrSimulations.push(s)
                                        })
                
                                        if(!_has) { //-- if the sim to assign doesn't exist in the user's sim data
                                          _sims['s'+simToAssign]['userGroup'] = _sus.userGroup || null

                                          _sims['s'+simToAssign]['checked'] = _fusChecked //-- DCRI should be false

                                          arrSimulations.push(_sims['s'+simToAssign]) //-- add the one from 'Clients' 
                                          // console.log(_sims['s'+simToAssign])
                                        }

                                    } //-- if(user.client_id !== '2TuJmaiD7LbrxupGi') { //-- DCRI

                                  } //-- if(_sus) {
      // console.log("aaa")
                              
                              // } else { //-- if something's wrong? just add the sim 
                              //   arrSimulations.push(_sims['s'+simToAssign]) //-- add the one from 'Clients' 
                              //   // console.log("2 => ", _sims['s'+simToAssign])                        
                              // }                            
                              } //-- if(b.simulations) {

                              b.simulations = arrSimulations                          

                            } //-- if(b._id === user.bu_id) {

                            arrBus.push(b)  
                                             
                          }) //-- c.bus.forEach((b) => {
                          c.bus = arrBus
                        } //-- if(c.bus) {
                        arrClients.push(c)
                      } //-- if(c._id === user.client_id) {
                    }) //-- _trUser.profile.clients.forEach((c) => {

                    // console.log(arrClients)

                  } //-- if(_trUser.profile && _trUser.profile.clients) {
                  else {
                    callback(null, {success: false, data: simToAssign, short: isTimeShort, key: 1})
                  }

                  if(arrClients.length > 0) {
                    Meteor.users.update({
                      _id: user.user_id
                    }, {
                      $set: {
                        'profile.clients': arrClients
                      }
                    }, (err, res) => {
                      // console.log(err, res)
                      if(err) {
                        callback(null, {success: false, data: simToAssign, short: isTimeShort})
                      } else {

                        let 
                          _myEmail = Meteor.user().emails[0].address,
                          _noti = EmailTemplates.findOne({
                            bu_id: user.bu_id,
                            simulation_id: simToAssign.toString(),
                            status: 2
                          })
      // console.log(_myEmail, user.bu_id, simToAssign.toString(), _noti)
                        if(_myEmail && _noti) {                    

                          let
                            to = _myEmail,
                            from = _noti.email_from,
                            subject = _noti.email_subject,
                            body = _noti.email_body
      // console.log(to, from, subject, body)
                          if(process.env.NODE_ENV === "production") {

                            if(user.client_id !== '2TuJmaiD7LbrxupGi') { //-- DCRI, FUS will be manually assigned. (re-uncommented upon Chris' request on 02/27/2019)

                              Email.send({
                                to: to,
                                from: from,
                                // replyTo: from,
                                subject: subject,
                                html: body
                              });
                            
                            }                            
                          }

                        }

                        callback(null, {success: true, data: res, short: isTimeShort, key: 2})
                      }
                    })  
                  } else {
                    callback(null, {success: false, data: simToAssign, short: isTimeShort, key: 3})
                  }

                } //-- if(_trUser) {
                else {            
                  callback(null, {success: false, data: simToAssign, current: _trUser.profile.currentSim, short: isTimeShort, key: 4})
                }
              } //-- if(_hasSus) {} else {
            } //-- if(simToAssign > 0) {
            else {

              if(process.env.NODE_ENV === "production") {
                
                  Email.send({
                    to: "david.kim@craassessments.com",
                    from: "admin@craassessments.com",
                    // replyTo: from,
                    subject: "TR: No Sim To Assign",
                    html: user.fullname + "<br>" + user.email + "<br>" + user.moduleName
                  });
              }

              // callback(null, {success: false, data: 0})          
              //-- -1: since no follow-up sim is assigned to this client/user, just show the completion modal and let the user go
              callback(null, {success: false, data: -1, short: isTimeShort, key: 5})           
            }

          } //-- if(_simSettings && _simSettings.length > 0) {
          else {
            if(process.env.NODE_ENV === "production") {
              
                Email.send({
                  to: "david.kim@craassessments.com",
                  from: "admin@craassessments.com",
                  // replyTo: from,
                  subject: "TR: No Sim Settings Exists",
                  html: user.fullname + "<br>" + user.email + "<br>" + user.moduleName
                });
            }
            //-- -1: since no sim settings done for this client/user, just show the completion modal and let the user go
            callback(null, {success: false, data: -1, short: isTimeShort, key: 6}) 
          }

          // callback(null, {success: true})
        } //-- if(canGo) 
      }) //-- let output = Meteor.wrapAsync((args, callback) => {          

      let result = output('dk')

      if(result) {
        return result
      }
    }//-- if(Meteor.isServer) 
  } catch(e) {
      console.log( "Cannot get result data...", e )
  }  
})

export const updateUserStatus = new Method('updateUserStatus', function(user) {
  check(user, {
    uid: String,
    status: Number
  })
  this.unblock()
  
  try {
    if(Meteor.isServer) {

      let output = Meteor.wrapAsync((args, callback) => {  

        let _$set = {
          'profile.status': user.status
        }

        let statusMsg = "activated."

        if(user.status === 2) {
          _$set['services.resume.loginTokens'] = []
          _$set['profile.online'] = false
          statusMsg = "deactivated."
        }

        let updated = Meteor.users.update(user.uid, {
          $set: _$set
        })

        let noteObj = {
          userId: user.uid,
          author: Meteor.userId(),
          comment: "This trainee has been " + statusMsg,
          privacy: 1,
          createdAt: new Date
        }

        UserNotes.insert(noteObj)              

        if(updated) {

          callback(null, {success: true}) 
        } else {
          callback(null, {success: false}) 
        }
      })

      let result = output('dk')

      if(result) {
        return result
      }

    }
  } catch(e) {
      console.log( "Cannot get result data...", e )
  }
})

export const usersOnline = new Method('usersOnline', function() {
  this.unblock()
  
  try {
    if(Meteor.isServer) {

      let output = Meteor.wrapAsync((args, callback) => {

        let users = Meteor.users.find({
          _id: {$ne: Meteor.userId()},
          'profile.role': {$ne: '1'},
          'profile.online': true,
          "profile.status": 1,  
          // heartbeat: {$exists: true}
        }, {
          sort: {
            'profile.role': 1
          }
        }).fetch()

        let 
          oUsers = [],
          roleNames = [null, null, null, null, 'CA', 'CS', 'A', 'S']

        if(users && users.length > 0) {
          users.forEach(u => {
            if(!u.heartbeat) {          
              Meteor.users.update(u._id, {
                $set: {'profile.online': false}
              })
            } else {
              let myRole = parseInt(u.profile.role)
    
              let uObj = {
                fullname: u.profile.fullname,
                role: myRole,
                roleName: roleNames[myRole],
                lastBeat: u.heartbeat,
                idle: u.profile.idle,
                client: u.profile.clientName || ''
              }

              oUsers.push(uObj)
            }
          })

          callback(null, {success: true, data: oUsers}) 
        } else {
          callback(null, {success: true, data: []}) 
        }
                
      })

      let result = output('dk')

      if(result) {
        return result
      }

    }
  } catch(e) {
      console.log( "Cannot get result data...", e )
  }
})

export const usersProfileOnlineUpdate = new Method('Users.profile.online.update', function(obj) {
  check(obj, {
      uid: String,
      status: Boolean           
  });  
  this.unblock()
  
  try {
    if(Meteor.isServer) {

      let _updated = Meteor.users.update({
        _id: obj.uid           
      }, {
        $set: {
          'profile.online': obj.status
        }
      });

      return _updated;
    }
  } catch(e) {
      console.log( "Cannot get result data...", e )
  }
})

export const usersProfileViewedTutorialUpdate = new Method('Users.profile.viewedTutorial.update', function(obj) {
  check(obj, {
      uid: String,
      status: Boolean           
  });  
  this.unblock()
  
  try {
    if(Meteor.isServer) {

      let _updated = Meteor.users.update({
        _id: obj.uid           
      }, {
        $set: {
          'profile.viewedTutorial': obj.status
        }
      });

      return _updated;
    }
  } catch(e) {
      console.log( "Cannot get result data...", e )
  }
})

function diffDates(date1, date2) {
  // get total seconds between the times
  let delta = Math.abs(date2 - date1) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  let _days = days < 10 ? '0'+days : days

  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  let _hours = hours < 10 ? '0'+hours : hours

  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;
  let _mins = minutes < 10 ? '0'+minutes : minutes

  delta -= minutes * 60;

  // what's left is seconds
  let seconds =  Math.floor(delta % 60); 
  let _seconds = seconds < 10 ? '0'+seconds : seconds
// console.log(date1, date2)
  // var date = new Date(null);
  // date.setSeconds(seconds); // specify value for SECONDS here
  // // return date.toISOString().substr(11, 8);
  // return date.toISOString();

  // return days + ' ' + hours + ' ' + minutes + ' ' + seconds
  return _days + ':' + _hours + ':' + _mins + ':' + _seconds

  // return toHHMMSS(seconds)
}



