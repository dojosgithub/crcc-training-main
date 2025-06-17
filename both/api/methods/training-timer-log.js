if(Meteor.isServer) {

import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js';

import firebase from 'firebase/app';
import 'firebase/database';
// import functions from 'firebase/functions';
// const functions = require('firebase-functions');

import { FBDBConfig } from '/both/startup/config/db-config.js'
// import '/both/startup/config/db-config.js'

firebase.initializeApp(FBDBConfig);

Meteor.methods({
    "TrainingTimerLog.data.transfer"(obj) {
        check(obj, {
            uid: String
        })

        // let _tsu = TrainingStatusSummary.find({
        //     userId: obj.uid,
        //     checked: true
        // }).fetch()

        // console.log(_tsu);

        // if(_tsu && _tsu.length > 0) {

            let _fbdb = firebase.database();

            let
                _userIdKey =  obj.uid+'dQk',
                _userDataRef = _fbdb.ref('tr_timer_log').child(_userIdKey);

            // console.log(_userIdKey);

            getTRData();

            // let _result = new Promise((resolve, reject) => {
            //     _userDataRef.once('value', function(snapshot) {
            //         console.log(snapshot);
            //         console.log(snapshot.key, snapshot.val())
            //         let _obj = {
            //             key: snapshot.key,
            //             val: snapshot.val()
            //         }

            //         console.log("obj => ", _obj);
            //         resolve(_obj)
            //     });
            // });

            // console.log(_result);

            async function getTRData() {
                let promises = [];
                
                let _userRef = _userDataRef.once('value', function(snapshot) {
                    return snapshot.val();
                }); 
                promises.push(_userRef)
                
                let _userSnapshots = await Promise.all(promises);

                if(_userSnapshots && _userSnapshots.length > 0) {
                    _userSnapshots.forEach((u,i) => {
                        if(u.val()) {
                            
                            let _userData = u.val();

                            Object.keys(_userData).forEach((mid,j) => {
                                // console.log("ModuleId => ", mid)
                                
                                let _pData = [];
                                Object.keys(_userData[mid]).forEach((pid,k) => {
                                    // console.log("PageId => ", pid)
                                    if(pid !== 't' && pid !== 'vt') { //-- this is not a page specific data, this is modules time/video time data, so, exclude these
                                        let _pObj = {
                                            pid: pid,
                                            t: pid.t,
                                            vt: pid.vt
                                        }

                                        _pData.push(_pObj);
                                    }
                                })
                                                                                                
                                TrainingStatusSummary.update({
                                    userId: obj.uid,
                                    moduleId: mid
                                },{
                                    $set: {
                                        // timer: {
                                        //     t: _userData[mid].t || 0,
                                        //     vt: _userData[mid].vt || 0,
                                        //     page: _pData
                                        // }
                                        'timer.t': _userData[mid].t || 0,
                                        'timer.vt': _userData[mid].vt || 0,
                                        'timer.page': _pData
                                    }
                                });

                            }) 
                        }
                    })
                    // console.log(_userSnapshots[0].key, _userSnapshots[0].val())
                }
            }

        // }


        // _moduleId =  "GtNsWGrWYpsWFS7Kf",
        // _moduleVideoTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child('vt'),
        // _moduleTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child('t');         
        
        // remoteSetPwd = new Method('remoteSetPwd', function(obj) {
  
        //     if(Meteor.isServer) {
        
        //       try { 
        
        //         check(obj, {
        //             uid: String,
        //             password: String
        //         })        
        
        //         return new Promise((resolve, reject) => {
        
        //             if(obj.uid && obj.password) {
        //                 Accounts.setPassword(obj.uid, obj.password, (err) => {
        //                     if(err) {
        //                         resolve({success: false})
        //                     } else {
        //                         resolve({success: true})
        //                     }
        //                 })
        //             } else {
        //                 resolve({success: false})
        //             }
        //         })
        //       } catch(e) {
        //           console.log( "Cannot get result data...", e )
        //       }  
        //     }
        // })

    },
    async "TrainingTimerLog.initTest"(obj) {
        check(obj, {
            userId: String
        });

        try {
            // console.log(userId)        

            console.log(FBDBConfig);

            let _fbdb = firebase.database();

            _fbdb.ref('tr_timer_log/').push({
                uid: obj.userId,
                cAt: Date(),
                cAtr: firebase.database.ServerValue.TIMESTAMP
            }, (err) => {
                
                if(err) {
                    return err;
                } else {

                    // functions.database.ref('tr_timer_log/').onCreate((snap, context) => {
                    //     const createdData = snap.val(); // data that was created
                    // });

                    let added = [];
                    _fbdb.ref('tr_timer_log/').once('value').then((snapshot) => {
                        
                        let 
                            _logs = snapshot.val();
                        //     _last = _logs.length -1;

                        // console.log("Logs => ", _logs);
                        // console.log("Last => ", _logs[_last])
                        // return _logs[_last];

                        // return _logs;
                    });

                    _fbdb.ref('tr_timer_log/').on('child_added', (data) => {
                        console.log("Child Added => ", data.val())
    
                        return data.val();
                        // callback(null, {success: true, data: data.val() });

                        // added.push(data.val())
                    })  
                    
                    // callback(null, {success: true, data: added });
                    // return added;

                }

            })

            // _query().then(ret => ret);
            // return _data;

        } catch(e) {
            console.log("Error => ", e)
            return e;
        }
    },
    "TrainingTimerLog.getTest"(obj) {
        check(obj, {
            userId: String
        });

        try {
            // console.log(userId)        

            console.log(FBDBConfig);

            let _fbdb = firebase.database()

            let output = Meteor.wrapAsync((sid, callback) => {
                _fbdb.ref('tr_timer_log/').on('child_added', (data) => {
                    console.log(data.val())

                    // return data.val();
                    // callback(null, {success: true, data: data.val() });
                })

                
            })
            
            let result = output("DQ")      

            if(result) {
                return result
            }            

            // _query().then(ret => ret);
            // return _data;

        } catch(e) {
            console.log("Error => ", e)
            return e;
        }
    }         
    // async "TrainingTimerLog.initTest"(obj) {
    //     check(obj, {
    //         userId: String
    //     });

    //     try {
    //         // console.log(userId)        

    //         console.log(FBDBConfig);

    //         let _fbdb = firebase.database()

    //         let _query =  await _fbdb.ref('tr_timer_log/').push({
    //             uid: obj.userId,
    //             cAt: Date(),
    //             cAtr: firebase.database.ServerValue.TIMESTAMP
    //         })

    //         _query().then(ret => ret);
    //         // return _data;

    //     } catch(e) {
    //         console.log("Error => ", e)
    //         return e;
    //     }
    // }     
    // "TrainingTimerLog.initTest"(obj) {
    //     check(obj, {
    //         userId: String
    //     });

    //     // try {
    //         // console.log(userId)        

    //         console.log(FBDBConfig);

    //         let _fbdb = firebase.database()

    //         let output = Meteor.wrapAsync((sid, callback) => {

    //             try {
    //             let _data =  _fbdb.ref('tr_timer_log/').push({
    //                 uid: obj.userId,
    //                 cAt: Date(),
    //                 cAtr: firebase.database.ServerValue.TIMESTAMP
    //             })

    //             callback(null, {success: true, data: _data });

    //             }

    //     catch(e) {
    //         console.log("Error => ", e)
    //     }
    //         })

    //         let result = output("DQ")      

    //         if(result) {
    //             return result
    //         }


    //     // return obj;
    // }    
    // async "TrainingTimerLog.initTest"(obj) {
    //     check(obj, {
    //         userId: String
    //     });

    //     try {
    //         // console.log(userId)        

    //         console.log(FBDBConfig);

    //         let _fbdb = firebase.database()
            
    //         // return _fbdb.ref('tr_timer_log/MS-HjqkUIMHtGQqR_rR').set({
    //         // return new Promise(resolve => {

    //         //     try {

    //             let _ret = await _fbdb.ref('tr_timer_log/').push({
    //                 uid: obj.userId,
    //                 cAt: Date(),
    //                 cAtr: firebase.database.ServerValue.TIMESTAMP
    //             })

    //             // resolve(_ret);

    //         //     } catch(e) {
    //         //         return e;
    //         //     }
    //         // }) 

    //         return _ret

    //     } catch(e) {
    //         console.log("Error => ", e)
    //     }

    //     // return obj;
    // }
    // "TrainingTimerLog.initTest"(obj) {
    //     check(obj, {
    //         userId: String
    //     });

    //     try {
    //         // console.log(userId)        

    //         console.log(FBDBConfig);

    //         let _fbdb = firebase.database()
            
    //         // return _fbdb.ref('tr_timer_log/MS-HjqkUIMHtGQqR_rR').set({
    //         // return new Promise(resolve => {

    //         //     try {

    //             function _pipeline() {
    //                 // _fbdb.ref('tr_timer_log/').push({
    //                 // uid: obj.userId,
    //                 // cAt: Date(),
    //                 // cAtr: firebase.database.ServerValue.TIMESTAMP
    //                 // })
    //             }

    //             let _ret = Promise.await(                    _fbdb.ref('tr_timer_log/').push({
    //                 uid: obj.userId,
    //                 cAt: Date(),
    //                 cAtr: firebase.database.ServerValue.TIMESTAMP
    //                 }));
    //             // resolve(_ret);

    //         //     } catch(e) {
    //         //         return e;
    //         //     }
    //         // }) 

    //         return _ret

    //     } catch(e) {
    //         console.log("Error => ", e)
    //     }

    //     // return obj;
    // }    
})

}