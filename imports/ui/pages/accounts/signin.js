/**
 * User Sign-in template logic
 */

import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { Promise } from 'meteor/promise';

import { TrainingModuleSettings } from '/both/api/collections/training-module-settings.js'
import { getSetSettings } from '/both/api/methods/training-module-settings.js'

import { insertLog } from '/both/api/methods/training-module-logs.js'
import { insertUserLog } from '/both/api/methods/training-module-user-logs.js'

import { DDPURL } from '/both/startup/config/ddp-config.js'

import { signInUser, getUserWUsername, getUserLocation, reCAPTCHA3 } from '/both/api/methods/accounts.js'


// import '/imports/ui/stylesheets/accounts.less'

import { SignIn } from '/imports/ui/pages/accounts/signin.html'

import firebase from 'firebase/app';
// import 'firebase/database';
// import 'firebase/auth';
// import { FBDBConfig } from '/both/startup/config/db-config.js'

// firebase.initializeApp(FBDBConfig);

_fbUser = null;

let _selfSignIn;
//- Sin-In onCreated logic
Template.SignIn.onCreated(() => {

  _selfSignIn = this;

  _selfSignIn.reCAPTCHAFailed = 0;

  Tracker.autorun(function() {

      if(!Session.get("SignIn.UserLocation")) {
          getUserLocation.call({}, (err, res) => {          
              if(err) {}
              else {
                  // console.log(res)
                  Session.set("SignIn.UserLocation", res)

                  if(res && res.country === 'CN') {                        
                      $(".grecaptcha-badge").css({
                          width: '1px',
                          height: '1px'
                      }); //-- privacy policy has reCAPTCHA v2, so, it's better to hide v3 badge...                        
                  }
              }
          })
      }

  }); 

  if(!___isDemo) {
    firebase.auth().signOut();
  }
})
 
Template.SignIn.onRendered(() => {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
        // At least Safari 3+: "[object HTMLElementConstructor]"
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
        // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
        // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
        // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
        // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS; 

    if(isIE || isEdge) {
        var myBrowser = isIE ? "Internet Explore" : "Edge";

        // toastr.error("We're sorry, but, we recommend using Chrome. You are currently using " + myBrowser +".", "Warning", {
        // sAlert.error("Please use the Chrome browser to signin.", {
        //     position:'top',
        //     // timeOut: 10000,
        //     timeout: 'none'                    
        // });
        toastr.error("Please use the Chrome browser to signin."); 

        $(".signin-form button:not(.btn-signin-hidden)").hide();           
    }

   grecaptcha.ready(function() {
      grecaptcha.execute('6LdQG_wUAAAAAMup-zrZwo0u8R1HCyayc4_SeFy7', {action: 'training_signin'}).then(function(___token) {
         // console.log(___token)
         // document.getElementById('g-recaptcha-response').value = ___token;
         if(___token !== '') {
            Session.set("SignIn.reCAPTCHA.token", ___token);
         }
      });
    });

})

Template.SignIn.events({
  // 'click .btn-submit-signin'(e, tpl) {
  'submit .signin-form'(e, tpl) {
    e.preventDefault()

    let _this = $(e.currentTarget)

    // _this.button("loading")
    $(".btn-submit-signin").css("width", "100%")
    $(".btn-submit-signin").button("loading")

    let geo = Session.get("SignIn.UserLocation");

    if(geo && geo.country === 'CN') { //-- if it's China user
        // console.log("China User");
        ___userSignIn();

    } else {

        reCAPTCHA3.call({
            ___token: Session.get("SignIn.reCAPTCHA.token")
        }, (err, res) => {
            // console.log(Session.get("SignIn.reCAPTCHA.token"))
            // console.log(err, res)
            // console.log("Non-China User")
            if(res.success === true) {                        
                ___userSignIn();
            } 
            else {

              _selfSignIn.reCAPTCHAFailed++;
                // console.log(err, res);

                if(_selfSignIn.reCAPTCHAFailed < 5) {
                  ___userSignIn();
                } else {
                  $('#username').val('');
                  $('#password').val('');
                  toastr.error("Your sign-in session has been locked due to multiple invalid sign-in attempts.<br><br>Please try again or use: <br><br>ForgotPassword/ForgotUsername<br><br>to get the correct credentials.<br><br>If you think this is a system error and issue persists, please contact us at help@craassessments.com", '', {timeOut: 20000});
                  // $('.btn-submit-signin').button("reset"); //-- let's make it disabled as the user failed to provide correct credentials multiple times
                }
            }
        })

    } 


  } 

})


