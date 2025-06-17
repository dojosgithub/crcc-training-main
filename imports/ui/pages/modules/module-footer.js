/**
 * Module Footer template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'
import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

import { insertUserLog } from '/both/api/methods/training-module-user-logs.js'

import { ModuleFooter } from '/imports/ui/pages/modules/module-footer.html'
// import '/imports/ui/stylesheets/modules/module-footer.less'

// var _moduleFooterTimer;

import { _gateURL, _adminURL, _portalURL, _pfizerAdminURL } from '/both/startup/config/craa-urls.js';

let _selfModuleFooter

var __completionPercent = 0,
    __completionTimer

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

import firebase from 'firebase/app';
// import 'firebase/database';
// import 'firebase/auth';

// if (!firebase.apps.length) {
//   try {
//       import { FBDBConfig } from '/both/startup/config/db-config.js';
//       firebase.initializeApp(FBDBConfig)
//   } catch (err) {
//       console.log(err)
//   }
// }
// firebase.initializeApp(FBDBConfig);
// firebase.analytics();
// var _auth = firebase.auth();

var _moduleFooterTimer;
var _moduleFooterPageTimer;
var _moduleFooterVideoTimer;



Template.ModuleFooter.onCreated( function moduleFooterOnCreated() {

  // Meteor.clearInterval(_moduleFooterTimer);
  // Meteor.clearInterval(_moduleFooterPageTimer);
  // Meteor.clearInterval(_moduleFooterVideoTimer);
  // Session.set("ModuleFooter.video.status", null);

  // if(_fbUser) {
    // let _fbUser = firebase.auth().signInAnonymously()
    // .catch(function(error) {
    // // Handle errors
    //   console.log("err => ", err)
    // });
  
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    //   .then(() => {
    //     // Existing and future Auth states are now persisted in the current
    //     // session only. Closing the window would clear any existing state even
    //     // if a user forgets to sign out.
    //     // ...
    //     // New sign-in will be persisted with session persistence.
    //     // return firebase.auth().signInWithEmailAndPassword(email, password);
    //   })
    //   .catch((error) => {
    //     // Handle Errors here.
    //     // var errorCode = error.code;
    //     // var errorMessage = error.message;
    // });
    // FlowRouter.go('/signout');
  // } else {
  //   FlowRouter.go('/signout');
  // }

  Template.ModuleFooter.__helpers.get("resetFBTimer").call();

  _selfModuleFooter = this
  _selfModuleFooter.pageData = this.data.data;

  let _userId = Meteor.userId();

  if(_userId) {
    let 
      _moduleId = this.data.data.moduleId,
      _pageId = this.data.data._id,
      _pageKey = _userId +'dQk'+_moduleId+'dQk'+_pageId,
      _moduleKey = _userId + 'dQk'+_moduleId,
      _pageKeyObj = {
        userId: _userId,
        moduleId: _moduleId,
        pageId: _pageId,
        moduleKey: _moduleKey,
        pageKey: _pageKey
      };


    Session.set("ModuleFooter.pageKeyObj", _pageKeyObj);

    _selfModuleFooter.pageKeyObj = _pageKeyObj;

    Template.ModuleFooter.__helpers.get("initTimer").call();
  }

  let myUserStats = Session.get('myUserStats')
  // console.log(myUserStats)
  _selfModuleFooter.pageData.viewedPages = myUserStats.pages.length || 0
  _selfModuleFooter.pageData.completedAt = myUserStats.completedAt || []

  Session.set("Modules.template.comp.done", null)

  // console.log(_selfModuleFooter.pageData)
  if(_selfModuleFooter.pageData.durationHMS) {
    Session.set("ModuleFooter.module.duration", _selfModuleFooter.pageData.durationHMS);
  }

  // console.log(this)
})

Template.ModuleFooter.onRendered( function moduleFooterOnRendered() {  

  //-- unsafe-inline issue
  // $('.btn-module-navigation.btn-go-next').webuiPopover({
  //   trigger: 'manual',
  //   arrow: true,
  //   // closeable: true,
  //   dismissible: true,
  //   // title:'Click to move on',
  //   content:"Click 'Next' To Proceed",
  //   // placement:'top-right'
  //   placement:'bottom',
  //   style: '_popover'
  // }); 

  let 
    pos = $('#transcript_pre').position(),
    vidPos = $('.col-video-container').position,
    // vidHeight = $('.col-video-container').height() || $('.module-page-template-container').height(),
    vidHeight = $('.col-video-container').height() || $('.col-page-template-container').height()
    // vidHeight = $('.col-video-container').height() || window.innerHeight -310,
    // vidHeight = $('.col-video-container').height() || $('.row-module-main-container').height(), //-- gives too much
    // screenHeight = screen.height;
// console.log(pos, vidHeight)
  if(pos) {
      // let transcriptPreHeight = screenHeight - pos.top
    let transcriptPreHeight = vidHeight - pos.top
  
    $('#transcript_pre').css('height', transcriptPreHeight+'px')  
    // console.log(pos, screen.height, transcriptPreHeight)
  }

  // console.log(_selfModuleFooter.pageData);
  
  let statsObj = {
    userId: Meteor.userId(),
    moduleId: _selfModuleFooter.pageData.moduleId,
    _page: _selfModuleFooter.pageData.index,
    pageId: _selfModuleFooter.pageData._id,
    // numPages: _selfModuleFooter.pageData.numPages,            
    numPages: _selfModuleFooter.data.data.numPages, //-- For some reason, only this works            
    viewedPages: _selfModuleFooter.pageData.viewedPages,            
    completedAt: _selfModuleFooter.pageData.completedAt,
    moduleDuration: _selfModuleFooter.pageData.moduleDuration,
    moduleName: _selfModuleFooter.pageData.moduleName,
    // templateSystemName: _selfModuleFooter.pageData.thisTemplate && _selfModuleFooter.pageData.thisTemplate.systemName || null
    template: _selfModuleFooter.pageData.thisTemplate || null
  }

  Session.set("Module.statsObj", statsObj)

  if(!Session.get("Modules.template.comp.done") && 
      _selfModuleFooter.pageData.thisTemplate 
      && _selfModuleFooter.pageData.thisTemplate._id 
      && _selfModuleFooter.pageData.thisTemplate.systemName !== '') {
    //-- do nothing as it should be done inside the Comp Template


  } else {

    let 
      _iframe = $('.sproutvideo-player'),
      _iframeSrc = $(_iframe).attr('src'),
      _videoId = '',
      _player = null;

    if(_iframeSrc) {
      _videoId = _iframeSrc.split('embed/')[1].split('/')[0]
      
      if(_videoId !== '') {
      // if(_videoId !== '' && (typeof SV !== 'undefined')) {
        _player = new SV.Player({videoId: _videoId})
      }
    }

    if(!_selfModuleFooter.pageData.progressOption) { //-- whether to proceed only when the page is fully done.
   
      upsertUserStats.call(statsObj, (err, res) => {
        if(err) {}
        else {        
          Session.set('myUserStats', res)
          //-- This should be delayed. Otherwise, the page title 
          //-- will change to the viewed style immediated it's open.
          // _selfModule.pages = res.pages 
        }
      })

      if(_player) {
        // let player = new SV.Player({videoId: videoId})

        _player.bind('ready', function() {
          
          // console.log("AAA");

          //   let 
          //   _iframe = $('.sproutvideo-player')[0];        
          //   _button = _iframe.contents().find('.player-mobile-muted')[0];
          // _button.trigger("click");

          // console.log(_iframe, _button);
          Session.set("ModuleFooter.player.ready", true);

        })
        
        _player.bind('completed', function() {
          
          // $('.btn-module-navigation.btn-go-next').not('.btn-disabled').webuiPopover('show'); //-- unsafe-inline issue
          // toastr.success("Click 'Next' To Proceed"); //-- instead, use this

          if($('.btn-module-navigation.btn-go-next').hasClass('btn-disabled')) {
            // $('#module_complete_modal').modal('show')
            _assignSimulationToThisUser(_selfModuleFooter.pageData.moduleId, statsObj)
          } else {
            toastr.success("Click 'Next' To Proceed"); //-- instead, use this
          }

          Session.set("ModuleFooter.video.status", 'completed');
        })
        
        _player.bind('progress', function(e) {          
          if(!$('.dummy-to-focus').is(':focus')) { 
            $('.dummy-to-focus').focus()
          }

          // console.log('aaa', e)

          Session.set("ModuleFooter.video.status", 'progress');
        })

        _player.bind('pause', function() {
          if(!$('.dummy-to-focus').is(':focus')) {
            $('.dummy-to-focus').focus()
          }
          // console.log('acac')

          Session.set("ModuleFooter.video.status", 'pause');
        })

      } //-- if(_player) {

    } //-- if(!_selfModuleFooter.pageData.progressOption) {
    else {
        
      if(_player) {
        // let player = new SV.Player({videoId: videoId})

        _player.bind('ready', function() {
          
          // console.log("BBB",  $('.sproutvideo-player')[0].contents().find('.player-mobile-muted'));

          // let 
          //   _iframe = $('.sproutvideo-player')[0];        
          //   _button = _iframe.contents().find('.player-mobile-muted')[0];

          // console.log("BBB1",  _iframe, _button);
          // _button.trigger("click");

          // console.log(_iframe, _button);

          Session.set("ModuleFooter.player.ready", true);

        })

        _player.bind('completed', function() {
          
          upsertUserStats.call(statsObj, (err, res) => {
            if(err) {}
            else {
              Session.set('myUserStats', res)
              //-- This should be delayed. Otherwise, the page title 
              //-- will change to the viewed style immediated it's open.
              // _selfModule.pages = res.pages 

              // $('.btn-module-navigation.btn-go-next').not('.btn-disabled').webuiPopover('show'); //-- unsafe-inline issue
              // toastr.success("Click 'Next' To Proceed"); //-- instead, use this

              if($('.btn-module-navigation.btn-go-next').hasClass('btn-disabled')) {
                // $('#module_complete_modal').modal('show')

                _assignSimulationToThisUser(_selfModuleFooter.pageData.moduleId, statsObj)
              } else {
                toastr.success("Click 'Next' To Proceed"); //-- instead, use this
              }            
              
            }
          }) 

          Session.set("ModuleFooter.video.status", 'completed');
          
        }) 

        _player.bind('progress', function(e) {
          $('.dummy-to-focus').focus()
          
          // console.log('bbb', e)
          Session.set("ModuleFooter.video.status", 'progress');
        })

        _player.bind('pause', function(e) {
          $('.dummy-to-focus').focus()
          // console.log('bcbc', e)
          Session.set("ModuleFooter.video.status", 'pause');
        })
        

      }
    }
  }

  $('#module_complete_modal').on('hidden.bs.modal', function (e) {
    insertUserLog.call({uid: Meteor.userId(), msg: 'closing completion window', mid: _selfModuleFooter.pageData.moduleId, venue: 'module'})
  })

  if(_selfModuleFooter.pageData.index === 0) {
    $("#1st_page_modal").modal('show');
  }

})

Template.ModuleFooter.helpers({
  getAroundGMute() {
    if(Session.get("ModuleFooter.player.ready")) {

      let 
      _iframe = $('.sproutvideo-player')[0];        
      _button = $(_iframe).contents().find('.player-mobile-muted')[0];

      console.log("getAroundGMute => ", _iframe, _button);
      _button.trigger("click");
    }
  },
  finishCompletionProgress() {
      $(".progress-distributing > .progress-bar").css("width", "100%")

      __completionPercent = 0
      clearInterval(__completionTimer)
  },
  endCompletionProgress() {
      // $(".progress-distributing > .progress-bar").css("width", "100%")
      bootbox.hideAll()

      __completionPercent = 0
      clearInterval(__completionTimer)
  },
  myDuration() {
    if(Session.get("ModuleFooter.module.duration")) {
      return Session.get("ModuleFooter.module.duration");
    }
  },
  initTimer() {
    if(Session.get("ModuleFooter.pageKeyObj")) {
      let
        _pageKeyObj = Session.get("ModuleFooter.pageKeyObj"),
        _userId = _pageKeyObj.userId,
        _userIdKey = _userId+'dQk',
        _moduleId = _pageKeyObj.moduleId,
        _pageId = _pageKeyObj.pageId,
        _moduleKey = _pageKeyObj.moduleKey,
        _pageKey = _pageKeyObj.pageKey;

      if(_userId && _moduleId && _pageId && _pageKey) {

        try {

          if(!___isDemo) {

            let 
              // _timerRef = _fbdb.ref('tr_timer_log').child(_userId).child(_moduleId).child(_pageId).child('t');
              // _moduleRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId),
              _moduleTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child('t'),
              _moduleVideoTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child('vt'),
              _pageVideoTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child(_pageId).child('vt'),//.equalTo(_auth.currentUser.uid),
              _pageTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child(_pageId).child('t');//.equalTo(_auth.currentUser.uid);              

            // console.log("Auth.CurrentUser => ", _auth.currentUser);

            // let _forceRef = __fbdb.ref('tr_timer_log').child('ef7DnMJgTHztTSXAWdQk').child('GtNsWGrWYpsWFS7Kf'); //-- caution: this erases all other page children
            // _forceRef.set({t: 9573, vt: 5160})

            // let _forceRef = __fbdb.ref('tr_timer_log').child('RhCKr4BuKdt3f3GTsdQk').child('DPhkauJm23Zi3ntQr').child('t'); //-- use this to update module timer data       
            // _forceRef.set(9573)

            let _userStat = Session.get("myUserStats");

            _moduleFooterPageTimer = Meteor.setInterval(function() {
              //-- this is what we can try instead of firebase.database.ServerValue.increment   
              _moduleTimerRef.transaction(function (t) {
                if (!t) {
                  //-- if timer does not exist, we apparently don't have any comments yet
                  t = 0;
                }
                t = t + 1;
                return t;
              },function(e) {
                // console.log("transaction callback on module timer => ", e)

                if(_userStat && (!_userStat.timer_old || (_userStat.timer_old && !_userStat.timer_old.tr) )) {
                  _moduleTimerRef.once('value', function (snapshot) {
                    // console.log("t => ", snapshot.val()); 
                    // if(!snapshot.val()) {              
                    let _v = snapshot.val();
      
                    // _v = null;
                    // console.log(_v)
      
                    if(!_v) {              
                      toastr.error("Your training session is not stable. Please try again.");
                      insertUserLog.call({uid: _userId, error: e, msg:'SR: module timer issue '})
      
                      FlowRouter.go("/signout");
                    }
                  });
                }             
              }, false);          
              
              _pageTimerRef.transaction(function (t) {
                if (!t) {
                  //-- if timer does not exist, we apparently don't have any comments yet
                  t = 0;
                }
                t = t + 1;
                return t;
              });
              
              let _videoStatus = Session.get("ModuleFooter.video.status");
              // console.log(_videoStatus);

              if(_videoStatus && _videoStatus === 'progress') {
                _moduleVideoTimerRef.transaction(function (t) {
                  if (!t) {
                    //-- if timer does not exist, we apparently don't have any comments yet
                    t = 0;
                  }
                  t = t + 1;
                  return t;
                });            
                _pageVideoTimerRef.transaction(function (t) {
                  if (!t) {
                    //-- if timer does not exist, we apparently don't have any comments yet
                    t = 0;
                  }
                  t = t + 1;
                  return t;
                });

                // _moduleVideoTimerRef.once('value', function (snapshot) { //-- not working correctly for some reason, only gets '1'
                //   console.log("vt => ", snapshot.val()); 
                // });             
              }        

            }, 1000)          

          }

        } catch(e) {
          console.log(e);
          FlowRouter.go('/signout')
        }

      } //-- if(_moduleId && _pageId && _pageKey) {

    }
  },
  resetFBTimer() {
    Meteor.clearInterval(_moduleFooterTimer);
    Meteor.clearInterval(_moduleFooterPageTimer);
    Meteor.clearInterval(_moduleFooterVideoTimer); 
    Session.set("ModuleFooter.video.status", null);
  }    
})

Template.ModuleFooter.events({
  'click .btn-re-review'(e, tpl) {
    e.preventDefault();

    // let moduleKey = Session.get('startModuleKey')
    // let key = FlowRouter.getParam('key')
    // let moduleId = Session.get('startModuleId')

    // console.log(moduleKey, key, moduleId);

    $('.modal-backdrop.fade').remove()
    Session.set("Module.currentPageIdx", 0)

    // FlowRouter.go("/modules/"+key);
    Template.Module.__helpers.get("remoteJumpToPage").call();

  },
  'click .btn-take-me-to-modules'(e, tpl) {
    e.preventDefault()
    insertUserLog.call({uid: Meteor.userId(), msg: 'closing completion window: moving to modules home', mid: _selfModuleFooter.pageData.moduleId, venue: 'module'})

    $('.modal-backdrop.fade').remove()

    FlowRouter.go('/modules')
  },
  'click .btn-take-me-to-app'(e, tpl) {
    e.preventDefault()
    insertUserLog.call({uid: Meteor.userId(), msg: 'closing completion window: moving to app site', mid: _selfModuleFooter.pageData.moduleId, venue: 'module'})

    $('.modal-backdrop.fade').remove()

    // window.location.href="https://app.craassessments.com";
    window.location.href = _gateURL;
  }  
})

Template.ModuleFooter.onDestroyed(function() {
  // Meteor.clearInterval(_moduleFooterTimer);
  // Meteor.clearInterval(_moduleFooterPageTimer);
  // Meteor.clearInterval(_moduleFooterVideoTimer); 
  // Session.set("ModuleFooter.video.status", null);
  Template.ModuleFooter.__helpers.get("resetFBTimer").call();
})

// async function _assignSimulationToThisUser(moduleId, pageObj) {
function _assignSimulationToThisUser(moduleId, pageObj) {
  // console.log(moduleId)

// console.log(obj)

  let _elem = `
      <div class="progress progress-striped active progress-completing">
          <div class="progress-bar"></div>
      </div>
      <div class="progress-completing-message">Your training session is being submitted...please wait...</div>                          
  `
  var dialog = bootbox.dialog({
      className: "modal-progress-completing",
      // message: '<p class="text-center"><i class="fa fa-spin fa-spinner"></i> Distributing...please wait...</p>'
      // title: "Distributing...please wait...",
      message: _elem,
      closeButton: false
  }); 

  runCompletionProgress()

  let user = Meteor.user();

  let obj = {
    user_id: user._id,
    client_id: user.profile.clientId, // || user.profile.clients[0]._id,
    bu_id: user.profile.buId,
    module_id: moduleId,
    email: user.emails[0].address,
    manager_id: user.profile.managerId,
    manager_name: user.profile.managerName,
    moduleDuration: pageObj.moduleDuration,
    moduleName: pageObj.moduleName,
    fullname: user.profile.fullname,
    ts: {
      mt: 0,
      mvt:0
      // pt: 0,
      // pvt: 0
    }    
  }

  // console.log(obj)
  __assignSim();

  function __getFBTimeData() {

    try {

      Template.ModuleFooter.__helpers.get("resetFBTimer").call();

      if(Session.get("ModuleFooter.pageKeyObj")) {
        
        let
          _pageKeyObj = Session.get("ModuleFooter.pageKeyObj"),
          _userId = _pageKeyObj.userId,
          _userIdKey = _userId+'dQk',
          _moduleId = _pageKeyObj.moduleId;
          // _pageId = _pageKeyObj.pageId,
          // _moduleKey = _pageKeyObj.moduleKey,
          // _pageKey = _pageKeyObj.pageKey;

        if(__fbdb && _userId && _userIdKey && _moduleId) {

          let 
          // _timerRef = _fbdb.ref('tr_timer_log').child(_userId).child(_moduleId).child(_pageId).child('t');
          // _moduleRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId),
          _moduleVideoTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child('vt'),
          _moduleTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child('t');
          // _pageVideoTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child(_pageId).child('vt'),//.equalTo(_auth.currentUser.uid),
          // _pageTimerRef = __fbdb.ref('tr_timer_log').child(_userIdKey).child(_moduleId).child(_pageId).child('t');//.equalTo(_auth.currentUser.uid);   

          // async () => {
          //   let _myMt = await _moduleTimerRef.once("value", function(data) {
          //   // do some stuff once
          //   // console.log(data.val())
          //   // obj.mt = data.val();    
          //     return data.val()   
          //   }); 

          //   console.log(_myMt);
          //   obj.mt = _myMt
          // }
          
          // console.log(obj.mt);
          // obj.mt = _mt;

          let promises = [];
          let _mt = _moduleTimerRef.once("value", function(data) {
            return data.val()
          });
          let _mvt = _moduleVideoTimerRef.once("value", function(data) {
            // do some stuff once
            // console.log(data.val())
            // obj.mvt = data.val();  
            return data.val()
          });

          promises.push(_mt)
          promises.push(_mvt)
          // console.log(_mvt)
          // obj.mvt = _mvt;
          // _pageTimerRef.once("value", function(data) {
          //   // do some stuff once
          //   console.log(data.val())
          //   obj.pt = data.val();
          // });      
          // _pageVideoTimerRef.once("value", function(data) {
          //   // do some stuff once
          //   console.log(data.val())
          //   obj.pvt = data.val();
          // });

          // Promise.all(promises).then((snapshots) => {
          //   // console.log(data)
          //   if(snapshots && snapshots.length > 0) {
          //     obj.ts.mt = snapshots[0] || 0;
          //     obj.ts.mvt = snapshots[1] || 0;

          //     __assignSim();
          //   }

          // })

          // let _snapshots = await Promise.all(promises)
          // // console.log(_snapshots)
          // if(_snapshots && _snapshots.length > 0) {
          //   obj.ts.mt = _snapshots[0].val() || 0;
          //   obj.ts.mvt = _snapshots[1].val() || 0;          
          // }     

        } else { //-- if(Session.get("ModuleFooter.pageKeyObj")) {
          insertUserLog.call({uid: Meteor.userId(), msg: 'SR: completion process error1', mid: moduleId, venue: 'module'})   
          __assignSim();
        }
      } else { //-- if(__fbdb && _userId && _userIdKey && _moduleId) {
        insertUserLog.call({uid: Meteor.userId(), msg: 'SR: completion process error2', mid: moduleId, venue: 'module'})   
        __assignSim();
      }

    } catch(e) {
      console.log("SR: completion process error0 => ", e)
      // toastr.error("We're sorry. Something went wrong. Please go back to the Modules page and come back to complete.")
      // Template.ModuleFooter.__helpers.get('endCompletionProgress').call()    
      insertUserLog.call({uid: Meteor.userId(), msg: 'SR: completion process error0', mid: moduleId, venue: 'module'})    
      __assignSim();    
    }

  } //-- function __getFBTimeData() {

  // __assignSim();

  function __assignSim() {

    // console.log(obj);

    Meteor.call('assignSimulation', obj, (err, res) => { //-- see admin-all-users.js
      if(err) {
        toastr.error("We're sorry. Something went wrong. Please go back to the Modules page and come back to complete.")
        Template.ModuleFooter.__helpers.get('endCompletionProgress').call()
        insertUserLog.call({uid: Meteor.userId(), msg: 'SR: sim assign method error', mid: moduleId, venue: 'module'})
      } else {

        // console.log(res);

        if(res && ((res.success && res.data === 1) //-- when sim is added successfully
            || res.current)) { //-- when sim was added and/or there's a sim the user is already taking...
          // console.log(res)

          bootbox.hideAll()
          Template.ModuleFooter.__helpers.get('finishCompletionProgress').call()
          $('#module_complete_modal').modal('show')
          insertUserLog.call({uid: Meteor.userId(), msg: 'sim assigned', mid: moduleId, venue: 'module'})

        } else {
          // res.short = true;
          if(res && res.data === -1) { //-- no sim settings for this user
            bootbox.hideAll()
            Template.ModuleFooter.__helpers.get('finishCompletionProgress').call()
            if(res.short) {
              $('#short_time_modal').modal('show')
              insertUserLog.call({uid: Meteor.userId(), msg: 'short time', mid: moduleId, venue: 'module'})
            } else {
              $('#module_complete_modal').modal('show')
              insertUserLog.call({uid: Meteor.userId(), msg: 'no sim to assign', mid: moduleId, venue: 'module'})
            }
          } else {
            toastr.error("We're sorry. Something went wrong. Please go back to the Modules page and come back to complete.")
            Template.ModuleFooter.__helpers.get('endCompletionProgress').call()
            insertUserLog.call({uid: Meteor.userId(), msg: 'SR: sim assign error', mid: moduleId, venue: 'module'})
          }
        }
      }

      Template.ModuleFooter.__helpers.get("resetFBTimer").call();
    })

  } //-- function __assignSim() {
}

function runCompletionProgress() {    
    __completionTimer = setInterval(function() {

        // increment progress bar
        __completionPercent += 2;
// console.log(__completionPercent)
        if(__completionPercent < 99) {
            $(".progress-completing > .progress-bar")
            .css("width", __completionPercent + "%")
            .text(__completionPercent + " %");
        }

    }, 100);    
}
