/**
 * Single Module template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { Util } from '/imports/api/lib/util.js';

import Viewport from '/imports/components/viewport/Viewport'

import { insertUserLog, sendPrintScreenNoti } from '/both/api/methods/training-module-user-logs.js';

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'
import { TrainingModuleSettings } from '/both/api/collections/training-module-settings.js'
import { TrainingModuleTemplates } from '/both/api/collections/training-module-templates.js'

import { updateSettings } from '/both/api/methods/training-module-settings.js'
import { countActiveModulePages } from '/both/api/methods/training-module-pages.js'
import { getPageDocumentNNoteData } from '/both/api/methods/training-module-documents.js'

import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

import { resetPageMonitoringNotesExercise } from '/both/api/methods/training-module-monitoring-notes.js'

import '/imports/ui/pages/templates/comp-templates'
import '/imports/ui/pages/templates/page-templates'
import '/imports/ui/pages/templates/quiz-templates'
import '/imports/ui/pages/templates/survey-templates'

// import '/imports/ui/stylesheets/modules/module-base.less'

import { ModuleFooter } from '/imports/ui/pages/modules/module-footer.js'
import { ModuleHowTo } from '/imports/ui/pages/documents/module-how-to.js'
import { ModuleInterfaceReference } from '/imports/ui/pages/documents/module-interface-reference.js'
import { ModuleFAQ } from '/imports/ui/pages/documents/module-faq.js'

let _selfModule
let _subsModule

//-- Defined in the Routes.
// let mySettings = Session.get("mySettings")[0]

// console.log('2', Session.get("mySettings"))

      // let mySettings = TrainingModuleSettings.find({
      //   userId: Meteor.userId()
      // }).fetch()

      // console.log(mySettings)

// if(typeof mySettings === 'undefined' || Session.hasModuleThemeChanged.get()) {
  let mySettingsInit = localStorage.getItem('mstgs')
  let mySettings

  if(mySettingsInit) {
    mySettings = JSON.parse(mySettingsInit)
  }
  
  // // let videoAutoplay = mySettings && mySettings.videoAutoplay || false

// if(mySettings || Session.get('hasModuleThemeChanged')) {

  let videoAlignment = mySettings && mySettings.videoAlignment || 'left'

  if(videoAlignment && videoAlignment === 'left') {
    // import '/imports/ui/stylesheets/modules/theme_default_left/module.less'
    import { Module } from '/imports/ui/pages/modules/theme_default_left/module.html'
  }
  else if(videoAlignment && videoAlignment === 'right') {
    // import '/imports/ui/stylesheets/modules/theme_default_right/module.less'
    import { Module } from '/imports/ui/pages/modules/theme_default_right/module.html'
  }
  else if(videoAlignment && videoAlignment === 'center') {
    // import '/imports/ui/stylesheets/modules/theme_default_center/module.less'
    import { Module } from '/imports/ui/pages/modules/theme_default_center/module.html'
  } else {
    // import '/imports/ui/stylesheets/modules/theme_default_left/module.less'
    import { Module } from '/imports/ui/pages/modules/theme_default_left/module.html'  
  }
// }

Template.Module.onCreated(function moduleOnCreated() {

  _selfModule = this

  _subsModule = new SubsManager()
  _selfModule.ready4Module = new ReactiveVar() 
  _selfModule.numPages = new ReactiveVar() 
  _selfModule.ready4Pages = new ReactiveVar() 

  _selfModule.tplQuiz = new ReactiveVar()

  _selfModule.pageData = new ReactiveVar() 
  // _selfModule.ready4Page = new ReactiveVar() 

  _selfModule.currentPageId = new ReactiveVar(null)
  _selfModule.currentPageTimestamp = new ReactiveVar(null)
  _selfModule.currentPageIdx = new ReactiveVar(0)
  // _selfModule.currentPageLimit = new ReactiveVar(1)
  // _selfModule.currentPageSkip = new ReactiveVar(0)

  // _selfModule.videoAutoplay = videoAutoplay

  _selfModule.progressOption = new ReactiveVar(false)
  // _selfModule.videoProgress = new ReactiveVar('init')

  if(mySettings) {
    _selfModule.mySettings = new ReactiveVar(mySettings)
  }

  if(Session.get('myUserStats')) {
    _selfModule.myUserStats = Session.get('myUserStats');
    _selfModule.viewedPages = _selfModule.myUserStats.pages;
    _selfModule.isModuleCompleted = Session.get("moduleCompleted");

    // console.log(_selfModule.isModuleCompleted);

    if(_selfModule.isModuleCompleted) {
      _selfModule.currentPageIdx.set(0)
      Session.set("Module.currentPageIdx", 0);
    }
    else if(_selfModule.myUserStats.pages && _selfModule.myUserStats.pages.length > 1) { //-- skip the first 'null'
      _selfModule.viewedPages = _selfModule.myUserStats.pages.sort((a, b) => (a-b))

      let _pageIdxToContinue = _selfModule.viewedPages[_selfModule.viewedPages.length -1]      
      _selfModule.currentPageIdx.set(_pageIdxToContinue)

      // console.log(_selfModule.currentPageIdx.get())
      // Session.set("Module.page.current.idx", _pageIdxToContinue);
      Session.set("Module.currentPageIdx", _pageIdxToContinue);
    }
  }
  _selfModule.autorun(() => {

    if(Session.get('startModuleId')) {
      let mid = Session.get('startModuleId')

      let module = TrainingModules.findOne(mid)
      if(module) {        
        _selfModule.progressOption.set(module.progressOption)
        _selfModule.duration = module.duration

        Session.set('startModuleName', module.name)  
      }

      let handlePages = _subsModule.subscribe('active_module_pages_w_module_id', mid)
      _selfModule.ready4Pages.set(handlePages.ready())      
    }

  })


})

Template.Module.onRendered(function moduleOnRendered() {

  let mySettingsInitOnRender = localStorage.getItem('mstgs')
  let mySettingsOnRender

  if(mySettingsInitOnRender) {
    mySettings = JSON.parse(mySettingsInitOnRender)
    _selfModule.mySettings = new ReactiveVar(mySettings)
  }

})

Template.Module.helpers({
  // Module() {
  //   return TrainingModules.find()
  // },
  remoteJumpToPage() {
    let _pageIndex = Session.get("Module.currentPageIdx") || 0;

    _selfModule.currentPageIdx.set(_pageIndex)
    Session.set("Module.currentPageIdx", _pageIndex)

    insertUserLog.call({uid: Meteor.userId(), page: _pageIndex+1, msg: 'remote jump', mid: Session.get('startModuleId'), venue: 'index'})
  },
  Page() {

    let page = TrainingModulePages.find({
      // order: _selfModule.currentPageIdx.get()
      status: 1
    }, {
      limit: 1,
      skip: _selfModule.currentPageIdx.get()      
    }).fetch()

    // console.log(_selfModule.currentPageIdx.get(), page);

    if(page && page[0]) {
      page[0].index = _selfModule.currentPageIdx.get()
      page[0].progressOption = _selfModule.progressOption.get()
      page[0].numPages =  _selfModule.numPages.get()

      page[0].moduleDuration = _selfModule.duration
      page[0].moduleName = Session.get('startModuleName')

      // Session.set('pageData', page[0])
      //-- The result data is an array and kind of tricky to deal with inside 
      //-- the template. This logic block will convert the array to an object, 
      //-- and will make the template data called easily in the template.      
      if(page[0].thisTemplate && page[0].thisTemplate[0] && page[0].thisTemplate[0]._id) {

        //-- for some reason, ReactiveAggregate inside publication doesn't seem to work 
        //-- fully, which gets only the initila data, not the full data. For example, 
        //-- thisTemplate has only template _id and system_name. We need template type 
        //-- to make the slide load it properly.
        //-- Tentative workaround is to get all active templates (see routes for this path), 
        //-- and find one just for this page (05/16/2020, dq)
        //-- it turns out we only need template _id and systemName, so, this block 
        //-- is commentized as no need to keep this
        // let _pageTemplate = TrainingModuleTemplates.findOne(page[0].thisTemplate[0]._id);
        // let _pageTemplate = TrainingModuleTemplates.find().fetch();

        // console.log(_pageTemplate)
        // if(_pageTemplate) {
        //   page[0].thisTemplate[0] = _pageTemplate;
        // }

        if((page[0].thisTemplate[0].type === 'comp' && page[0].type === 'video') 
          || (page[0].thisTemplate[0].type === 'page' && page[0].type === 'code')) {
          let myTemplate = {
            _id: page[0].thisTemplate[0]._id,
            systemName: page[0].thisTemplate[0].systemName //-- this one will be injected to the dynamic template
          }
// console.log(myTemplate)
          //-- Get Page documents when the template is a Viewport component
          if(myTemplate.systemName.includes("Viewport")) {
              
            let _pageDocuments = page[0].document || [];

            let _pageDocNNoteObj = {
              userId: Meteor.userId(),
              pageId: page[0]._id,
              moduleId: page[0].moduleId,
              pageDocumentIDs: _pageDocuments
            }

              // console.log(_pageDocNNoteObj)

              // getDocumentsWithIds.call(_pageDocuments, (err, res) => {
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

            let _vpInstance = new Viewport(page[0].moduleId, page[0]._id, Meteor.userId(), _pageDocuments);

            if(myTemplate.systemName.includes("Answer")) {
              // _vpInstance.getPreviousPageData(page[0]._id, (res) => {
              //   console.log(res)
              //   if(res && res._id) {
              //     _pageDocNNoteObj['pageId'] = res._id
              //   }
              // })
              _vpInstance
                .getPreviousPageData(page[0]._id, (err, res) => {
                  _vpInstance.getPageDocumentNNoteData()
                })
                
            } else {
              _vpInstance.getPageDocumentNNoteData();              
            }
            // _vpInstance.getPageDocumentNNoteData((res) => {            
            //     console.log(res)
            //     if(res) {
            //       let 
            //         _pageDocuments = res.pageDocuments,
            //         _pageNotes = res.pageNotes;

            //         Session.set("Module.PageDocuments", _pageDocuments)
            //     } else {

            //     }

            //   });

          } //-- if(myTemplate.systemName.includes("Viewport")) {
          else {
            Session.set("Module.PageDocuments", null);
            Session.set("Module.PageNotes", null);
          }

          page[0].thisTemplate = myTemplate
        }
      }

      // console.log(page, page[0].thisTemplate[0]);

      let videoSrc = '';

      if(page[0].type === 'video') {

          // let videoSrc = page[0].video.videoSrc
          let _videoSrc = page[0].video.videoSrc
          // videoSrc = videoSrc.replace('/(<[^>]+) style=".*?"/i','');
          const vidSrcRegex = /style='.*?'/gi;
          videoSrc = _videoSrc.replace(vidSrcRegex,''); //-- remove inline style tag to avoid unsafe-inline issue

          page[0].video.videoSrc = videoSrc; //-- if it's page #1, this will be just its video source code
      }

      //-- if page # is higher than 1, video source code should be modified
      //-- based on user's auto-play prefenrence
      if(page[0].index > 0 && page[0].type === 'video') { 

        // let videoSrc = page[0].video.videoSrc
        // let _videoSrc = page[0].video.videoSrc
        // videoSrc = videoSrc.replace('/(<[^>]+) style=".*?"/i','');
        // const vidSrcRegex = /style='.*?'/gi;
        // let videoSrc = _videoSrc.replace(vidSrcRegex,''); //-- remove inline style tag to avoid unsafe-inline issue

        // console.log(_nVideoSrc);

        let nVideoSrc = ''

        if(_selfModule.mySettings && _selfModule.mySettings.curValue.videoAutoplay) {
          if(videoSrc.includes('?')) {
            nVideoSrc = videoSrc.replace('?', '?autoPlay=true&')
          } else {
            // nVideoSrc = videoSrc.replace("' style", "?autoPlay=true' style")
            nVideoSrc = videoSrc.replace("' frameborder", "?autoPlay=true' frameborder")
          }
        } else {
          nVideoSrc = videoSrc.replace('autoPlay=true', 'autoPlay=false')
        }

        page[0].video.videoSrc = nVideoSrc

        // console.log(nVideoSrc)
      } 
      else if(page[0].type === 'quiz') {
        let quizType = page[0].quizType === 2 ? 'QuizAAO' : 'QuizOAAT'
        _selfModule.tplQuiz.set(quizType)
      }

      if(_selfModule.viewedPages) {
        if(_selfModule.viewedPages.indexOf(page[0].index) !== -1) {
          let title = '<span class="page-viewed">' + page[0].title + '</span>'
          page[0].title = title
        } else {          
          //-- This should be delayed. Otherwise, the page title 
          //-- will change to the viewed style immediated it's open.          
          // _selfModule.viewedPages.push(page[0].index)


          //-- Check module-footer for upsertStats
          // if(Session.get('startModuleId')) {
          //   let statsObj = {           
          //     userId: Meteor.userId(),
          //     moduleId: Session.get('startModuleId'),
          //     _page: page[0].index            
          //   }
        
            // if(_selfModule.progressOption.get() === false || //-- If page needs not be completed to move on
            //   ( page[0].type === 'video' && _selfModule.videoProgress.get() === 'completed')) { 
            //   upsertUserStats.call(statsObj, (err, res) => {
            //     if(err) {}
            //     else {
            //       Session.set('myUserStats', res)
            //       //-- This should be delayed. Otherwise, the page title 
            //       //-- will change to the viewed style immediated it's open.
            //       // _selfModule.viewedPages = res.pages 
            //     }
            //   })  
            // }

          // }       

        }

        Session.set('pageData', page[0])
      }      

      if(page[0].index === 0) { //-- When users come into the module/page for the first time, log page #1
        if(!_selfModule.currentPageId.get()) { //-- this avoids duplicated logs for page 1 (for some reason, 2 logs are created)
          _selfModule.currentPageId.set(page[0]._id)
          insertUserLog.call({uid: Meteor.userId(), page: 1, pid: page[0]._id, mid: page[0].moduleId, venue: 'module'})
        }
      } else { //-- log all other pages except page #1
        insertUserLog.call({uid: Meteor.userId(), page: page[0].index+1, pid: page[0]._id, mid: page[0].moduleId, venue: 'module'})
        _selfModule.currentPageId.set(null)
      }

      // page[0]['user'] = Meteor.user();

      // console.log(page[0]);

      // Session.set("Module.page.data", page[0]);

      // console.log(Session.get("Module.page.data"))

      return page
    }

    // return page
  },
  Pages() {
    if(Session.get('startModuleId')) {
      let pages = TrainingModulePages.find({
        status: 1
      }).fetch()

      // console.log(_selfModule.viewedPages);

      if(pages && pages.length >= 0) {
        let pageLength = pages.length
        _selfModule.numPages.set(pageLength)
        
        for(let i=0;i<pageLength;i++) {
          let pageEntry = ''
          // if(_selfModule.viewedPages.indexOf(i) !== -1) {
          if(_selfModule.viewedPages.includes(pages[i].order)) {
            pageEntry = '<span class="page-number page-number-viewed">'+ (i+1) + '</span>'
            pageEntry += '<span class="page-number-title page-number-title-viewed">' + pages[i].title + '</span>'          
          } else {
            pageEntry = '<span class="page-number">'+ (i+1) + '</span>'
            pageEntry += '<span class="page-number-title">' + pages[i].title + '</span>'             
          }
          pages[i].title = pageEntry
        }
      }

      // insertUserLog.call({uid: Meteor.userId(), page: 1, mid: Session.get('startModuleId'), venue: 'module'})

      Session.set("Module.pages.data", pages);

      return pages 
    } 
  },
  totalPages() {
    return _selfModule.numPages.get()
  },
  // compData() {
  //   return 'compData'
  // },
  // pageData() {
  //   // console.log(_selfModule.pageData.get())
  //   return _selfModule.pageData.get()
  // }
  mySettings() {
    // console.log(_selfModule.mySettings.get())
    return _selfModule.mySettings.get()
  },
  pageData() {    
    return Session.get('pageData')
  },
  tplQuiz() {
    return _selfModule.tplQuiz.get()
  },
  // tplModuleHowToVideo() {
  //   return Session.get("tplModuleHowToVideo")
  // }
  // transcriptPreHeight() {
  //   return Session.get('transContainerHeight')
  // }
  isNoteSubmitted() {
    return Session.get("Module.page.note.submitted")
  }
})

Template.Module.events({
  'click .btn-go-next'(e, tpl) {

    let curIndex = _selfModule.currentPageIdx.get() 

    if(typeof curIndex === 'undefined') {
      curIndex = Session.get("Module.currentPageIdx")
    }
// console.log(Session.get('myUserStats'))
    if(Session.get('myUserStats').pages.indexOf(curIndex) !== -1) {
      let newIndex = curIndex +1
      _selfModule.currentPageIdx.set(newIndex)
      Session.set("Module.currentPageIdx", newIndex)

      insertUserLog.call({uid: Meteor.userId(), page: newIndex, msg: 'next', pid: this._id, mid: Session.get('startModuleId'), venue: 'module'})
    } else {
      toastr.warning("Please complete all the page materials to move on to the next page.")
      insertUserLog.call({uid: Meteor.userId(), msg: 'warning: page incompletion', mid: Session.get('startModuleId'), venue: 'module'})
    }

    //-- This will make the page title look viewed 
    //-- when the page is revisited.
    _selfModule.viewedPages = Session.get('myUserStats').pages    
  }, 
  'click .btn-go-back'(e, tpl) {

    let curIndex = _selfModule.currentPageIdx.get()
    let newIndex = curIndex -1

    _selfModule.currentPageIdx.set(newIndex)
    Session.set("Module.currentPageIdx", newIndex)

    //-- This will make the page title look viewed 
    //-- when the page is revisited.
    _selfModule.viewedPages = Session.get('myUserStats').pages

    insertUserLog.call({uid: Meteor.userId(), page: curIndex+1, msg: 'prev', pid: this._id, mid: Session.get('startModuleId'), venue: 'module'})
  },
  'click .jump-to-page'(e, tpl) {
    e.preventDefault()

    let statPages = Session.get('myUserStats').pages
    let newIndex = parseInt($(e.currentTarget).data('idx'))

    let curPage = _selfModule.currentPageIdx.get() +1

    if(_selfModule.progressOption.get()) {
      if(statPages.indexOf(newIndex) !== -1 //-- either the page to jump 
        || statPages.indexOf(newIndex-1) !== -1) { //-- or, the previous page of the page to jump got viewed already

        _selfModule.currentPageIdx.set(newIndex)
        Session.set("Module.currentPageIdx", newIndex)

        insertUserLog.call({uid: Meteor.userId(), page: curPage, msg: 'jump', pid: this._id, mid: Session.get('startModuleId'), venue: 'index'})
      } else {
        toastr.warning("Please complete all the page materials to move on to the next page.")

        insertUserLog.call({uid: Meteor.userId(), page: curPage, msg: 'warning: page incompletion', pid: this._id, mid: Session.get('startModuleId'), venue: 'jump'})
      }
    } else {
      _selfModule.currentPageIdx.set(newIndex)
      Session.set("Module.currentPageIdx", newIndex)

      insertUserLog.call({uid: Meteor.userId(), page: curPage, msg: 'jump', pid: this._id, mid: Session.get('startModuleId'), venue: 'index'})      
    }

    //-- This will make the page title look viewed 
    //-- when the page is revisited.
    _selfModule.viewedPages = Session.get('myUserStats').pages

  },
  'click .btn-view-input-box'(e, tpl) {
    e.preventDefault()
    
    $('.module-findings-input-button-container').hide()
    // $('.findings-input-box-container2').fadeIn(1000).draggable({
    //   containment: $('.row-module-main-content')
    // })
    
    $('.row-all-documents-top').fadeIn(500)
    $('.row-all-documents').fadeIn(500)
  },
  'click .btn-submit-findings0'(e, tpl) {
    e.preventDefault()

    let input = $('.txa-findings-input').val()

    if(Session.get('userFindingsInput') !== '' || input !== '') {
      $('.btn-module-navigation.btn-go-next').prop('click')     
    } else {
      toastr.error("Please enter all your findings to move on to the next slide.")
    }    
  },
  'click .btn-zoomin-module-document-right'(e, tpl) {
    e.preventDefault()

    $('.module-document-right').css({
        width: $(this).width() * 1.1
    })
  },
  'click .btn-open-resource-panel'(e, tpl) {
    e.preventDefault()

    // $('.col-module-resource2').show().animate({'marginRight':100}, 2000);;
    // $('.col-module-resource-panel').show().animate({'left':76+'%'}, 500);
    $('.col-module-resource-panel').show().animate({'left':80+'%'}, 500);
    
    $('.btn-open-resource-panel').blur().hide();
    $('.btn-close-resource-panel').show();
  },
  'click .btn-close-resource-panel'(e, tpl) {
    e.preventDefault()

    // $('.col-module-resource2').show().animate({'marginRight':100}, 2000);;
    $('.col-module-resource-panel').animate({left:'105%'}, {
      queue: false, 
      duration: 500,
      complete: function() {
        $(this).hide()
      }});
    $('.btn-open-resource-panel').blur().show();
    $('.btn-close-resource-panel').hide();    
  },
  'click .btn-view-document-all'(e, tpl) {
    e.preventDefault()

    $('.row-all-documents-top').fadeIn(500)
    $('.row-all-documents').fadeIn(500)
  },
  'click .btn-close-all-documents'(e, tpl) {
    e.preventDefault()

    $('.row-all-documents').fadeOut(500)
    $('.findings-input-box-container4').hide()
    $('.row-all-documents-top').fadeOut(500)
  },
  'click .btn-zoomin-module-document-left'(e, tpl) {
    e.preventDefault()

    let thisDoc = $('.module-document-left')

    thisDoc.css({
        width: thisDoc.width() * 1.1,
        height: thisDoc.height() * 1.1,
    })
  },
  'click .btn-zoomout-module-document-left'(e, tpl) {
    e.preventDefault()

    let thisDoc = $('.module-document-left')

    thisDoc.css({
        width: thisDoc.width() * 0.9,
        height: thisDoc.height() * 0.9
    })
  },
  'click .btn-zoomin-module-document-right'(e, tpl) {
    e.preventDefault()

    let thisDoc = $('.module-document-right')

    thisDoc.css({
        width: thisDoc.width() * 1.1,
        height: thisDoc.height() * 1.1,
    })
  },      
  'click .btn-zoomout-module-document-right'(e, tpl) {
    e.preventDefault()

    let thisDoc = $('.module-document-right')

    thisDoc.css({
        width: thisDoc.width() * 0.9,
        height: thisDoc.height() * 0.9
    })
  },
  'click .btn-view-module-findings-input-box'(e, tpl) {
    e.preventDefault()
    
    $('.findings-input-box-container4').fadeIn(500).draggable({
      containment: $('.row-all-documents')
    })    
  },
  'click .btn-close-findings-box4'(e, tpl) {
    e.preventDefault()

    $('.findings-input-box-container4').fadeOut(500)
  },
  'click .btn-save-findings'(e, tpl) {
    e.preventDefault()

    let input = $('.txa-findings-input4').val()

    if(input !== '') {      
      Session.set('findings_input_module9', input)
    }        
  },
  'click .btn-submit-findings-n-move'(e, tpl) {
    e.preventDefault()

    let input = $('.txa-findings-input4').val()

    if(input !== '') {      
      Session.set('findings_input_module9', input)
    }

    FlowRouter.go('/modules/4/10')    
  },
  // 'timeupdate audio'(e,tpl){
    
  //   let currentTime = Math.floor(tpl.find("audio").currentTime)    
    
  //   _selfModule.pageData.set(currentTime)

  //   if(currentTime === 10) {      
  //     console.log(currentTime)
  //   } 

  //   $("#module_page_audio").on('ended', function(){
  //     console.log("ended")
  //   });
  // },
  'click .btn-view-transcript'(e, tpl) {
    e.preventDefault()

    let pageId = $(e.currentTarget).parent().data('pid')

    let resourcePanelPos = $('.col-module-resource-panel').offset()

    let x = e.clientX
    let y = e.clientY

    // console.log(x, y)

    // $('#transcript_container_'+pageId).show().draggable({
    //   containment: $(".row-module-main-container")
    // })

    $('#transcript_container_'+pageId).show().css({
      left: resourcePanelPos.left + 'px',
      // top: (y-50)+'px' 
      top: '230px' 
    }).draggable()

    if(x < 500) {
      $('#transcript_container_'+pageId).css('left', '10%')
    }    
  },
  'click .btn-close-transcript-panel'(e, tpl) {
    e.preventDefault()

    $('.transcript-container').hide()
  },
  'change .chkb-video-autoplay'(e, tpl) {
    e.preventDefault()

    let autoplay = $(e.currentTarget).is(':checked')
    // let _id = $(e.currentTarget).data('_id')    
    let _id = _selfModule.mySettings.curValue._id

    let uid = Meteor.userId()

    if(_id && uid) {

      let obj = {
        _id: _id,
        _set: {
          videoAutoplay: autoplay
        }        
      }

      updateSettings.call(obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          // console.log(res)
          _selfModule.mySettings.set(res)
          localStorage.setItem('mstgs', JSON.stringify(res))

          toastr.info("Successfully updated.")
        }        
      })
    } else {
      toastr.error("Something went wrong. Please try again.")
    }
  },
  'click .btn-video-alignment'(e, tpl) {
    e.preventDefault()

    let _id = _selfModule.mySettings.curValue._id
    let newModuleTheme = $(e.currentTarget).data('pos')

    if(_id) {
      let obj = {
        _id: _id,
        _set: {
          moduleTheme: newModuleTheme
        }
      }

      updateSettings.call(obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          
          _selfModule.mySettings.set(res)
          localStorage.setItem('mstgs', JSON.stringify(res))

          Session.set('hasModuleThemeChanged',true)

          toastr.info("Successfully updated.")

        }        
      })
    } else {
      toastr.error("Something went wrong. Please try again.")
    }    
  },
  'click .btn-how-to-use'(e, tpl) {
    e.preventDefault()

    // import('/imports/ui/pages/documents/module-how-to.js').then(() => {
    //   Session.set("tplModuleHowToVideo", "ModuleHowTo")
    //   $('.module-how-to-video.modal').show()
    // })   

      let _video = `
        <div class='videoWrapper'>
          <iframe class='sproutvideo-player' src='//videos.sproutvideo.com/embed/4c9adabf1b1cecc7c4/37b3277ff9a6fb22?playerTheme=dark&playerColor=2f3437' frameborder='0' allowfullscreen></iframe>
        </div> 
      `    
      $('#moduleHowToVideoModalSrc').append(_video) //-- This seesmt to be the only way to avoid the first blurry part

    $('#moduleHowToVideoModal').on('hidden.bs.modal', () => {
      //-- This works for all media source.
      $("#moduleHowToVideoModal iframe").attr("src", $("#moduleHowToVideoModal iframe").attr("src"))
    })
    insertUserLog.call({uid: Meteor.userId(), msg: "tutorial-video", venue: 'module'})
  },
  'click .btn-interface-reference'(e, tpl) {
    e.preventDefault()

    // import('/imports/ui/pages/documents/module-how-to.js').then(() => {
    //   Session.set("tplModuleHowToVideo", "ModuleHowTo")
    //   $('.module-how-to-video.modal').show()
    // })   

    // $('#moduleHowToVideoModal').on('hidden.bs.modal', () => {
    //   //-- This works for all media source.
    //   $("#moduleHowToVideoModal iframe").attr("src", $("#moduleHowToVideoModal iframe").attr("src"))
    // })
    insertUserLog.call({uid: Meteor.userId(), msg: "interface-map", venue: 'module'})
  },  
  'click .btn-faq'(e, tpl) {
    e.preventDefault()

    // import('/imports/ui/pages/documents/module-how-to.js').then(() => {
    //   Session.set("tplModuleHowToVideo", "ModuleHowTo")
    //   $('.module-how-to-video.modal').show()
    // })   

    $('#moduleFAQModal').on('hidden.bs.modal', () => {
      //-- This works for all media source.
      $("#moduleFAQModal iframe").attr("src", $("#moduleFAQModal iframe").attr("src"))
    })
    insertUserLog.call({uid: Meteor.userId(), msg: "faq", venue: 'module'})
  },
  // 'click .module-video-container'(e, tpl) {
  //   e.preventDefault()

  //   console.log('aaabbb')
  // },
  // 'click .sproutvideo-player'(e, tpl) {
  //   e.preventDefault()

  //   console.log('aaabbbccc')
  // },
  // 'keypress iframe'(e, tpl) {
  //   e.preventDefault()

  //   console.log(e.keyCode)
  // } 
  'click .btn-view-viewport'(e, tpl) {
    e.preventDefault();

    // _selfViewportComp.showViewport.set(true)
    Session.set("ViewportComp.showViewport", true);

    // $(".row-viewport-container.modal").modal('show')
    $(".row-viewport").show();

    $("#viewport_intro_modal").modal('show');
  },
  'click .btn-reset-exercise'(e, tpl) {
    e.preventDefault();

    // console.log(this)

    if(this.moduleId && this._id) {
      if(confirm("Are you sure you want to reset this exercise?")) {

        let _obj = {
          moduleId: this.moduleId,
          pageId: this._id,
          userId: Meteor.userId(),
          order: this.order
        }

        resetPageMonitoringNotesExercise.call(_obj, (err, res) => {
          if(err) {
            console.log(err)
          } else {
            // console.log(res)
            toastr.info("Successfully done.")
            FlowRouter.go("/modules")
          }
        })

      }

    } else {
      toastr.error("Invalid data. Please try again.")
    }
  }       
})

Template.Module.onDestroyed(()=>{
  _selfModule.currentPageId.set(null)

  Session.set('curQuestions', null)
  Session.set('curQuestions', null)

  Session.set('startModuleId', null)
  Session.set('startModuleName', null)  
  _subsModule.clear() //-- This is critical in resetting the list of module pages.
  // Session.set("tplModuleHowToVideo", null)
})

//     $('iframe').on('keyup', function (e) {
//         e.preventDefault();
// console.log('bbb')
//     var elem = document.activeElement;
//     if(elem && elem.tagName == 'IFRAME'){
//     // message.innerHTML = 'Clicked';
//     //     clearInterval(monitor);
//     // }
//       console.log('aaa')   
//     }

//         if(e.keyCode === 83) {
//             console.log('aaa')

//         }       
//     });

$(document).on('keyup', function (e) {
    e.preventDefault();
// console.log(e.keyCode)
    if(e.keyCode === 44) {

        if(Meteor.user()) {
            var fullname = Meteor.user().profile.fullname,
                email = Meteor.user().emails[0].address,
                page = _selfModule.currentPageIdx.get() +1;

let bodyText = `
Name: ${fullname}
<br>
Email: ${email}
<br>
Module: ${Session.get('startModuleName')}
<br>
page: ${page}
<br>
`
// console.log(bodyText)

            var emailObj = {
                from: "admin@craassessments.com",
                to: "admin@craassessments.com",
                subject: "[TR] Invalid action: Print Screen",
                body: bodyText
            };

            // console.log(emailObj);
            insertUserLog.call({uid: Meteor.userId(), msg: "print screen", page: page, mid: Session.get('startModuleId'), venue: 'module'})
            toastr.error("<h3>Please be cautious. Your account can be deactivated: The content of this assessment is protected. Capturing, copying, printing, or reproducing in any manner is strictly prohibited. This action has been reported.</h3>", '', {
              positionClass: "toast-top-full-width",
              closeButton:true, 
              // progressBar: true,
              timeOut: 10000});
            sendPrintScreenNoti.call(emailObj)
        }         
        // alert("The content of this assessment is protected.  Capturing, copying, printing, or reproducing in any manner is strictly prohibited.  Thank You.");
    }        
});

