/**
 * Accounts methods
 */
import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'

if(Meteor.isServer) {
    // import  geoip  from 'geoip-lite'
    // var geoip = require('geoip-lite');
}

import { SimUsersSummary } from '/both/api/collections/sim-users-summary.js'

import { Method } from '/imports/api/lib/method.js'

import { APIConfig } from '/both/startup/config/api-config.js';
import { Wrapper } from '/imports/api/lib/wrappers.js'

import { syncUserData } from '/both/api/methods/admin-all-users.js'

import { TrainingModuleUserLogs } from '/both/api/collections/training-module-user-logs.js'

// var SHA256 = require("crypto-js/sha256");

const apiURL = APIConfig[process.env.NODE_ENV].apiURL
let headers = {
    'X-Auth-Token': APIConfig.XAuthToken,
    'X-User-Id': APIConfig.XUserId
}

export const userSignin = new ValidatedMethod({
    name: 'userSignin',
    validate: ()=>{},
    run(user) {

        try {
        
            let data = {
                username: user.username,
                password: user.password
            }

            let url = apiURL + '/login'

            let result = Wrapper.httpWrapAsyncPOST(url, headers, data)
            
            if(result) {
                return result.data
            }

        } catch(e) {
          console.log( "Cannot get result data...", e );
        }
    }
});

export const signInUser = new Method('signInUser', function(userObj) {
  
    if(Meteor.isServer) {

      try { 

        check(userObj, {
            username: String,
            password: String
        })        

        // return new Promise((resolve, reject) => { //-- this seems to cause system freezing due to another Promise inside syncUserData

        // let output = Meteor.wrapAsync((sid, callback) => { //-- this works best even with syncUserData's Promise process

            let ___user = Meteor.users.findOne({
                username: userObj.username
            })

            // syncUserData.call(___user, (err, res) => {
            // // Meteor.call('syncUserPassword', ___user, (err, res) => {
            //   if(err) {
            //     resolve({success: false})   
            //   } else {
            //     if(res && res.success) {
            //         resolve({success: true})
            //     }          
            //   }

              
            // }) 

            syncUserData.call(___user);
            // syncUserData.call(___user, (err, res) => {
                // console.log(err, res)
                // if(err) {
                    // callback(null, {success: false})  
                // } else {
                    // if(res && res.success) {
                        // callback(null, {success: true})  
                    // }                     
                // }
            // }) 

        // })

        // syncUserData.call(___user)

        // let ___userObj = {
        //     digest: SHA256(userObj.password),
        //     algorithm: "sha-256"
        // }

        // console.log(___userObj)

        // var result = Accounts._checkPassword(___user, ___userObj.digest)

        // console.log(result)

        // })

        // let result = output("DQ")

        // if(result) {
        //   return result
        // }

      } catch(e) {
          console.log( "Cannot get result data...", e )
      }  
    }
})

export const getUserWUsername = new Method('getUserWUsername', function(userObj) {
  
    if(Meteor.isServer) {

      try { 

        check(userObj, {
            username: String,
            password: String
        })        

        return new Promise((resolve, reject) => {
            let ___user = Meteor.users.findOne({
                username: userObj.username
            })

            if(___user) {

                let _printScreen = TrainingModuleUserLogs.findOne({
                    uid: ___user._id,
                    msg: 'print screen'
                })

                if(_printScreen) {
                    resolve({success: true, data: ___user, printScreen: true})    
                } else {
                    resolve({success: true, data: ___user})
                }
            } else {
                resolve({success: false})
            }
        })
      } catch(e) {
          console.log( "Cannot get result data...", e )
      }  
    }
})

//-- This is called from syncing user pasword real-time 
//-- from App site when users reset their password.
//-- DDP.setPassword did not work, so, we encapsulate 
//-- Accounts.setPassword with this method.
remoteSetPwd = new Method('remoteSetPwd', function(obj) {
  
    if(Meteor.isServer) {

      try { 

        check(obj, {
            uid: String,
            password: String
        })        

        return new Promise((resolve, reject) => {

            if(obj.uid && obj.password) {
                Accounts.setPassword(obj.uid, obj.password, (err) => {
                    if(err) {
                        resolve({success: false});
                    } else {

                        Meteor.users.update(obj.uid, {
                            $set: {
                                'profile.status': 1
                            }
                        })

                        resolve({success: true});
                    }
                })
            } else {
                resolve({success: false});
            }
        })
      } catch(e) {
          console.log( "Cannot get result data...", e )
      }  
    }
})

