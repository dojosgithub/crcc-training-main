import { Session } from 'meteor/session'

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/analytics';

if(!___isDemo) {
  if (!firebase.apps.length) {
    try {
        import { FBDBConfig } from '/both/startup/config/db-config.js';
        firebase.initializeApp(FBDBConfig);
        firebase.analytics();

        __fbdb = firebase.database()
    } catch (err) {
        console.log(err)
    }
  }
}

// firebase.initializeApp(FBDBConfig);

import { _gateURL, _adminURL, _portalURL, _pfizerAdminURL } from '/both/startup/config/craa-urls.js';

// console.log("gateUrl: ", _gateURL);

if(Meteor.isServer) {
        // FastRender.route('/', function() {
        // });

        // FastRender.route('/signin', function() {
        // });

    // inject a css file, to style the loading screen
    // Inject.rawHead('loadingScripts', '  <meta name="keywords" content="CRA Assessments, CRA performance, pharmaceutical research, CRA training, pharmaceutical research professionals">'+ "\n" +
    Inject.rawHead('loadingScripts', '  <meta name="keywords" content="CRA Assessments, CRA performance, pharmaceutical research, CRA training, pharmaceutical research professionals, CRA monitoring quality">'+ "\n" +
                                     // '  <meta name="description" content="CRA Assessments is a more objective and cost effective method for evaluating CRA performance. The performance information provided by the Assessment can be used by pharmaceutical research professionals to determine whether or not CRAs meet the desired performance levels, training requirements, and remediation needs of any current or potential CRAs.">'+ "\n" +
                                     '  <meta name="description" content="CRA Assessments is a more objective and cost effective method for assessing CRA monitoring quality and evaluating CRA performance. The performance information provided by the Assessment can be used by pharmaceutical research professionals to determine whether or not CRAs meet the desired performance levels, training requirements, and remediation needs of any current or potential CRAs.">'+ "\n" +
                                     '  <meta http-equiv="cleartype" content="on">'+ "\n" +
                                     '  <meta name="referrer" content="origin">'+ "\n" +
                                     '  <meta name="MobileOptimized" content="320">'+ "\n" +
                                     '  <meta name="HandheldFriendly" content="True">'+ "\n" +
                                     '  <meta name="apple-mobile-web-app-capable" content="yes">' + "\n" +
                                     '  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">'+ "\n" +
                                     '  <script type="text/javascript" src="https://c.sproutvideo.com/player_api.js"></script>  '+ "\n" +
                                     '  <script src="https://www.google.com/recaptcha/api.js?render=6LdQG_wUAAAAAMup-zrZwo0u8R1HCyayc4_SeFy7"></script>' + "\n" +
                                     '  <link rel="icon" href="/favicon.ico?v=2" />');
                                    // '  <link class="inject-loading-container" rel="stylesheet" href="loading.css">');

    // inject HTML into the body, to make up the screen
    Inject.rawBody('loadingBody',   '  <div class="row row-inject-loading">'+ "\n" +
                                    '  <div class="col-md-offset-4 col-md-4 col-inject-loading">'+ "\n" +
                                    '  <div class="inject-loading-container">'+ "\n" +
                                    '   <div id="loader-wrapper">'+ "\n" +
                                    '       <div id="loader"></div>'+ "\n" +
                                    '   </div>'+ "\n" +
                                    //'    <h1>'+ "\n" +
                                  '    <div id="loader-text-craa">'+ "\n" +
                                    '      CRA TRAINING'+ "\n" +
                                    '    </div>'+ "\n" +                                     
                                    '    <div id="loader-text-inside">'+ "\n" +
                                    '      Loading...thank you for your patience. It may take a few more seconds to get the site ready for you.'+ "\n" +
                                    '    </div>'+ "\n" +
                                    //'    </h1>'+ "\n" +                                   
                                    '  </div></div></div>');

    /**
    Moves all javascripts to the end of the body, so we can inject the loading screen
    */
    Inject.rawModHtml('moveScriptsToBottom', function(html) {
        // get all scripts
        var scripts = html.match(/<script type="text\/javascript" src.*"><\/script>\n/g);

        // if found
        if(!_.isEmpty(scripts)) {
            // remove all scripts
            html = html.replace(/<script type="text\/javascript" src.*"><\/script>\n/g, '');
            // add scripts to the bottom
            html = html.replace(/<\/body>/, scripts.join('') + '\n</body>');
            return html.replace(/[\n]+/g,"\n").replace(/ +/g,' ');

        // otherwise pass the raw html through
        } else {
            return html.replace(/[\n]+/g,"\n").replace(/ +/g,' ');
        }
    });    
}

import { insertLog } from '/both/api/methods/training-module-logs.js'
import { insertUserLog } from '/both/api/methods/training-module-user-logs.js'

// import { TrainingModuleSettings } from '/imports/api/collections/training-module-settings.js'
// import { TrainingModuleUsers } from '/imports/api/collections/training-module-users.js'

//-- User route group
const userRoutes = FlowRouter.group({
  prefix: '',
  name: 'user',
  triggersEnter: [function(context, redirect) {

  }],
  subscriptions: function() {
    
      // if(Meteor.userId()) {
      //   let uid = Meteor.userId()
      //   Meteor.subscribe('training_module_settings_w_uid',uid)
      // } 
  },
  action: function() {
     
  }
})

//-- Default route
userRoutes.route('/', {  
    action() {

      // console.log(___isDemo);
      let loginState = LoginState.get("_rlarbdhksqkrrmsdo");

      // console.log("loginState: ", loginState);

      if(___isDemo) {
        FlowRouter.go("/home");
      }
      else if(loginState) {

          Meteor.call("Account.getLoginToken", {
              userId: loginState.userId
          }, (err, res) => {
              // console.log(err, res)

          //   if(res && res[0] && res[0].hashedToken) {
              if(res) {
              //   let _token = res[0].hashedToken;
                  let _token = res;

                  // console.log("Token: ", _token)
                  Meteor.loginWithToken(_token, (err) => {
                      // console.log(result);
                      
                      // console.log("loginWithToken Err: ", err);
                    
                      // if(err) {
                          //-- do nothing, so that sign-in page can be loaded
                      // } else {
                          // console.log(Meteor.user())
                          FlowRouter.go("/home");
                      // }
                  })                
              }
          //   FlowRouter.go("/portal");
          })
      } else {

        // import('/imports/ui/pages/home/home.js').then(home => {
        //   document.title = "CRAA Training Home"
        //   BlazeLayout.render('Layout', {Header: 'Header', Leftbar: '', Main: 'Home', Rightbar: '', Footer: 'Footer'})

        //   insertLog.call({uid: Meteor.userId(), venue: '/'})
        //   insertUserLog.call({uid: Meteor.userId(), venue: '/'})
        // })
// console.log("isDemo:  ", ___isDemo)

        if(!___isDemo) {
          if(Meteor.settings.public.pfizer) {
            window.location.href = Meteor.settings.public.pfizer[process.env.NODE_ENV].gateURL;
          } else {
            // console.log("gateUrl2: ", _gateURL)
           // AYAZ: Commented the below line to prevent the redirection and redirect user to signin
          //  window.location.href = _gateURL;
        FlowRouter.go("/signin");
          
          }
        }
      }

    }
})

//- Main homepage
userRoutes.route('/home', {
    action() {        
      
//       let mySettings = TrainingModuleSettings.find({
//         userId: Meteor.userId()
//       }).fetch()      

//       Session.setPersistent('mySettings', mySettings)
// // console.log(Session.get("mySettings"))     
// console.log('1') 
// console.log(Session.get("mySettings"))
      import('/imports/ui/pages/home/home.js').then(home => {
        document.title = "CRAA Training Home"
        BlazeLayout.render('Layout', {Header: 'Header', Leftbar: '', Main: 'Home', Rightbar: '', Footer: 'Footer'})

        insertLog.call({uid: Meteor.userId(), venue: 'home'})
        insertUserLog.call({uid: Meteor.userId(), venue: 'home'})
      })   
    }    
})

//- Sign-in
userRoutes.route('/signin', {
    subscriptions() {

    },
    action() {        
      
      import('/imports/ui/pages/accounts/signin.js').then(signin => {
        document.title = "Sign-in to CRAA Training System"
        BlazeLayout.render('Layout', {Header: 'Header', Leftbar: '', Main: 'SignIn', Rightbar: '', Footer: 'Footer'})

        insertLog.call({uid: Meteor.userId(), venue: 'sign-in'})
        insertUserLog.call({uid: Meteor.userId(), venue: 'sign-in'})
      })

    }    
})


//- Sign-out
userRoutes.route('/signout', {
    action() {        
      
      localStorage.removeItem('mstgs')

      insertLog.call({uid: Meteor.userId(), venue: 'sign-out'})
      insertUserLog.call({uid: Meteor.userId(), venue: 'sign-out'})

      Meteor.logout((err)=>{

        // insertLog.call({uid: Meteor.userId(), venue: 'signed-out'})
        // insertUserLog.call({uid: Meteor.userId(), venue: 'signed-out'})

        if(!___isDemo) {
            firebase.auth().signOut();
          
          // FlowRouter.go('/home')
          // window.location.reload();

          // console.log("isDemo signout:  ", ___isDemo)

          if(Meteor.settings.public.pfizer) {
            window.location.href = Meteor.settings.public.pfizer[process.env.NODE_ENV].gateURL;
          } else {        
            // window.location.href = _gateURL;
          FlowRouter.go("/signin")
          }

        } else {
          FlowRouter.go("/signin")
        }
        
      })
      
    }    
})

//- Settings
userRoutes.route('/settings', {
    action() {        
      
      if(Meteor.userId()) {
        import('/imports/ui/pages/settings/settings.js').then(settings => {
          document.title = "Personalization"
          BlazeLayout.render('Layout', {Header: 'Header', Leftbar: '', Main: 'Settings', Rightbar: '', Footer: 'Footer'})
        })
      } else {
        FlowRouter.go('/signin')
      }

      insertLog.call({uid: Meteor.userId(), venue: 'settings'})
      insertUserLog.call({uid: Meteor.userId(), venue: 'settings'})      
    }    
})

userRoutes.route('/simulations', {
  action: function() {
    if(Meteor.settings.public.pfizer) {
      window.location.href = Meteor.settings.public.pfizer[process.env.NODE_ENV].gateURL;
    } else {      
      window.location.href = _gateURL;
    }
  }
});

userRoutes.route('/craa-admin', {
  action: function() {
    if(Meteor.settings.public.pfizer) {
      window.location.href = Meteor.settings.public.pfizer[process.env.NODE_ENV].adminURL;
    } else {      
      window.location.href = _adminURL;
    }
  }
});

//- Modules
// userRoutes.route('/mockups', {
//     action() {        
      
//       if(Meteor.userId()) {
//         import('/imports/ui/mockups/mockups.js').then(mockup => {
//           document.title = "Training Modules"
//           BlazeLayout.render('Layout', {Header: 'Header', Leftbar: '', Main: 'Mockups', Rightbar: '', Footer: 'Footer'})
//         })
//       } else {
//         FlowRouter.go('/signin')
//       }
//     }    
// })

//- MockUps
// userRoutes.route('/mockups/:mid', {
//     action() {        
      
//       let module_id = FlowRouter.getParam('mid')

//       import '/imports/ui/mockups/module-header.js'
//       // import '/imports/ui/modules/module-rightbar.js'
//       import '/imports/ui/mockups/module2/slide9.js'

//       document.title = "Training Module " + module_id
//       BlazeLayout.render('Layout', {Header: '', Leftbar: '', Main: 'Slide9', Rightbar: '', Footer: 'Footer'})
//     }    
// })

//- MockUp page
// userRoutes.route('/mockups/:mid/:sid', {
//     action() {        
      
//       let module_id = parseInt(FlowRouter.getParam('mid'))
//       let slide_id = parseInt(FlowRouter.getParam('sid'))

//       // let slide = '/imports/ui/modules/module2/slide' + slide_id + '.js'
//       // import '/imports/ui/modules/module-header.js'
//       // import '/imports/ui/modules/module-rightbar.js'

//       if(module_id === 2) {
//         if(slide_id === 9) {
//           import '/imports/ui/mockups/mockup2/slide9.js'
//         }
//         else if(slide_id === 10) {        
//           import '/imports/ui/mockups/mockup2/slide10.js'
//         }
//       }
//       else if(module_id === 3) {
//         if(slide_id === 9) {
//           import '/imports/ui/mockups/mockup3/slide9.js'
//         }
//         else if(slide_id === 10) {        
//           import '/imports/ui/mockups/mockup3/slide10.js'
//         }        
//       }
//       else if(module_id === 4) {
//         if(slide_id === 9) {
//           import '/imports/ui/mockups/mockup4/slide9.js'
//         }
//         else if(slide_id === 10) {        
//           import '/imports/ui/mockups/mockup4/slide10.js'
//         }        
//       }

//       document.title = "Training Module " + module_id
//       BlazeLayout.render('Layout', {Header: '', Leftbar: '', Main: 'Module'+module_id+'_Slide'+slide_id, Rightbar: '', Footer: 'Footer'})
//     }    
// })

//-- List of all active modules 
userRoutes.route('/modules', {
  subscriptions: (params, queryParams) => {
    Meteor.subscribe('tutorial_video');
    if(Meteor.userId()) {    
      Meteor.subscribe('training_status_summary_w_uid', Meteor.userId());
    }
  },   
    action: function() {
      if(Meteor.userId()) {            

        import('/imports/ui/pages/modules/modules.js').then(modules => {
          Session.set('startModuleId', null)
          Session.set('startModuleName', null)  

          document.title = "Modules"
          BlazeLayout.render('Layout', {Header: 'Header', Leftbar: '', Main: 'Modules', Rightbar: '', Footer: 'Footer'})
        })
      } else {
        alert("Please sign in to view the CRAA Training Modules assigned to you.\n\nIf you have any questions, please contact us at help@craassessments.com")
        FlowRouter.go('/signin')
      }

      insertLog.call({uid: Meteor.userId(), venue: 'modules'})
      insertUserLog.call({uid: Meteor.userId(), venue: 'modules'})      

    }
})

//-- Start Module
userRoutes.route('/modules/:key', {
  subscriptions: (params, queryParams) => {
    // Meteor.subscribe('tutorial_video')
    // Meteor.subscribe('all_active_training_module_templates');    
  },  
    action: function() {

      let moduleKey = Session.get('startModuleKey')
      let key = FlowRouter.getParam('key')
      let moduleId = Session.get('startModuleId')
// console.log(moduleKey, moduleKey === key, moduleId)
      if(moduleKey === key && (moduleId && moduleId !== '')) {


// let mySettingsInit = localStorage.getItem('mstgs')
// let mySettings

// if(mySettingsInit) {
//   mySettings = JSON.parse(mySettingsInit)
// }
// console.log("1", mySettings)
// // let videoAutoplay = mySettings && mySettings.videoAutoplay || false
// let moduleTheme = mySettings && mySettings.moduleTheme || 'theme_default_center'

// if(moduleTheme && moduleTheme === 'theme_default_left') {
//   import '/imports/ui/stylesheets/modules/theme_default_left/module.scss'
//   import '/imports/ui/pages/modules/theme_default_left/module.html'
// }
// else if(moduleTheme && moduleTheme === 'theme_default_right') {
//   import '/imports/ui/stylesheets/modules/theme_default_right/module.scss'
//   import '/imports/ui/pages/modules/theme_default_right/module.html'
// }
// else if(moduleTheme && moduleTheme === 'theme_default_center') {
//   import '/imports/ui/stylesheets/modules/theme_default_center/module.scss'
//   import '/imports/ui/pages/modules/theme_default_center/module.html'
// } else {
//   import '/imports/ui/stylesheets/modules/theme_default_center/module.scss'
//   import '/imports/ui/pages/modules/theme_default_center/module.html'  
// }
      
        
        import('/imports/ui/pages/modules/module.js').then(module => {
          document.title = "Module: " + Session.get("startModuleName")
          BlazeLayout.render('Layout', {Header: '', Leftbar: '', Main: 'Module', Rightbar: '', Footer: 'Footer'})
        })

        insertLog.call({uid: Meteor.userId(), venue: 'modules/'+moduleId})
        insertUserLog.call({uid: Meteor.userId(), venue: 'modules/'+moduleId}) 

      } else {

        // //-- prob. venue will be 'modules/undefined' 
        // insertLog.call({uid: Meteor.userId(), venue: 'modules/'+moduleId});
        // insertUserLog.call({uid: Meteor.userId(), venue: 'modules/'+moduleId});

        if(Meteor.userId()) {
          FlowRouter.go('/');
        } else {
          FlowRouter.go('/signout');
        }
        
        // //-- prob. venue will be 'modules/undefined' 
        // insertLog.call({uid: Meteor.userId(), venue: 'modules/'+moduleId});
        // insertUserLog.call({uid: Meteor.userId(), venue: 'modules/'+moduleId});

      }

      // insertLog.call({uid: Meteor.userId(), venue: 'modules/'+moduleId})
      // insertUserLog.call({uid: Meteor.userId(), venue: 'modules/'+moduleId})  

    }
})

userRoutes.route('/forgotpassword', {
    action: function() {
      insertLog.call({msg: 'forgotpassword', venue: 'signin'})

      location.href = "https://app.craassessments.com/forgotpassword/training"
      // location.href = "http://localhost:3300/forgotpassword/training"
    }
});
userRoutes.route('/forgotusername', {   
    action: function() {
      insertLog.call({msg: 'forgotusername', venue: 'signin'})

      location.href = "https://app.craassessments.com/forgotusername/training"
    }
});

userRoutes.route('/terms', { 
  subscriptions: function() {      
  },
  action: function() {
      import('/imports/ui/pages/terms/terms.js').then(terms=>{
          document.title = "Terms";          
          BlazeLayout.render('Layout', {Header: 'Header', Leftbar: '', Main: 'Terms', Rightbar: '', Footer: 'Footer'})
      })
  }
});

//-- 404 Page Not Found
userRoutes.notFound = {    
    action() {
      //-- Let's show a customized 404 page to the users.
      import('/imports/ui/errors/404.html').then(page404 => {
        document.title = "Page Not Found"
        BlazeLayout.render('Layout', {Header: 'Header', Leftbar: '', Main: '404', Rightbar: '', footer: 'Footer'})
      })

      insertLog.call({uid: Meteor.userId(), venue: '404'})
      insertUserLog.call({uid: Meteor.userId(), venue: '404'})
    }
}