function ___userSignIn() {

    var username = $('#username').val().trim();
    var password = $('#password').val().trim();

    let canGo = true;

    if(username === '') {
      toastr.error('Username cannot be null.')
      canGo = false
    } 

    if(password === '') {
      toastr.error('Password cannot be null.')
      canGo = false
    }

    if(canGo) {

      let user = {
        username: username,
        password: password
      }

// console.log(user);

      getUserWUsername.call(user, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again. " + err)
          $('.btn-submit-signin').button("reset")
        } else {
          if(res && res.data) {
            let _me = res.data

            if(_me.profile.status === 2) {
              toastr.info("If you think this is a system issue, please contact us at help@craassessments.com")
              
              if(res.printScreen) {
                toastr.warning("Typically, multiple attempts to create screenshots can deactivate your account.")
              }
              toastr.error("Your account has been deactivated.")
              $('.btn-submit-signin').button("reset")
            } else {
              // ___proceedLoginProcess(username, password)
// console.log(username)
// console.log(password)
              Meteor.loginWithPassword(username, password, function (error) {
                if(error) {
                  toastr.error("Please try again with valid username and password.");
                  // console.log("Error => ", error)
                  $('.btn-submit-signin').button("reset");
                  //-- Upon Chris' request (esp. with Covance pilot user cases, 05/31/2019)              
                  insertLog.call({uid: username, uA: window.navigator.userAgent, venue:'sign-in', msg: 'Unauthorized login request'})
                } else {

                  $('.btn-submit-signin').button("reset");
                  let uid = Meteor.userId()

                  if(uid) {
                    // return new Promise((resolve, reject) => {

                    getSetSettings.call({userId: uid})

                    insertLog.call({uid: uid, uA: window.navigator.userAgent, msg: 'signed-in'})
                    insertUserLog.call({uid: uid, msg:'signed-in'})

                    /*
                    _fbUser = firebase.auth().signInAnonymously()
                    .catch(function(error) {
                     // Handle errors
                      // console.log("err => ", err)
                      toastr.error("Something went wrong. Please try again.");                      
                      insertUserLog.call({uid: uid, error: error, msg:'SR: Sign-in issue'})

                      // FlowRouter.go("/signout");
                    });

                    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
                      .then(() => {
                        // Existing and future Auth states are now persisted in the current
                        // session only. Closing the window would clear any existing state even
                        // if a user forgets to sign out.
                        // ...
                        // New sign-in will be persisted with session persistence.
                        // return firebase.auth().signInWithEmailAndPassword(email, password);
                      })
                      .catch((error) => {
                        // Handle Errors here.
                        // var errorCode = error.code;
                        // var errorMessage = error.message;
                        toastr.error("Something went wrong. Please try again.");                      
                        insertUserLog.call({uid: uid, error: error, msg:'SR: sign-in session issue'})
  
                        // FlowRouter.go("/signout");                        
                    });                    
                    */
                   
                    // console.log("FBUser => ", _fbUser)

                    // firebase.auth().onAuthStateChanged(function(user) {
                    //   // window.user = user;
                    //   console.log("User => ", user)
                    //   // Step 1:
                    //   //  If no user, sign in anonymously with firebase.auth().signInAnonymously()
                    //   //  If there is a user, log out out user details for debugging purposes.
                    // });
                    // firebase.auth().signOut();

                    FlowRouter.go("/home")

                    // })
                  }                  
                }
              });
              
            }
          } else {
            $('.btn-submit-signin').button("reset")
            toastr.error("Username does not exist. Please check your username and try again.")
            //-- Upon Chris' request (esp. with Covance pilot user cases, 05/31/2019)
            insertLog.call({uid: username, uA: window.navigator.userAgent, venue:'sign-in', msg: 'Unauthorized login request'})            
          }        
        }
        $(".btn-submit-signin").button("reset")
      })

    } else {
     $(".btn-submit-signin").button("reset")
    }

}

