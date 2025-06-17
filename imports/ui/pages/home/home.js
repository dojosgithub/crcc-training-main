/**
 * Main homepage template logic
 */

import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModuleSettings } from '/both/api/collections/training-module-settings.js'

// import '/imports/ui/stylesheets/home.less'
import { Home } from '/imports/ui/pages/home/home.html' 

// import firebase from 'firebase/app';
// import 'firebase/database';
// import { FBDBConfig } from '/both/startup/config/db-config.js'

// firebase.initializeApp(FBDBConfig);

let _selfHome
let _subsHome
//-- The method 'onCreated' fires up 
//-- when this template is called.
Template.Home.onCreated(function homeOnCreated() {
// Template.Home.onCreated(() => {

  // let mySettings = TrainingModuleSettings.find({
  //   userId: Meteor.userId()
  // }).fetch()      

  // Session.setPersistent('mySettings', mySettings)
  // console.log(Session.get("mySettings"))     
  // console.log('3') 
  // console.log(Session.get("mySettings"))

  // if(_moduleFooterTimer) {
  //   console.log('aaa')
  //   Meteor.clearInterval(_moduleFooterTimer);
  // }
  // if(_moduleFooterVideoTimer) {
  //   Meteor.clearInterval(_moduleFooterVideoTimer);
  // }

  _selfHome = this

  _subsHome = new SubsManager()
  _selfHome.ready = new ReactiveVar()

  _selfHome.autorun(() => {
    if(Meteor.userId()) {
      let handleMySettings = _subsHome.subscribe('training_module_settings_w_uid', Meteor.userId())
      _selfHome.ready.set(handleMySettings.ready())
    }
  })

  // Template.Home.__helpers.get("FBDBTest").call();
  // Template.Home.__helpers.get("FBDBTest2").call();
  // Template.Home.__helpers.get("FBDBTestClient").call();
  
})

Template.Home.onRendered(() => {
  _selfHome.autorun(() => {
    if(_selfHome.ready.get()) {
      let mySettings = TrainingModuleSettings.find({
        userId: Meteor.userId()
      }).fetch()

      if(mySettings.length > 0) {
        localStorage.setItem('mstgs', JSON.stringify(mySettings[0]))
      }
    }

    
  })

  // $(".grecaptcha-badge").css({
      // width: '1px',
      // height: '1px'
  // }); //-- privacy policy has reCAPTCHA v2, so, it's better to hide v3 badge...  
})

Template.Home.helpers({
  FBDBTest() {
    let _userId = Meteor.userId();
    Meteor.call("TrainingTimerLog.initTest", { userId: _userId }, (err, res) => {
      console.log(err, res)
      if(err) {

      } else {
        // console.log(res)
      }
    })
  },
  FBDBTest2() {
    let _userId = Meteor.userId();
    Meteor.call("TrainingTimerLog.getTest", { userId: _userId }, (err, res) => {
      console.log(err, res)
      if(err) {

      } else {
        // console.log(res)
      }
    })
  },
  FBDBTestClient() {
    let _userId = Meteor.userId();

    if(_userId) {   

      try {
        // console.log(userId)
        

        let _fbdb = firebase.database()

        // _fbdb.ref('tr_timer_log/').push({
        _fbdb.ref('tr_timer_log/'+_userId).set({          
            uid: _userId,
            cAt: Date(),
            cAtr: firebase.database.ServerValue.TIMESTAMP
        }, (err) => {
            
            if(err) {
                return err;
            } else {

                // functions.database.ref('tr_timer_log/').onCreate((snap, context) => {
                //     const createdData = snap.val(); // data that was created
                // });

                // let added = [];
                // _fbdb.ref('tr_timer_log/').once('value').then((snapshot) => {
                    
                //     let 
                //         _logs = snapshot.val();
                //     //     _last = _logs.length -1;

                //     console.log("Logs => ", _logs);
                //     // console.log("Last => ", _logs[_last])
                //     // return _logs[_last];

                //     // return _logs;
                //     // _logs.forEach((s) => {
                //     //   console.log("Logs => ", s);
                //     // })
                // });

                // let _added = _fbdb.ref('tr_timer_log/').on('child_added', (data) => {
                //     console.log("Child Added => ", data.val())

                //     // return data.val();
                //     // callback(null, {success: true, data: data.val() });

                //     // added.push(data.val())
                //     // return data.val();
                // })  
                
                // callback(null, {success: true, data: added });
                // return added;
                // console.log(_added)

            }

        })

        // _query().then(ret => ret);
        // return _data;

      } catch(e) {
          console.log("Error => ", e)
          return e;
      } 
    
    } //-- if(_userId) {
  },
  FBDBTestClient2() {
    let _userId = Meteor.userId();

    if(_userId) {
      
      let FBDBConfig = {
        databaseURL: "http://localhost:4000/?ns=dqk-fbtest-01" 
      }    

      try {                

        let _fbdb = firebase.database()

        // _fbdb.ref('tr_timer_log/'+_userId).set({
        //   uid: _userId,
        //   cAt: Date(),
        //   cAtr: firebase.database.ServerValue.TIMESTAMP
        // }, (err) => {
        //   if(err) {
        //     console.log("Err => ", err);
        //   } else {
           _fbdb.ref('tr_timer_log/'+_userId).once('value').then((snapshot) => {
                    
              let 
                  _logs = snapshot.val();
              //     _last = _logs.length -1;

              console.log("Logs => ", _logs);
              // console.log("Last => ", _logs[_last])
              // return _logs[_last];

              // return _logs;
              // _logs.forEach((s) => {
              //   console.log("Logs => ", s);
              // })
            });

            _fbdb.ref('tr_timer_log/'+_userId).on('child_changed', (data) => {
              console.log("Child Changed => ", data.val())

              // return data.val();
              // callback(null, {success: true, data: data.val() });

              // added.push(data.val())
              // return data.val();
            }) 
        //   }
        // })

      } catch(e) {
        console.log(e)
      }
    } //-- if(_userId) {
  }  
});

Template.Home.events({
  'click .btn-fbtest'() {
    Template.Home.__helpers.get("FBDBTestClient").call();
  }
})