//-- This method is called when a sim user verifies their Email. If tr site doesn't have 
//-- a user account yet, it'll create one as soon as the user verifies her Email.
//-- This is for showing Progress Overview in the app home page in case the user signs-in 
//-- before her TR user account is created...(04/15/2021)
createTRUserDataIfNone = new Method('createTRUserDataIfNone', function(user) {
    // console.log("syncUserData => ", user)
    try {
  
      check(user, Object)
  
      if(Meteor.isServer) {
  
        let _user = Meteor.users.findOne(user._id);

        if(_user) { 

        } else {

            import { CoreDB } from '/both/startup/config/db-config.js';
    
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
                    }
                    }
        
                ]
        
                let result = Promise.await(SimUsersSummary.rawCollection().aggregate(pipelineSimUsersSummary).toArray());
        // console.log(result)
                if(result && result.length > 0) {
                    // return result.data.data
        
                    result.forEach((u,i) => {
        // console.log(i, u, u.clientName)
                    Meteor.users.insert({
                        _id: u.uid,
                        emails: u.emails,
                        services: u.services,
                        username: u.username,
                        createdAt: new Date,
                        profile: { 
                            firstname: u.firstname, //-- so, we have to go this way...
                            lastname: u.lastname,
                            fullname: u.fullname,
                            initial: u.initial,
                            status: u.status,
                            role: u.roleKey,
                            clientName: u.clientName,
                            clientId: u.clientId,
                            buName: u.buName,
                            buId: u.buId,
                            managerName: u.managerName,
                            managerId: u.managerId,
                            country: u.country,
                            regionName: u.regionName,
                            userGroup: u.userGroup,
                            // status: u.status,                                               
                            modifiedAt: new Date 
                        }                   
                    });                            
                })
        
                    callback(null, {success: true, user: result[0]});
                } //-- let output = Meteor.wrapAsync((args, callback) => { 
            });

            let _result = output('dq')
    
            if(_result) {
            return _result
            }

        }
  
  
      } //-- if(Meteor.isServer)
      
    } catch(e) {
        console.log( "Cannot get result data...", e )
    }
  
  })

// export const userSignin = new ValidatedMethod({
//     name: 'userSignin',
//     validate: ()=>{},
//     run(user) {

//         try {
        
//             let params = '?username=' + user.username + '&password=' + user.password

//             let url = apiURL + '/user_signin' + params

//             let result = Wrapper.httpWrapAsync(url, headers)
            
//             if(result) {
//                 return result.data
//             }

//         } catch(e) {
//           console.log( "Cannot get result data...", e );
//         }
//     }
// });

// if(Meteor.isServer) {
// Meteor.methods({
//     "Accounts.getUserLocation"() {
//         // import  geoip  from 'geoip-lite'
//         var geoip = require('geoip-lite');

//         let ip = this.connection.clientAddress
        
//         ip = "116.113.88.10";
        
//         let 
//           // ip = _ip,
//           // ip = "207.97.227.239",
//           // ip = "116.113.88.10", //-- China
//           geo = geoip.lookup(ip)
       
//         // console.log(geo, _ip); 

//         return geo         
//     }
// })
// }
// export const getUserLocation = new ValidatedMethod({    
//     name: 'getUserLocation',
//     validate: ()=>{},
//     run() {

export const getUserLocation = new Method('getUserLocation', function() {        
    
    try {
        if(Meteor.isServer) {
            import  geoip  from 'geoip-lite'
            // var geoip = require('geoip-lite');

            let ip = this.connection.clientAddress
            
            // ip = "116.113.88.10";
            // ip = "136.49.232.133";
            
            let 
              // ip = _ip,
              // ip = "207.97.227.239",
              // ip = "116.113.88.10", //-- China
              geo = geoip.lookup(ip)

            // console.log(geo, ip); 

            return geo 
        }

    } catch(e) {
      console.log( "Cannot get result data...", e );
    } 
        
});

export const reCAPTCHA3 = new Method('reCAPTCHA3', function(obj) {      
    check(obj, {
        ___token: String
    });
    this.unblock();

    try {
        if(Meteor.isServer) {
        // if(process.env.NODE_ENV === "production") {

            let output = Meteor.wrapAsync((args, callback) => {         

              const _reCAPTCHA = HTTP.call('GET', 'https://www.google.com/recaptcha/api/siteverify?secret=6LdQG_wUAAAAABOtKHewfD71InaLiNezGN251p67&response='+obj.___token, {          
              }, (err, res) => {
                callback(null, {data: res.data});
              });                 
            });

            let result = output('dq') 

            if(result) {
            // console.log(result.data)
                return result.data
            }
        }
    } catch(e) {
      console.log( "Cannot get result data...", e );
    }
    // } //-- if(process.env.NODE_ENV === "production") {       

})

if(Meteor.isServer) {

Meteor.methods({
    "Account.getLoginToken"(obj) {
        check(obj, {
            userId: String
        })

        let _user = Meteor.users.findOne(obj.userId);

        if(_user) {
            // console.log(_user)
            // let _loginToken = _user.services.resume.loginTokens || null;
            let _loginToken = _user.profile._slt || null;

            return _loginToken;

        }
    }
});

}
