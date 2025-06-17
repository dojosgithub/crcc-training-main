import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

// import { CUtil } from '/both/helpers/CUtil'
import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

// import { getAllDocuments } from '/both/api/methods/training-module-documents.js'
import { submitNote } from '/both/api/methods/training-module-monitoring-notes.js';

import { insertLog } from '/both/api/methods/training-module-logs.js';
import { insertUserLog } from '/both/api/methods/training-module-user-logs.js';

import './viewport-comp.html'

import Viewport from '/imports/components/viewport/Viewport.jsx';
// import { toLocaleString } from 'core-js/fn/number/epsilon';


let _selfViewportComp

Template.ViewportComp.onCreated(() => {
    _selfViewportComp = this;

    // console.log(this)

    _selfViewportComp.parentSlideCompleted = new ReactiveVar(false);
    Session.set("ViewportComp.showViewport", false);

    // _selfViewportComp.showViewport = new ReactiveVar(false);
})

Template.ViewportComp.onRendered(() => {
    let iframe = $('.sproutvideo-player')
    let iframeSrc = $(iframe).attr('src')
  
    let videoId = iframeSrc.split('embed/')[1].split('/')[0]
    
    // console.log(videoId);
  
    if(videoId !== '') {
      let player = new SV.Player({videoId: videoId})
  
      player.bind('completed', function() {        
        _selfViewportComp.parentSlideCompleted.set(true)      
      })  
  
      player.bind('progress', function(e) {
        _selfViewportComp.parentSlideCompleted.set(false)   
      })
  
      player.bind('pause', function() {
        _selfViewportComp.parentSlideCompleted.set(false)
      })    
    }
    
    $('.user-input-label').html("Your Findings: ")
    $('.elem-user-input').show()

    // new Util().generateStyleLink('templates', 'viewport')

});

Template.ViewportComp.helpers({
    PageData() {
        if(Session.get("pageData")) {
            return Session.get("pageData")
        }
    },
    PageDocuments() {
        // console.log(Session.get("Module.PageDocuments"));
        if(Session.get("Module.PageDocuments")) {            
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
        }
    },    
    UserData() {
        return Meteor.user();
    },
    Viewport() {
        return Viewport
    },
    isParentSlideCompleted() {
        return _selfViewportComp.parentSlideCompleted.get()
    },
    showViewport() {
        console.log(Session.get("ViewportComp.showViewport"))
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

Template.ViewportComp.events({
    'click .btn-view-viewport'(e, tpl) {
        e.preventDefault();        

        // _selfViewportComp.showViewport.set(true)
        Session.set("ViewportComp.showViewport", true);

        // $(".row-viewport-container.modal").modal('show')
        $(".row-viewport").show();
        
        $("#viewport_intro_modal").modal('show');
        
    },
    'click .btn-close-viewport'(e, tpl) {
        e.preventDefault();
        
        Session.set("ViewportComp.showViewport", false);
        // _selfViewportComp.showViewport.set(false)

        // $(".row-viewport-container.modal").modal('hide')
        $(".row-viewport").hide();
    },
    'click .btn-submit-notes'(e, tpl) {
        e.preventDefault();        

            let _notes = Session.get("Module.PageNotes")

            if(_notes && _notes !== '') {

                if(confirm("Are you sure you want to submit your monitoring notes?\n\nPlease be noted that you won't be able to update it, once it's submitted.")) {

                    let 
                    currentPageIdx = Session.get("Module.currentPageIdx"),
                    _myUserStats = Session.get('myUserStats');
            
                    _myUserStats.pages.push(currentPageIdx)
                
                    Session.set("Modules.template.comp.done", true)
                    Session.set('myUserStats', _myUserStats)
                
                    let statsObj = Session.get("Module.statsObj")          
            // console.log(statsObj)
                    upsertUserStats.call(statsObj, (err, res) => {
                        if(err) {}
                        else {
                        Session.set('myUserStats', res)
                        
                        let _noteObj = {
                            userId: _notes.userId,
                            pageId: _notes.pageId,
                            moduleId : _notes.moduleId,
                            submitted: true                
                        }

                        _notes['submited'] = true;

                        submitNote.call(_noteObj, (err, res) => {
                            if(err) {
                                console.log(err)
                                toastr.error("Something went wrong. Please try again. If this issue persists, please contact us at help@craassessments.com");
                            } else {
                                if(res) {
                                    insertLog.call({uid: Meteor.userId(), venue: 'viewport', note: _notes})
                                    insertUserLog.call({uid: Meteor.userId(), venue: 'viewport', note: _notes}) 
                                                
                                    toastr.info("Successfully submitted.");

                                    $('.btn-go-next').trigger('click')
                                }
                            }
                        })

                        }
                    })

                }
            } else {
                toastr.error("Please save and submit all your findings (or, you can also say there's no issue) to move on to the next slide.")
            }

        

    },
    'click .btn-view-instructions'(e, tpl) {
        e.preventDefault();

        $("#viewport_intro_modal").modal('show');
    }
});
