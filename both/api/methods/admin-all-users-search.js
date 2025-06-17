/**
 * Admin All Users Search methods
 */
import { Meteor } from 'meteor/meteor'

import { Accounts } from 'meteor/accounts-base'

import { Promise } from 'meteor/promise'

import moment from 'moment'

import { Clients } from '/both/api/collections/clients.js'
import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModuleUserLogs } from '/both/api/collections/training-module-user-logs.js'
import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'

import { s3Config } from '/both/startup/config/s3-config.js'
import { Wrapper } from '/imports/api/lib/wrappers.js'

import { Method } from '/imports/api/lib/method.js'

if(Meteor.isServer) {
import { Util } from '/imports/api/lib/server/util.js'
}
// const apiURL = APIConfig[process.env.NODE_ENV].apiURL
// let headers = {
//     'X-Auth-Token': APIConfig.XAuthToken,
//     'X-User-Id': APIConfig.XUserId
// }

// export const exportUsersSearchResult0 = new Method('exportUsersSearchResult0', function(query) {  
//   try {

//     check(query, Object)
// // console.log(query)
//     let myUid = Meteor.userId()

//     if(Meteor.isServer) {

//       let queryObj = query.init

//       // if(query.clients && query.clients.length > 0) {
//       //   queryObj['profile.clientName'] = {$in: query.clients}
//       // }

//       // if(query.bus && query.bus.length > 0) {
//       //   queryObj['profile.buName'] = {$in: query.bus}
//       // }

//       // let resultData = Meteor.users.find(queryObj, {
//       //   sort: {
//       //     clientName: 1, buName: 1, lastname: 1, firstname: 1
//       //   }
//       // }).fetch();

//       let resultData = Meteor.users.aggregate({
//         $match: queryObj
//       },
//       {
//         $lookup: {
//           from: "training_module_user_stats",
//           localField: "_id",
//           foreignField: "userId",
//           as: "modules"          
//         }
//       }, 
//       {
//         sort: {
//           clientName: 1, buName: 1, lastname: 1, firstname: 1
//         }
//       }).fetch();

// // console.log(resultData)
//       let sp = ",", nl = "\n"

//       let dataText = "Client,BU,Group,Last Name,First Name,Email,Manager Name,Country,Region,Simulation,"
//           dataText += "Training Module,Progress,Last Login,Completed Date" + nl

//       let Knox = Npm.require('knox')

//       let client = Knox.createClient({
//         key: s3Config.accessKeyId,
//         secret: s3Config.secretAccessKey,
//         bucket: s3Config.bucket
//       })     

//       let filename = "/files/"

//       return new Promise(function(resolve, reject) {

//         let dataText = 'testing...'

//         // let requestSync = Meteor.wrapAsync(function(dataText, callback) {
          
//           let headers = {
//               // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//               'Content-Type': 'text/plain',
//               'Content-Length': dataText.length,
//               'x-amz-acl': 'public-read'
//           }

//           filename += "CRAATraining_Status_" + dateFormatNRaw(new Date) + ".csv"

//           // let req = client.putBuffer(dataText, filename, headers, (err, res) => {
//           //   console.log(err, res)
//           //   // if(err) {return false} else {return filename}            
//           //   resolve(filename)
//           // })
//           // return filename
//           // callback(filename)
//         // })

//         // let result = requestSync(dataText)
//         // console.log(result)
//         // if(result) {
//           resolve(filename)
//         // }
//       })
//     }
//   } catch(e) {
//       console.log( "Cannot get result data...", e )
//   }
// })

