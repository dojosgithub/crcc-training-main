/**
 * Input Findings Answers template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'
// import { getPageMonitoringNote } from '/both/api/methods/training-module-monitoring-notes.js'
import { getPageDocumentNNoteData } from '/both/api/methods/training-module-documents.js'

import '/imports/ui/pages/templates/comp-templates/viewport-answer-comp.html'

import Viewport from '/imports/components/viewport/Viewport.jsx';

// import { toLocaleString } from 'core-js/fn/number/epsilon'


// Template.ViewportAnswerComp.onRendered(() => {

//   $('.user-input-label').html("Your Findings: ")
//   $('.elem-user-input').show();

//   Tracker.autorun(() => {
//     Session.set("Modules.template.comp.done", true)
//   })
  
// })

// Template.ViewportAnswerComp.helpers({
//   getPageNotes() {
//     if(Session.get('pageData') && Session.get('Module.pages.data')) {
//       let  
//         _allPages = Session.get('Module.pages.data'),
//         _thisPage = Session.get('pageData'),
//         _thisPageIdx = _thisPage.order,
//         _sourcePageId = _allPages[_thisPageIdx-1] && _allPages[_thisPageIdx-1]._id;

//       if(_sourcePageId) {
//         let _obj = {
//           userId: Meteor.userId(),
//           pageId: _sourcePageId,
//           moduleId: _thisPage.moduleId
//         }
        
//         getPageMonitoringNote.call(_obj, (err, res) => {
//           if(err) {
//             // console.log(err)
//             toastr.error("Something went wrong. Error: " + err)
//           } else {
//             if(res) {
//               $('#txta_user_input').val(res.note)
//             }
//           }
//         })
//       }
//     }
//   }
// });

// Template.ViewportAnswerComp.onDestroyed(() => {
//   Session.set("Modules.template.comp.done", null)
// })


// import { Session } from 'meteor/session'
// import { ReactiveVar } from 'meteor/reactive-var'

// import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

// // import { getAllDocuments } from '/both/api/methods/training-module-documents.js'
// // import { getPageMonitoringNote } from '/both/api/methods/training-module-monitoring-notes.js';

// import './viewport-comp.html'

// import Viewport from '/imports/components/viewport/Viewport.jsx';
// import { toLocaleString } from 'core-js/fn/number/epsilon';

/* ============================== */

let _selfViewportAnswerComp

Template.ViewportAnswerComp.onCreated(() => {
  _selfViewportAnswerComp = this;  
})

Template.ViewportAnswerComp.onRendered(() => {
    
    $('.user-input-label').html("Your Findings: ")
    $('.elem-user-input').show()
  
    Tracker.autorun(() => {
      Session.set("Modules.template.comp.done", true)
    })

});

Template.ViewportAnswerComp.helpers({
  Page() {

    if(Session.get("Module.currentPageIdx")) {
      // console.log(Session.get("Module.currentPageIdx"));
      
      let _page = TrainingModulePages.find({}, {
        limit: 1,
        // skip: _selfModule.currentPageIdx.get()-1
        skip: Session.get("Module.currentPageIdx")-1
      }).fetch()

      // console.log(_page)
      if(_page && _page.length > 0) {
        let _exercisePage = _page[0];

        if(_exercisePage && _exercisePage.document) {
          let _pageDocNNoteObj = {
            userId: Meteor.userId(),
            pageId: _exercisePage._id,
            moduleId: _exercisePage.moduleId,
            pageDocumentIds: _exercisePage.document
          }         
          
          // getPageDocumentNNoteData.call(_pageDocNNoteObj, (err, res) => {
          //   if(err) {
          //     console.log(err);
          //     Session.set("Module.PageDocuments", null);
          //     Session.set("Module.PageNotes", null);
          //   } else {
          //     // console.log(_pageDocNNoteObj)
          //     // console.log(res)
          //     if(res) {
          //       if(res.pageDocuments && res.pageDocuments.length > 0) {
          //         Session.set("Module.PageDocuments", res.pageDocuments)
          //       }
          //       if(res.pageNotes) {
          //         Session.set("Module.PageNotes", res.pageNotes);                            
          //         $('#txta_user_input').val(res.pageNotes.note)                                      
          //       }
          //       // page[0]['_documents'] = res
          //     }
          //   }
          // })

          Session.set("Module.PageDocuments", _exercisePage.document)
        }
      }

    }

  },
  PageData() {
    if(Session.get("pageData")) {
      return Session.get("pageData")
    }
  },
  PageDocuments() {
    if(Session.get("Module.PageDocuments")) {     
      // console.log(Session.get("Module.PageDocuments"));        
      return Session.get("Module.PageDocuments");
    }
  },
  PageNotes() {
      if(Session.get("Module.PageNotes")) {            

          let 
              _note = Session.get("Module.PageNotes"),
              _status = _note.status || null;
          // console.log(_status)
              if(_status && _status === 3) { //-- if it's submitted
                  Session.set("Module.page.note.submitted", true);
              } else {
                  Session.set("Module.page.note.submitted", false);
              }

          return Session.get("Module.PageNotes");
      } else {
        
      }
  },    
  UserData() {
      return Meteor.user();
  },
  Viewport() {
      return Viewport
  },
  showViewport() {
      if(Session.get("ViewportComp.showViewport")) {
          return Session.get("ViewportComp.showViewport");
      }
      // Session.set("ViewportComp.showViewport", false);
      // return _selfViewportComp.showViewport.get()
  },
  isNoteSubmitted() {
      return Session.get("Module.page.note.submitted")
  },
  isNoteNotSubmitted() {
    return !Session.get("Module.page.note.submitted")
}   
});

Template.ViewportAnswerComp.events({
    'click .btn-view-viewport'(e, tpl) {
        e.preventDefault();        

        // _selfViewportComp.showViewport.set(true)
        Session.set("ViewportComp.showViewport", true);

        // $(".row-viewport-container.modal").modal('show')
        $(".row-viewport.modal").show();
        
        $("#viewport_intro_modal").modal('show');
        
    },
    'click .btn-close-viewport'(e, tpl) {
        e.preventDefault();

        Session.set("ViewportComp.showViewport", false);
        // _selfViewportComp.showViewport.set(false)

        // $(".row-viewport-container.modal").modal('hide')
        $(".row-viewport.modal").hide();
    },
    'click .btn-view-instructions'(e, tpl) {
      e.preventDefault();

      $("#viewport_intro_modal").modal('show');
    }    
});

Template.ViewportAnswerComp.onDestroyed(() => {
  Session.set("Modules.template.comp.done", null)
})

