/**
 * Modules Template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'

import { ReactiveVar } from 'meteor/reactive-var'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModuleUsers } from '/both/api/collections/training-module-users.js'
import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'
import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js';

import { canTakeThisModule  } from '/both/api/methods/training-modules.js'
import { upsertUserStats, updateUserStatsPages,  } from '/both/api/methods/training-module-user-stats.js'

import { insertUserLog } from '/both/api/methods/training-module-user-logs.js'

import { usersProfileOnlineUpdate, usersProfileViewedTutorialUpdate } from '/both/api/methods/admin-all-users.js'

import { Util } from '/imports/api/lib/util.js'

// import '/imports/ui/stylesheets/modules/modules.less'
import { Modules } from '/imports/ui/pages/modules/modules.html'

import { ModuleHowTo } from '/imports/ui/pages/documents/module-how-to.js'

let _selfModules
let _subsModules

Template.Modules.onCreated(function modulesOnCreated() {
  _selfModules = this

  _subsModules = new SubsManager()

  _selfModules.ready = new ReactiveVar()
  _selfModules.ready4Stats = new ReactiveVar()
  _selfModules.hasModules = new ReactiveVar(false)

  let me = Meteor.user(), myTrainingModules = []

  // console.log(me)
  if(me && me.profile) {
    myTrainingModules = me.profile.trainingModules || []
     //-- back on (11/22/2022)
    if(me.profile.viewedTutorial) {
      Session.set('viewedTutorial', true)
    }

    //-- all of a sudden, ICON users started having an issue w/ this (11/21/2022)
    //-- back on (11/22/2022)
    // Session.set("viewedTutorial", true) ;    

    let _isDemoTrainingUser = Util.isDemoTrainingUser(me);
    // console.log(_isDemoTrainingUser)
    if(_isDemoTrainingUser) {
      Session.set("Modules.isDemoTrainingUser", _isDemoTrainingUser);
    }
  }

  Session.set('myTrainingModules', myTrainingModules)

  Tracker.autorun(() => {

    // let handleModules = _subsModules.subscribe('all_active_training_modules')
    // _selfModules.ready.set(handleModules.ready())
    // let handleModules = _subsModules.subscribe('training_modules_w_uid', Meteor.userId())
    let handleModules = _subsModules.subscribe('training_modules_w_ids', Session.get('myTrainingModules'))
    _selfModules.ready.set(handleModules.ready())

    if(Meteor.userId()) {
      let handleUserStats = _subsModules.subscribe('training_module_user_stats_w_uid', Meteor.userId())
      _selfModules.ready4Stats.set(handleUserStats.ready()) 
    }

  })  

  Session.set('startModuleId', null)
  Session.set('startModuleName', null)

})

Template.Modules.onRendered(function modulesOnRendered() {
    // let i = 0
    // _selfModules.userProgressBarInterval = setInterval(() => {
    //   if(i < 90){
    //     i++;
    //     $(".modules-container .user-stats-progress-bar").css("width", i + "%").text(i + " %");
    //   }      
    // }, 50) 

    // setContainerWidth(); 
// console.log(Session.get('viewedTutorial'))

  Tracker.autorun(() => {
    if(Session.get('viewedTutorial')) {
      // console.log(Session.get('viewedTutorial'))
      $('.module-container').css({
        opacity: 1
      })

      $('.btn-start-module').prop('disabled', false)      

    }    
  })


  // $('#moduleHowToVideoModal').on('shown.bs.modal', function (e) {
  //   // do something...
  //       let _video = `
  //   <div style='position:relative;height:0;padding-bottom:56.158663883089766%'>
  //     <iframe class='sproutvideo-player' src='//videos.sproutvideo.com/embed/4c9adabf1b1cecc7c4/37b3277ff9a6fb22?playerTheme=dark&playerColor=2f3437' style='position:absolute;width:100%;height:100%;left:0;top:0' frameborder='0' allowfullscreen></iframe>
  //   </div> 
  //       `    
  //     $('#moduleHowToVideoModalSrc').append(_video)
  // })

  $(".grecaptcha-badge").css({
      width: '1px',
      height: '1px'
  }); //-- privacy policy has reCAPTCHA v2, so, it's better to hide v3 badge...  

})

Template.Modules.helpers({
  isDemoTrainingUser() {
    if(Session.get("Modules.isDemoTrainingUser")) {
      return Session.get("Modules.isDemoTrainingUser");
    }
  },
  Modules() {
    if(_selfModules.ready.get()) {
      let modules = TrainingModules.find({
        _id: {$in: Session.get('myTrainingModules')}
      }).fetch()
  
      if(modules.length === 0) {
        _selfModules.hasModules.set(false)
      } else {
        _selfModules.hasModules.set(true)

        // console.log(modules);

        modules.sort((a,b) => {
          return a.order - b.order;
        })
        let _myModules = [];

        modules.forEach((m,i) => {

          canTakeThisModule.call({
            userId: Meteor.userId(),
            moduleId: m._id,
            moduleName: m.name
          }, (err, res) => {
            
            m['canTake'] = res;

            _myModules.push(m);
            // console.log(_myModules)
            if(i === modules.length-1) {              
              Session.set("Modules.myModules", _myModules);           
              // return _myModules;
            }            
          });
          

        })

        // console.log(_myModules);
        // // return modules;
        // return _myModules;
      }      
    }
  },
  MyModules() {
    if(Session.get("Modules.myModules")) {
      // console.log(Session.get("Modules.myModules"));
      return Session.get("Modules.myModules");
    }
  },
  TutorialVideo() {
    return TrainingVideos.findOne('FxNoioJpQ2EHDsTxS')
  },
  hasModules() {
    return _selfModules.hasModules.get()
  },
  viewedTutorial() {
    return Session.get("viewedTutorial")
  },
  Stats() { //-- called from the template

    let 
      // dur = this.duration || '00:00:00',
      dur = this.duration || '00:00',
      statMsg = this.numPages ? '0/'+ this.numPages + '(0%)' : '(0%)',
      mine = 0;

    if(this.duration) {
      let _durs = this.duration.split(":");
      dur = _durs[0] + ':' + _durs[1];
    }

    if(_selfModules.ready4Stats.get()) {

      let 
        moduleId = this._id,
        duration = this.duration;   
        
      let userId = Meteor.userId();

      let stats = TrainingModuleUserStats.findOne({
        userId: userId,
        moduleId: moduleId
      })

      let summary = TrainingStatusSummary.findOne({
        userId: userId,
        moduleId: moduleId
      })

      let _trainingStatus = null;
      // console.log(summary)
      if(summary) {
        _trainingStatus = summary.trainingStatus || null;
      }

      // if(_trainingStatus === "Started" || _trainingStatus === "Completed") {
      //   Session.set("Modules.moduleToTake", moduleId);
      // }
      // console.log(summary, _trainingStatus)

      let percent = 0
      if(stats && stats.pages) {
        mine =  stats.pages.length-1
        
        let all = this.numPages;
        percent = Math.round((stats.pages.length-1)/all*100)

        if(percent === 100 && _trainingStatus !== 'Completed') {
          mine = mine -1;
          percent = percent -1;
        }
        // if(!$("#modules_user_progress_bar_"+moduleId).hasClass('active')) {
        //   let i = 0
        //   _selfModules.userProgressBarInterval = setInterval(() => {
        //     if(i < percent){
        //       i++;
        //       // $(".modules-container .user-stats-progress-bar").css("width", i + "%").text(i + " %");
        //       $("#modules_user_progress_bar_"+moduleId).css("width", i + "%").text(i + " %");
        //     }      
        //   }, 50) 

        //    $("#modules_user_progress_bar_"+moduleId).addClass('active')
        // }

        // dur = duration || '00:00:00'
        statMsg = mine + '/' + all + ' (' + percent + '%)'

        // return mine + '/' + all + ' (' + percent + '%) ['+duration+']'

        // return {duration: dur, progress: statMsg}

        // if(mine > 0) { //-- not working
        //   $('#start_or_continue_'+moduleId).html('Continue');
        // } else {
        //   $('#start_or_continue_'+moduleId).html('Start');
        // }
      }

      // if(percent === 100) {
      //   console.log(percent, this._id)
      //   let elem = `<div class="ribbon ribbon-top-right"><span>Completed</span></div>`
      //   $("#li_module_"+this._id+ " > .module-container").prepend(elem)
      // }

      let _short = stats && stats.short || false;

      // let _trStatus = 

      return {duration: dur, progressRaw: percent, progress: statMsg, mine: mine, short: _short, status: _trainingStatus}
    }

    // return {duration: dur, progress: statMsg}
  }
})

Template.Modules.events({
  'click .fa-short-time'(e, tpl) {
    e.preventDefault();

    alert("You have not spent enough time reviewing the pages of the training module.\n\nPlease re-review the training content when you have allocated enough time to review without rushing.");
  },
  'click .btn-start-module'(e, tpl) {
    e.preventDefault()

    if(Session.get('viewedTutorial')) {

      let 
        moduleId = $(e.currentTarget).data('mid'),
        moduleName = $(e.currentTarget).data('mname'),
        btnLabel = $(".start-or-continue").text();

      if(Meteor.user().profile.role === '6' && !Session.get("Modules.isDemoTrainingUser")) {

        canTakeThisModule.call({
          userId: Meteor.userId(),
          moduleId: moduleId,
          moduleName: moduleName
        }, (err, res) => {
          
          // console.log(err, res);

          if(err) {
            toastr.error("Something went wrong. Please sign-out and sign-in again. If the issue persists, please contact us at help@craassessments.com");
          } else if(res) {
            takeThisModule();
          } else {
            toastr.error("You can only take one Training Module at a time.<br><br>Please complete the Training Module and its associated Followup simulation before starting another training module.");
          }
        });

      } else {
        takeThisModule();
      }
      
      function takeThisModule() {

        let 
          _status = $(e.currentTarget).data("status"),
          _isCompleted = _status && parseInt(_status) === 1 ? true : false;

        if(Meteor.user()) {

          if(moduleId !== '') {

            toastr.clear();
            
            let userTRModules = Meteor.user().profile.trainingModules
            // let me = Meteor.users.findOne(Meteor.userId())
            // let userTRModules = me.trainingModules
    // console.log(Meteor.user(), userTRModules)
            if((userTRModules && userTRModules.indexOf(moduleId) !== -1) || Meteor.user().profile.role === '1') {

              let key = Util.genRandomURL(177)
              Session.set('startModuleKey', key)
              Session.set('startModuleId', moduleId)
              Session.set('startModuleName', moduleName)
              Session.set('moduleCompleted', _isCompleted)

              let statsObj = {          
                userId: Meteor.userId(),          
                // module: {
                //   moduleId: moduleId,
                //   pages: []
                // }
                moduleId: moduleId,
                // pages: []
              }

              upsertUserStats.call(statsObj, (err, res) => {
                if(err) {
                  toastr.error("Something went wrong. Please try again: " + err)
                } else {
                  if(res) {
                    // console.log(res)
                    Session.set('myUserStats', res)
                  }
                  FlowRouter.go('/modules/' + key)
                } 
              })
            } else {
              toastr.info("Please contact your line manager or us (at help@craassessments.com) to view this module.")          
              toastr.error("This training module has not been assigned to you.")          
            }
            
          }
        } else { //-- if(Meteor.user()) {
          let myModuleName = moduleName ? '"'+moduleName+'"' : '';
          alert("Please sign-in to view the module "+ myModuleName +".")
          FlowRouter.go('/signin')      
        }

      } //-- function takeThisModule() {

    } else {
      toastr.error("Please watch the turotial video before opening this training module.")
    }
  },
  'click .btn-start-tutorial'(e, tpl) {
    e.preventDefault()

    $('#moduleHowToVideoModal').on('hidden.bs.modal', () => {
      //-- This works for all media source.
      $("#moduleHowToVideoModal iframe").attr("src", $("#moduleHowToVideoModal iframe").attr("src"))
    })

    let _video = `
      <div class='videoWrapper'>
        <iframe class='sproutvideo-player' src='//videos.sproutvideo.com/embed/4c9adabf1b1cecc7c4/37b3277ff9a6fb22?playerTheme=dark&playerColor=2f3437' frameborder='0' allowfullscreen></iframe>
      </div> 
    `
    $('#moduleHowToVideoModalSrc').append(_video) //-- This is the solution on avoiding the first 10-second blurry issue

    let 
      iframe = $('.sproutvideo-player'),
      iframeSrc = $(iframe).attr('src'),
      videoId = '',
      player = null;

    if(iframeSrc) {
      videoId = iframeSrc.split('embed/')[1].split('/')[0]
      
      if(videoId !== '') {
        player = new SV.Player({videoId: videoId})

        if(player) {
          // let player = new SV.Player({videoId: videoId})

          player.bind('completed', function() {
            
            // let update = Meteor.users.update(Meteor.userId(), {
            //   $set: {
            //     'profile.viewedTutorial': true
            //   }
            // })            

            usersProfileViewedTutorialUpdate.call({
              uid: Meteor.userId(),
              status: true
            }, (err, res) => {

              if(res) {
                $('.module-container').css({
                  opacity: 1
                })

                Session.set("viewedTutorial", true) ;                 
              }

            })

            // if(update) {
            //   $('.module-container').css({
            //     opacity: 1
            //   })

            //   Session.set("viewedTutorial", true)              
            // }
            
          })          
        }


      }
    }

    insertUserLog.call({uid: Meteor.userId(), msg: "tutorial-video", venue: 'modules'})

  },
  // 'click #iframe-video-tutorial'(e, tpl) {
  //   e.preventDefault()

  //   $('#moduleHowToVideoModal').on('hidden.bs.modal', () => {
  //     //-- This works for all media source.
  //     $("#moduleHowToVideoModal iframe").attr("src", $("#moduleHowToVideoModal iframe").attr("src"))
  //   })

  //   let update = Meteor.users.update(Meteor.userId(), {
  //     $set: {
  //       'profile.viewedTutorial': true
  //     }
  //   })

  //   if(update) {
  //     $('.module-container').css({
  //       opacity: 1
  //     })

  //     $('.btn-start-module').prop('disabled', false)
  //   }
  // }  
})


// $(window).resize(function(){
//    setContainerWidth();
// });

function setContainerWidth()
{
    $('.modules-container').css('width', 'auto'); //reset
    var windowWidth = $(document).width();
    var blockWidth = $('.module-container').outerWidth(true);
    var blockHeight = $('.module-container').height();    

    if(blockWidth) {      
      let numOfModules = $('.module-container').length
      var maxBoxPerRow = Math.floor(windowWidth / blockWidth);    
      $('.modules-container').width(maxBoxPerRow * blockWidth);
      $('.modules-container').height(blockHeight * Math.floor(numOfModules/maxBoxPerRow));

      console.log(blockHeight, numOfModules, maxBoxPerRow)
    }
}