export const exportUsersSearchResult1 = new Method('exportUsersSearchResult1', function(query) {  

  try {
    check(query, Object);
    console.log(query)
    if(Meteor.isServer) {

      let output = Meteor.wrapAsync((args, callback) => {

        let pipelineUsers = 
        [
          {
            $match: query.init
          },
          {
            $lookup: {
              from: 'training_module_user_stats',
              localField: '_id',
              foreignField: 'userId',
              as: 'stats'
            }
          },
          {
            $unwind: '$stats'
          },
          {
            $group: {
              _id: "_id",

            }
          }
        ]

        let result = Promise.await(Meteor.users.rawCollection().aggregate(pipelineUsers).toArray());

        if(result) {
          console.log(result)
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

export const exportUsersSearchResult = new Method('exportUsersSearchResult', function(query) {  
  try {

    check(query, Object)
// console.log(query)
    let myUid = Meteor.userId()

    if(Meteor.isServer) {

      let queryObj = query.init

      // if(query.clients && query.clients.length > 0) {
      //   queryObj['profile.clientName'] = {$in: query.clients}
      // }

      // if(query.bus && query.bus.length > 0) {
      //   queryObj['profile.buName'] = {$in: query.bus}
      // }
// console.log(query, queryObj)
      let _trModules = TrainingModules.find({
        status: 1
      }).fetch()

      let trModules = []

      if(_trModules && _trModules.length > 0) {
        _trModules.forEach((m) => {
          if(m) {
            let 
              _mName = m.name.split(',').join(''),
              _mPages = m.numPages;

            // trModules[m._id] = _mName
            trModules[m._id] = {
              name: _mName,
              pages: parseInt(_mPages),
              duration: m.duration
            }
          }
        })
      }

      let 
        _trUserStats = TrainingModuleUserStats.find().fetch(),
        _userStats = [];

      if(_trUserStats && _trUserStats.length > 0) {
        _trUserStats.forEach((s) => {
          if(s.pages) {          
            if(!_userStats[s.userId]) {
              _userStats[s.userId] = [];
            }
            if(!_userStats[s.userId][s.moduleId]) {
              _userStats[s.userId][s.moduleId] = s;
            } 
            // _userStats[s.userId].push(s);
          }         
        })
      }

      let resultData = Meteor.users.find(queryObj, {
        sort: {
          clientName: 1, buName: 1, lastname: 1, firstname: 1
        }
      }).fetch();

      // let resultData = Meteor.users.aggregate({
      //   $match: queryObj
      // },
      // {
      //   $lookup: {
      //     from: "training_module_user_stats",
      //     localField: "_id",
      //     foreignField: "userId",
      //     as: "modules"          
      //   }
      // }, 
      // {
      //   sort: {
      //     clientName: 1, buName: 1, lastname: 1, firstname: 1
      //   }
      // }).fetch();

// console.log(resultData)
      let sp = ",", nl = "\n"

      let _roles = [
        '',
        '',
        'Admin',
        'Sub Admin',
        'Client Admin',
        'Client SubAdmin',
        'Assessee',
        'Scorer'
      ]

      let dataText = "Client,BU,Group,Last Name,First Name,Email,Role,Manager Name,Country,Region,"
          dataText += "Training Module,Progress,Last Login,Completed Date,Completed Date2,Time,Expected Time, Over/under time" + nl

      if(resultData && resultData.length > 0) {
        resultData.forEach((u) => {

          let
            p = u.profile,
            email = u.emails && u.emails[0] && u.emails[0].address || '',
            lastLogin = p.lastLogin && dateFormatN(p.lastLogin) || '',
            // regionName = p.regionName || '',
            // regionName = (p.regionName && p.clientName === 'PRAHS' && p.buName === 'EAPA') ? p.regionName : '',
            userGroup = p.userGroup || '',
            regionName = p.regionName || '',
            uModules = p.trainingModules,          
            uModuleProgress = p.moduleProgress,
            managerName = p.managerName || '',
            userRole = p.role || 0,
            time = '';                            

          let myRole = _roles[userRole]
// console.log(uModuleProgress)
          if(uModules && uModules.length > 0) {
            uModules.forEach((um) => {
              if(um && trModules[um]) {
                let 
                  trModuleName = trModules[um].name,
                  trModulePages = trModules[um].pages,
                  // trModuleDuration = trModules[um].duration ? '00:'+trModules[um].duration : '',
                  trModuleDuration = trModules[um].duration || '',
                  trProgress = '0%',
                  completedDate = '',
                  completedDateRaw = null,
                  completedDate2 = '',
                  completedDateRaw2 = null,                  
                  underOverTime = '';

                // if(uModuleProgress && uModuleProgress.length > 0) {
                if(_userStats[u._id] && _userStats[u._id][um]) {
                  let 
                    _uStats = _userStats[u._id][um],
                    _statPages = (_uStats.pages.length -1) || 0;

                  time = '' //-- reset for each module, otheriwse it might get the same time value for all modules

                  // uModuleProgress.forEach((ump) => {
                    // if(ump.moduleId === um) {
                      let _percent = 0
                      if(_statPages === trModulePages) {
                        
                        // trProgress = ump.progressPercent+'%' || '0%'
                        _percent = 100;
                        trProgress = '100%';

                      } else {

                        _percent = Math.round(_statPages/trModulePages*100)                        

                        trProgress = _percent+'%' || '0%'
                        
                        Meteor.users.update({
                          _id: u._id,
                          // 'profile.moduleProgress.moduleId': ump.moduleId
                          'profile.moduleProgress.moduleId': um
                        }, {
                          $set: {
                            'profile.moduleProgress.$.modulePages': trModulePages,
                            'profile.moduleProgress.$.progressPercent': _percent
                          }
                        })
                      }
                      // completedDate = ump.completedAt && dateFormatN(ump.completedAt[ump.completedAt.length-1]) || ''                     
                      // if(ump.progressPercent === 100) {
                      if(_percent === 100) {
                        // completedDateRaw = ump.completedAt[0]
                        completedDateRaw = _uStats.completedAt[0]
                        // completedDate = ump.completedAt && dateFormatN(ump.completedAt[0]) || ''
                        completedDate = _uStats.completedAt && dateFormatN(_uStats.completedAt[0]) || ''

                        if(_uStats.completedAt.length > 1) {
                          let _lenIdx = _uStats.completedAt.length -1;
                          completedDateRaw2 = _uStats.completedAt[_lenIdx];
                          completedDate2 = dateFormatN(_uStats.completedAt[_lenIdx]) || ''
                        }
                      }
                    // }
                  // })

                  if(completedDateRaw) {
                    let _userLog = TrainingModuleUserLogs.findOne({
                      uid: u._id,
                      mid: um,
                      page: 1
                    })

                    if(_userLog && _userLog.cAt) {        

                      time = diffDates(_userLog.cAt, completedDateRaw) || ''
                    }
                  }

                } //-- if(uModuleProgress && uModuleProgress.length > 0) {

                if(!(trModuleDuration === '' || time === '')) {
                  underOverTime = diffDHMS('00:'+trModuleDuration, time) || ''
                }


                dataText += p.clientName+sp+p.buName+sp+userGroup+sp+p.lastname+sp+p.firstname+sp+email+sp
                dataText += myRole+sp
                dataText += managerName+sp+p.country+sp+regionName+sp
                // dataText += trModuleName+sp+trProgress+sp+lastLogin+sp+completedDate+sp+time+sp
                dataText += trModuleName+sp+trProgress+sp+lastLogin+sp+completedDate+sp+completedDate2+sp+time+sp
                dataText += trModuleDuration+sp+underOverTime
                dataText += nl
              }
            })

          } else {
              dataText += p.clientName+sp+p.buName+sp+p.userGroup+sp+p.lastname+sp+p.firstname+sp+email+sp
              dataText += myRole+sp
              dataText += managerName+sp+p.country+sp+regionName+sp
              // dataText += ''+sp+''+sp+lastLogin+sp+''+sp
              dataText += ''+sp+''+sp+lastLogin+sp+''+sp+''+sp
              dataText += ''+sp+''
              dataText += nl            
          }
        })
      }    

      let output = Meteor.wrapAsync(function(args, callback) {
          
        if(process.env.NODE_ENV === "production") {  

          let Knox = Npm.require('knox')

          let client = Knox.createClient({
            key: s3Config.accessKeyId,
            secret: s3Config.secretAccessKey,
            bucket: s3Config.bucket
          })     

          let s3Path = "exports/"
          let filename = ''

          let headers = {
              // 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              // 'Content-Type': 'text/plain',
              'Content-Type': 'application/csv',
              'Content-Length': dataText.length,
              // 'x-amz-acl': 'public-read'
              // 'x-amz-acl': 'private'
          }

          filename = "CRAATraining_Status_" + dateFormatNRaw(new Date) + ".csv"
          
          client.putBuffer(dataText, s3Path+filename, headers, function(err, res){
            if(err) {
              // console.log(err)
              callback(null, {err: err})
            } else {
              if(res) {
                let fileObj = {
                  path: s3Path,
                  filename: filename
                }
                callback(null, fileObj) 
              }
            }  
          });

        } else {

          var fs = require('fs');
          let filename = "CRAATraining_Status_" + dateFormatNRaw(new Date) + ".csv"
          var base = (process.env.NODE_ENV === 'development' || Meteor.absoluteUrl().indexOf("localhost") !== -1) ?  process.env.PWD+'/public' : '/bundle/bundle/programs/web.browser/app'; 

          fs.writeFile(base+'/exports/'+filename, dataText, function(err) {
              if(err) {
                  // return console.log(err);
              } else {

                let fileObj = {
                  path: '/exports/',
                  filename: filename
                }
                callback(null, fileObj)
            }
          });

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

function dateFormatNRaw(thisDate) {
  if(thisDate) {
    var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];        
    return  thisDate.getDate() + "-" + (month[thisDate.getMonth()]) + "-" + thisDate.getFullYear() + '-' +
        ("0" + thisDate.getHours()).slice(-2) + "" + ("0" + thisDate.getMinutes()).slice(-2) + "" + 
        ("0" + thisDate.getSeconds()).slice(-2);    
  }
}

function dateFormatN(thisDate) {
    if(thisDate) {
      var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];        
      return  thisDate.getDate() + "-" + (month[thisDate.getMonth()]) + "-" + thisDate.getFullYear() + ' ' +
          ("0" + thisDate.getHours()).slice(-2) + ":" + ("0" + thisDate.getMinutes()).slice(-2) + ":" + 
          ("0" + thisDate.getSeconds()).slice(-2);    
    }
}

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

function diffDates2(date1, date2) {
  // get total seconds between the times
  let delta = Math.abs(date2 - date1) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  // let _days = days < 10 ? '0'+days : days

  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  // let _hours = hours < 10 ? '0'+hours : hours

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

  hours += days *24

  let _hours = hours < 10 ? '0'+hours.toString() : hours

  return _hours + ':' + _mins + ':' + _seconds

  // return toHHMMSS(seconds)
}

function diffDHMS(dhms1, dhms2) { //-- for this case, arg1 is Module Duration, arg2 is trainee's spent-time
  let 
    _dhms1 = dhms1.split(':'),
    _dhms2 = dhms2.split(':')

  let 
    _d1 = parseInt(_dhms1[0]),
    _h1 = parseInt(_dhms1[1]),
    _m1 = parseInt(_dhms1[2]),
    _s1 = parseInt(_dhms1[3]),
    _d2 = parseInt(_dhms2[0]),
    _h2 = parseInt(_dhms2[1]),
    _m2 = parseInt(_dhms2[2]),
    _s2 = parseInt(_dhms2[3])

  let 
    _seconds1 = (_d1*24*3600) + (_h1*3600) + (_m1*60) + _s1,
    _seconds2 = (_d2*24*3600) + (_h2*3600) + (_m2*60) + _s2,
    _diff = 0,
    _neg = ''

    if(_seconds1 > _seconds2) { // user spent less time than the alloted time, this is not desirable
      _diff = _seconds1 - _seconds2
      _neg = '(-)'
    } else {
      _diff = _seconds2 - _seconds1
    }

  // console.log(_diff, toHHMMSS(_diff))

  return _neg + seconds2DHMS(_diff)

}

var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10)    
    var hours   = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60    
    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}

function seconds2HMS(secs) {
    let 
      _d = Number(secs),
      _h = Math.floor(_d / 3600),
      _m = Math.floor(_d % 3600 / 60),
      _s = Math.floor(_d % 3600 % 60)

    let 
      h = _h < 10 ? '0' + _h : _h,
      m = _m < 10 ? '0' + _m : _m,
      s = _s < 10 ? '0' + _s : _s

    return h + ':' + m + ':' + s 
}

function seconds2DHMS(secs) {

  let seconds = parseInt(secs, 10);

  let days = Math.floor(seconds / (3600*24));
  seconds  -= days*3600*24;
  let hours   = Math.floor(seconds / 3600);
  seconds  -= hours*3600;
  let minutes = Math.floor(seconds / 60);
  seconds  -= minutes*60;

  let 
    d = days < 10 ? '0' + days : days,
    h = hours < 10 ? '0' + hours : hours,
    m = minutes < 10 ? '0' + minutes : minutes,
    s = seconds < 10 ? '0' + seconds : seconds

    return d + ':' + h + ':' + m + ':' + s 
}
