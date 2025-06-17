import { insertLog } from '/both/api/methods/training-module-logs.js'

//-- Admin route group
const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [function(context, redirect) {
    var role = (Meteor.user()) ? parseInt(Meteor.user().profile.role) : 6;
    if(role < 3) {
        // keep going
        document.title = "Admin: " + Meteor.user().profile.fullname;
        
    } else {
      // alert('Access denied!')
      // if(Meteor.user()) {
      //   window.location.href = "https://www.fbi.gov/investigate/cyber"
      // } else {
      //   Meteor.logout((err) => { //-- To make sure that no user session remains.
      //     FlowRouter.go('/signin')
      //   })
        
      // }

      FlowRouter.go('/')
    }

    // import '/imports/ui/pages/admin/admin.js'
  }],
  subscriptions: function() {
    
      // if(Meteor.userId()) { //-- This will raise a warning message. Needs to be moved to SubsManager...
        
      //   Meteor.subscribe('training_module_settings_w_uid', Meteor.userId())
      // }
    
  },
  action: function() {
    // import '/imports/ui/pages/admin/admin.js'
  }
})

//-- Admin home page
adminRoutes.route('/', {
    subscriptions: function() {
      Meteor.subscribe("all_users_online")
    },
    action: function() {

      import '/imports/ui/pages/admin/admin.js'      

      document.title = "Admin"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminMain', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin'})
    }
})

//-- Module Management page
adminRoutes.route('/modules', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/modules/admin-all-modules.js'      

      document.title = "All Images"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminAllModules', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/modules'})
    }
})

//-- New Module page
adminRoutes.route('/modules/add', {
    subscriptions: function() {
    },
    action: function() {

      import '/imports/ui/pages/admin/modules/admin-new-module.js'      

      document.title = "Add a new module"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewModule', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/modules/add'})
    }
})

//-- New Module page
adminRoutes.route('/modules/build/:moduleId', {
    subscriptions: function() {
    },
    action: function() {

      import '/imports/ui/pages/admin/modules/admin-new-module.js'      

      document.title = "Add a new module"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewModule', Rightbar: '', Footer: 'AdminFooter'})

      let moduleId = FlowRouter.getParam('moduleId')
      insertLog.call({uid: Meteor.userId(), venue: 'admin/modules/build/'+moduleId})
    }
})

//-- Image Management page
adminRoutes.route('/images', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/images/admin-all-images.js'      

      document.title = "All Images"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminAllImages', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/images'})
    }
})

//-- New Image page
adminRoutes.route('/images/add', {
    subscriptions: function() {
    },
    action: function() {

      import '/imports/ui/pages/admin/images/admin-new-image.js'      

      document.title = "Add a new image"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewImage', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/images/add'})
    }
})

//-- Video Management page
adminRoutes.route('/videos', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/videos/admin-all-videos.js'      

      document.title = "All Videos"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminAllVideos', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/videos'})
    }
})

//-- New Video page
adminRoutes.route('/videos/add', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/videos/admin-new-video.js'      

      document.title = "Add a New Video"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewVideo', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/videos/add'})
    }
})

//-- Audio Management page
adminRoutes.route('/audio', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/audios/admin-all-audios.js'      

      document.title = "All Audio"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminAllAudios', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/audio'})
    }
})

//-- New Audio page
adminRoutes.route('/audio/add', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/audios/admin-new-audio.js'      

      document.title = "Add a New Audio"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewAudio', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/audio/add'})
    }
})

//-- Quiz Management page
adminRoutes.route('/quizzes', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/quizzes/admin-all-quizzes.js'      

      document.title = "All Quizzes"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminAllQuizzes', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/quizzes'})
    }
})

//-- New Quiz page
adminRoutes.route('/quizzes/add', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/quizzes/admin-new-quiz.js'      

      document.title = "Add a New Quiz set"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewQuiz', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/quizzes/add'})
    }
})

//-- Survey Management page
adminRoutes.route('/surveys', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/surveys/admin-all-surveys.js'      

      document.title = "All Surveys"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminAllSurveys', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/surveys'})
    }
})

//-- New Survey page
adminRoutes.route('/surveys/add', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/surveys/admin-new-survey.js'      

      document.title = "Add a New Survey"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewSurvey', Rightbar: '', Footer: 'AdminFooter'})
    }
})

//-- Survey Report page
adminRoutes.route('/surveys/report', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/surveys/admin-survey-report.js'      

      document.title = "Survey Report"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminSurveyReport', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/surveys/report'})
    }
})

//-- Page Templates Management page
adminRoutes.route('/templates/page', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/templates/admin-page-templates.js'      

      document.title = "Page Templates"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminPageTemplates', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/templates/page'})
    }
})