// function importModule(url) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     const tempGlobal = "__tempModuleLoadingVariable" +
//         Math.random().toString(32).substring(2);
//     script.type = "module";
//     script.textContent = `import * as m from "${url}"; window.${tempGlobal} = m;`;

//     script.onload = () => {
//       resolve(window[tempGlobal]);
//       delete window[tempGlobal];
//       script.remove();
//     };

//     script.onerror = () => {
//       reject(new Error("Failed to load module script with URL " + url));
//       delete window[tempGlobal];
//       script.remove();
//     };

//     document.documentElement.appendChild(script);
//   });
// }

function ___proceedLoginProcess1(username, password) {
  Meteor.loginWithPassword(username, password, function (error) {
    if(error) {

    } else {
      let uid = Meteor.userId()

      if(uid) {
        // return new Promise((resolve, reject) => {

        getSetSettings.call({userId: uid})

        insertLog.call({uid: uid, uA: window.navigator.userAgent, msg: 'signed-in'})
        insertUserLog.call({uid: uid, msg:'signed-in'})

        FlowRouter.go("/")

        // })
      }      
    }
  });
}

function ___proceedLoginProcess(username, password) {

  Meteor.loginWithPassword(username, password, function (error) {
    if(error) { 
// console.log(error)
      // sAlert.info("We're checking your account. Please contact us at help@craassessments.com if you have any questions.");
      //-- If failed to log in, check the main database to see if password was changed
      // if(process.env.NODE_ENV === "production") {  

        // Get the connection
        let ___conn = DDP.connect(DDPURL[process.env.NODE_ENV]);

        //-- Pass the connection to `DDP.loginWithPassword`, which is otherwise similar to
        //-- the core `Meteor.loginWithPassword` method.
        //-- For some reason, sometimes this gets the user stuck in the middle.
        //-- Private IP of Training site has been added to the IP Whitelist of Atals (04/23/2018, dk)
        //-- to see if this helps...seems to be working better...(?)
        DDP.loginWithPassword(___conn, {username: username}, password, function (error) {
          // if (!error) {
          //   console.log("Logged in!");
          //   conn.call('methodTheRequiresBeingLoggedIn', function () {
          //     console.log(arguments);
          //   });
          // } else {
          //   console.log(error);
          // }
          if(error) { //-- even failed to login with the main database data
            toastr.error("Please try again with valid username and password.");
            $('.btn-submit-signin').button("reset")
          } else { //-- if main database says it's a correct user credentials, sync TR database with it and
            //-- let the user log-in

            let _userObj = {
              username: username,
              password: password
            }

            signInUser.call(_userObj, (err, res) => {
            // ___conn.call('signInUser', user, (err, res) => {
              // console.log(res);
              if(res && res.success) {

                Meteor.loginWithPassword(username, password, function (error) {
                  if(error) {
                    toastr.error("Please try again with valid username and password.");
                    $('.btn-submit-signin').button("reset")
                  } else {

                    let uid = Meteor.userId()

                    if(uid) {
                      // return new Promise((resolve, reject) => {

                      getSetSettings.call({userId: uid})

                      insertLog.call({uid: uid, uA: window.navigator.userAgent, msg: 'signed-in'})
                      insertUserLog.call({uid: uid, msg:'signed-in'})

                      FlowRouter.go("/")

                      // })
                    }

                    $('.btn-submit-signin').button("reset")
                  }
                });

              } else {
                // toastr.error("Something went wrong. Please try again. " + err);
                toastr.success("Please WAIT until your new password is verified if you did reset your password right before signing-in.");
                toastr.success("Verifying your account ...");

                setTimeout(function() {
                  toastr.info("If you keep having issues with signing-in, please contact us at help@craassessments.com.");
                  toastr.info("Your account has been verified. Please try again now.");
                  $('.btn-submit-signin').button("reset");
                }, 5000);

                $('.btn-submit-signin').button("reset")
              }

              $('.btn-submit-signin').button("reset")
            });
          }  
        });

      // } 


    } else {

      let uid = Meteor.userId()

      if(uid) {
        // return new Promise((resolve, reject) => {

        getSetSettings.call({userId: uid})

        insertLog.call({uid: uid, uA: window.navigator.userAgent, msg: 'signed-in'})
        insertUserLog.call({uid: uid, msg:'signed-in'})

        FlowRouter.go("/")

        // })
      }

      // FlowRouter.go("/");
    }
  });

}