//-- Comp Templates Management page
adminRoutes.route('/templates/comp', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/templates/admin-comp-templates.js'      

      document.title = "Comp Templates"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminCompTemplates', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/templates/comp'})
    }
})

//-- New Template page
adminRoutes.route('/templates/add', {
    subscriptions: function() {

    },
    action: function() {

      import '/imports/ui/pages/admin/templates/admin-new-template.js'      

      document.title = "Add a New Template"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewTemplate', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/templates/add'})
    }
})

//-- Document Management page
adminRoutes.route('/documents', {
    subscriptions: function() {
      Meteor.subscribe("all_training_modules");
    },
    action: function() {

      import '/imports/ui/pages/admin/documents/admin-all-documents.js'      

      document.title = "All Documents"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminAllDocuments', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/documents'})
    }
})

//-- New Document page
adminRoutes.route('/documents/add', {
    subscriptions: function() {
      Meteor.subscribe("all_training_modules");
    },
    action: function() {

      import '/imports/ui/pages/admin/documents/admin-new-document.js'      

      document.title = "Add a New Document"
      BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminNewDocument', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/documents/add'})
    }
})

//-- User Management page
adminRoutes.route('/users', {
    subscriptions: function() {
      // Meteor.subscribe('all_active_training_modules') //-- this causes an issue when assigned modules are deactivated
      Meteor.subscribe('all_training_modules')
    },
    action: function() {

      // import '/imports/ui/pages/users/all-users.js'
      import('/imports/ui/pages/admin/users/admin-all-users.js').then(adminAllUsers => {
        document.title = "All Users"
        // BlazeLayout.render('AdminLayout', {Header: 'Header', Leftbar: '', Main: 'AllUsers', Rightbar: '', Footer: 'AdminFooter'})
        BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'AdminAllUsers', Rightbar: '', Footer: 'AdminFooter'})
      })

      insertLog.call({uid: Meteor.userId(), venue: 'admin/users'})
    }
})

//-- New User form page
adminRoutes.route('/users/add', {
    subscriptions: function() {
    },
    action: function() {

      import '/imports/ui/pages/users/new-user.js'      

      document.title = "Add a New User"
      BlazeLayout.render('AdminLayout', {Header: 'Header', Leftbar: '', Main: 'NewUser', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/users/add'})
    }
})

// //-- Modules home
// adminRoutes.route('/modules', {
//     subscriptions: function() {
//     },
//     action: function() {

//       import '/imports/ui/pages/modules/modules.js'      

//       document.title = "Modules"
//       BlazeLayout.render('AdminLayout', {Header: 'Header', Leftbar: '', Main: 'Modules', Rightbar: '', Footer: 'AdminFooter'})
//     }
// })

//-- Media home
adminRoutes.route('/media', {
    subscriptions: function() {
    },
    action: function() {

      import '/imports/ui/pages/media/media.js'      

      document.title = "Admin Media"
      BlazeLayout.render('AdminLayout', {Header: 'MediaHeader', Leftbar: 'MediaLeftbar', Main: 'MediaMain', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/media'})
    }
})

//-- Module Editor home
adminRoutes.route('/module_editor', {
    subscriptions: function() {
    },
    action: function() {

      import '/imports/ui/pages/module-editor/module-editor.js'      

      document.title = "Module Editor"
      BlazeLayout.render('AdminLayout', {Header: 'Header', Leftbar: '', Main: 'ModuleEditor', Rightbar: '', Footer: 'AdminFooter'})

      insertLog.call({uid: Meteor.userId(), venue: 'admin/module_editor'})
    }
})

//-- System ETL
adminRoutes.route('/etl', {
    subscriptions: function() {
    },
    action: function() {

      if(Meteor.user() && Meteor.user().profile.role === '1') {

        import '/imports/ui/pages/admin/system/etl.js'      

        document.title = "Admin System ETL"
        BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'ETL', Rightbar: '', Footer: 'AdminFooter'})
      } else {
        alert("We're sorry. You're not authrized.");
      }

      insertLog.call({uid: Meteor.userId(), venue: 'admin/etl'})
    }
});

//-- Datadump: Quiz results
adminRoutes.route('/quiz-datadump', {
    subscriptions: function() {
      Meteor.subscribe("all_clients");
    },
    action: function() {      

      import('/imports/ui/pages/admin/data/quiz-datadump.js').then(adminQuizDatadump => {
        document.title = "Datadump: Quiz results"        
        BlazeLayout.render('AdminLayout', {Header: 'AdminHeader', Leftbar: 'AdminLeftbar', Main: 'QuizDatadump', Rightbar: '', Footer: 'AdminFooter'})
      })

      insertLog.call({uid: Meteor.userId(), venue: 'admin/quiz-datadump'});
    }    
});




