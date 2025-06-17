/**
 * Admin Module Builder edit template
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'

import { Util } from '/imports/api/lib/util.js'

import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'
import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'
import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'
import { TrainingModuleDocumentsCFS } from '/both/api/collections/training-module-documents.js'
import { TrainingModuleTemplates } from '/both/api/collections/training-module-templates.js'
import { TrainingModuleQuizzes } from '/both/api/collections/training-module-quizzes.js'
import { TrainingModuleSurveys } from '/both/api/collections/training-module-surveys.js'

import { updateModulePage, updateModulePageVideo, updateModulePageAudio,
          addDocumentToPage, removeDocumentFromPage } from '/both/api/methods/training-module-pages.js'

// import '/imports/ui/stylesheets/admin/modules/admin-module-page-edit.less'
import { AdminModulePageEdit } from '/imports/ui/pages/admin/modules/admin-module-page-edit.html'

import { AdminVideoTemplate } from '/imports/ui/pages/admin/videos/admin-video-template.js'
import { AdminAudioTemplate } from '/imports/ui/pages/admin/audios/admin-audio-template.js'
import '/imports/ui/pages/admin/documents/admin-documents-template.js'

let _selfAdminModulePageEdit
let _subsAdminModulePageEdit

Template.AdminModulePageEdit.onCreated(function adminModulePageEditOnCreated() {

  _selfAdminModulePageEdit = this

  _subsAdminModulePageEdit = new SubsManager()
  //-- For some reason, this should be 'true'. Otherwise, it won't be true even 
  //-- though it's set to be true in the middle of the process, and, the Mini table 
  //-- will be loaded all the time, even outside this templa, which causes 
  //-- the Videos and Audios collection to hold 10 (as defined in the Mini Tabluar) 
  //-- video/audio data .
  //-- And, also wrapping the Mini Tabular with videoSubsReady or audioSubsReady
  //-- is necessary to clear any subscribed collection cache.
  //-- => Actually, ReacitveVar didn't work well, so, Session got used instead.
  //-- See videoSubsReady() and audioSubsReady for it.
  _selfAdminModulePageEdit.ready4Videos = new ReactiveVar(false)
  _selfAdminModulePageEdit.ready4Audios = new ReactiveVar(false)
  _selfAdminModulePageEdit.ready4Quizzes = new ReactiveVar(false)
  _selfAdminModulePageEdit.ready4Surveys = new ReactiveVar(false)
  _selfAdminModulePageEdit.ready4Documents = new ReactiveVar(false)

  _selfAdminModulePageEdit.pageDocuments = new ReactiveVar();

  Session.set('_selfAdminModulePageEdit.ready4Videos', false)
  Session.set('_selfAdminModulePageEdit.ready4VAudios', false)
  Session.set('_selfAdminModulePageEdit.ready4Documents', false)

  _selfAdminModulePageEdit.isTypeVideo = new ReactiveVar(false)
  _selfAdminModulePageEdit.isTypeCode = new ReactiveVar(false)
  _selfAdminModulePageEdit.isTypeQuiz = new ReactiveVar(false)
  _selfAdminModulePageEdit.isTypeSurvey = new ReactiveVar(false)

  // _selfAdminModulePageEdit.hasViewportComp = new ReactiveVar(false)

  // _selfAdminModulePageEdit.ready4PageTemplates = new ReactiveVar(false)
  _selfAdminModulePageEdit.ready4Templates = new ReactiveVar(false)

  // _selfAdminModulePageEdit.pageDurationHMS = new ReactiveVar()  

  Tracker.autorun(() => {

    if(_selfAdminModulePageEdit.isTypeVideo.get()) {      
      let handleVideos = _subsAdminModulePageEdit.subscribe("all_active_training_module_videos")
      _selfAdminModulePageEdit.ready4Videos.set(handleVideos.ready())

      // let handleCompTemplates = _subsAdminModulePageEdit.subscribe("active_training_module_templates_w_type", 'comp')
      // _selfAdminModulePageEdit.ready4Templates.set(handleCompTemplates.ready())
    }
    if(_selfAdminModulePageEdit.isTypeCode.get()) {
      let handleAudios = _subsAdminModulePageEdit.subscribe("all_training_module_audios_cfs")
      _selfAdminModulePageEdit.ready4Audios.set(handleAudios.ready())

      // let handlePageTemplates = _subsAdminModulePageEdit.subscribe("active_training_module_templates_w_type", 'page')
      // _selfAdminModulePageEdit.ready4Templates.set(handlePageTemplates.ready())      
    }
    if(_selfAdminModulePageEdit.isTypeQuiz.get()) {
      let handleQuizzes = _subsAdminModulePageEdit.subscribe("all_active_training_module_quizzes")
      _selfAdminModulePageEdit.ready4Quizzes.set(handleQuizzes.ready())   
    }
    if(_selfAdminModulePageEdit.isTypeSurvey.get()) {
      let handleSurveys = _subsAdminModulePageEdit.subscribe("all_active_training_module_surveys")
      _selfAdminModulePageEdit.ready4Surveys.set(handleSurveys.ready())
    }
    // if(_selfAdminModulePageEdit.hasViewportComp.get()) {
    //   let handleDocuments = _subsAdminModulePageEdit.subscribe("all_active_training_module_documents_cfs")
    //   _selfAdminModulePageEdit.ready4Documents.set(handleDocuments.ready())
    // }    
  })

})

Template.AdminModulePageEdit.onRendered(() => {
  // _selfAdminModulePageEdit.hasViewportComp.set(false)
  _selfAdminModulePageEdit.hasViewportComp = new ReactiveVar(false);

  Tracker.autorun(() => {
    if(_selfAdminModulePageEdit.hasViewportComp.get()) {
      let handleDocuments = _subsAdminModulePageEdit.subscribe("all_active_training_module_documents_cfs")
      _selfAdminModulePageEdit.ready4Documents.set(handleDocuments.ready())
    }
  })
})

Template.AdminModulePageEdit.helpers({
  Page() {    
    let page = TrainingModulePages.find(Session.get("pageToBuild")).fetch()
    // console.log(page)
    if(page && page.length > 0) {

      let type = page[0].type

      //-- Initial type condition to show/hide the form element.
      if(type === 'video') {
        _selfAdminModulePageEdit.isTypeVideo.set(true)
        _selfAdminModulePageEdit.isTypeCode.set(false)
        _selfAdminModulePageEdit.isTypeQuiz.set(false)
        _selfAdminModulePageEdit.isTypeSurvey.set(false)

        let handleCompTemplates = _subsAdminModulePageEdit.subscribe("active_training_module_templates_w_type", 'comp')
        _selfAdminModulePageEdit.ready4Templates.set(handleCompTemplates.ready())

        if(page[0].video && page[0].video.videoId) {
          let videoObj = TrainingModuleVideos.findOne(page[0].video.videoId)

          if(videoObj) {
            page[0].video.videoTitle = videoObj.title
          }
        }

      }
      else if(type === 'code') {
        _selfAdminModulePageEdit.isTypeVideo.set(false)
        _selfAdminModulePageEdit.isTypeCode.set(true)
        _selfAdminModulePageEdit.isTypeQuiz.set(false)
        _selfAdminModulePageEdit.isTypeSurvey.set(false)

        let handlePageTemplates = _subsAdminModulePageEdit.subscribe("active_training_module_templates_w_type", 'page')
        _selfAdminModulePageEdit.ready4Templates.set(handlePageTemplates.ready())     

        if(page[0].audio && page[0].audio.audioId) {
          let audioObj = TrainingModuleAudiosCFS.findOne(page[0].audio.audioId)

          if(audioObj) {
            page[0].audio.audioTitle = audioObj.title
          }      
        }
      }
      else if(type === 'quiz') {
        _selfAdminModulePageEdit.isTypeVideo.set(false)
        _selfAdminModulePageEdit.isTypeCode.set(false)
        _selfAdminModulePageEdit.isTypeQuiz.set(true)
        _selfAdminModulePageEdit.isTypeSurvey.set(false)

        // _selfAdminModulePageEdit.ready4Quizzes.set(true)
      }
      else if(type === 'survey') {
        _selfAdminModulePageEdit.isTypeVideo.set(false)
        _selfAdminModulePageEdit.isTypeCode.set(false)
        _selfAdminModulePageEdit.isTypeQuiz.set(false)
        _selfAdminModulePageEdit.isTypeSurvey.set(true)

        // _selfAdminModulePageEdit.ready4Surveys.set(true)
      }

      if(page[0].thisTemplate && page[0].thisTemplate[0] && page[0].thisTemplate[0]._id) {
        let myTemplate = {
          _id: page[0].thisTemplate[0]._id,
          systemName: page[0].thisTemplate[0].systemName          
        }

        if(myTemplate.systemName.includes("Viewport")) {
          _selfAdminModulePageEdit.hasViewportComp.set(true)
        } else {
          _selfAdminModulePageEdit.hasViewportComp.set(false)
        }

        if(page[0].thisTemplate[0].status === 1) {
          page[0].thisTemplate = myTemplate;
        } else {
          delete page[0].thisTemplate;
          delete page[0].template;
        }
      }

      if(page[0].document) {
        // _selfAdminModulePageEdit.pageDocuments.set(page.document);
        Session.set("AdminModulePageEdit.PageDocuments", page[0].document);
      } else {
        Session.set("AdminModulePageEdit.PageDocuments", null);
      }

      // console.log(page);

      return page
    }
  },
  Videos() {
    // if(_selfAdminModulePageEdit.ready4Videos.get()) {
      return TrainingModuleVideos.find()
    // }
  },
  Audios() {
    // if(_selfAdminModulePageEdit.ready4Audios.get()) {      
      return TrainingModuleAudiosCFS.find()
    // }
  },
  Quizzes() {
    // if(_selfAdminModulePageEdit.ready4Quizzes.get()) {
      return TrainingModuleQuizzes.find()
    // }
  },
  Surveys() {
    if(_selfAdminModulePageEdit.ready4Surveys.get()) {
      return TrainingModuleSurveys.find()
    }
  },
  Documents() {
    // if(_selfAdminModulePageEdit.ready4Audios.get()) {      
      return TrainingModuleDocumentsCFS.find()
    // }
  },     
  isTypeVideo() {
    return _selfAdminModulePageEdit.isTypeVideo.get()
  },
  isTypeCode() {
    return _selfAdminModulePageEdit.isTypeCode.get()
  },
  Templates() {
    let type = _selfAdminModulePageEdit.isTypeVideo.get() ? 'comp' : 'page'
    if(_selfAdminModulePageEdit.ready4Templates.get()) {
      return TrainingModuleTemplates.find({type: type})
    }
  },
  videosMiniTableSelector() {
    return {
      status: {$ne: 4}
    }
  },
  audiosMiniTableSelector() {
    return {
      status: {$ne: 4}
    }
  },
  documentsMiniTableSelector() {
    return {
      status: {$ne: 4}
    }
  },  
  videoSubsReady() {
    return Session.get('_selfAdminModulePageEdit.ready4Videos')
  }, 
  audioSubsReady() {
    return Session.get('_selfAdminModulePageEdit.ready4Audios')
  },
  documentsSubsReady() {
    return Session.get('_selfAdminModulePageEdit.ready4Documents')
  },  
  // pageDurationHMS() {
  //   return _selfAdminModulePageEdit.pageDurationHMS.get()
  // },
  // videoDurationHMS() {
  //   return _selfAdminModulePageEdit.videoDurationHMS.get()
  // } 
  hasViewportComp() {
    
    // console.log(_selfAdminModulePageEdit.hasViewportComp.get())

    return _selfAdminModulePageEdit.hasViewportComp.get();
  },
  AllDocuments() {
    if(Session.get('_selfAdminModulePageEdit.ready4Documents')) {
      let _docs = TrainingModuleDocumentsCFS.find().fetch();

      return _docs;
    }
  },
  PageDocuments() {
    // if(_selfAdminModulePageEdit.pageDocuments.get()) {
    //   console.log(_selfAdminModulePageEdit.pageDocuments.get())
    //   return _selfAdminModulePageEdit.pageDocuments.get();
    // }
    // console.log(Session.get("AdminModulePageEdit.PageDocuments"))
    if(Session.get("AdminModulePageEdit.PageDocuments")) {
      return Session.get("AdminModulePageEdit.PageDocuments");
    }
  } 
})

Template.AdminModulePageEdit.events({
  'click .btn-save-module-page-edit'(e, tpl) {
    e.preventDefault()

    let moduleId = $(e.currentTarget).data('mid')
    let pageId = $(e.currentTarget).data('pid')

    let pageTitle = $('#edit_input_page_title').val()
    let pageType = $('#edit_sel_page_type').val()
    let pageDesc = $('#edit_txta_page_desc').val()
    let pageTranscript = $('#edit_txta_page_transcript').val()
    let pageVideo = $('#edit_txta_video_src').val()
    // let componentTemplate = $('#edit_input_component_template').val()
    // let pageTemplate = $('#edit_input_page_template').val()
    let template = $('#edit_sel_template').val() //-- this will be template id
    let pageInst = $('#edit_txta_page_inst').val()

    let quizId = $('#edit_sel_quiz').val()    
    let quizType = parseInt($('#sel_quiz_type').val()) || 1
    let quizShowScoreFeedback = $('#quiz_show_score_feedback').is(':checked') || false

    let surveyId = $('#edit_sel_survey').val()

    let pageDuration = $('#edit_page_duration').val()
    let pageDurationHMS = $('#edit_page_duration_hms').val()

    let canGo = true

    if(pageTitle === '') {
      toastr.warning("Page title cannot be null.")
      canGo = false
    }

    if(pageType === '-1') {
      toastr.warning("Plase select a page type.")
      canGo = false
    }

    if(canGo) {
      let objPage = {
        _id: pageId,
        moduleId: moduleId,
        title: pageTitle,
        type: pageType,
        quizId: quizId,
        quizType: quizType,
        quizType: quizType,
        quizShowScoreFeedback: quizShowScoreFeedback,
        description: pageDesc,
        // video: {
        //   videoId: '',
        //   videoSrc: pageVideo,
        // },
        template: template,
        instructions: pageInst,     
        transcript: pageTranscript,
        duration: Number(pageDuration),
        durationHMS: pageDurationHMS
      }

      updateModulePage.call(objPage, function(err, res) {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })
    }
  },
  'click .btn-view-videos'(e, tpl) {
    e.preventDefault()

    _selfAdminModulePageEdit.ready4Videos.set(true) //-- Not working well

    Session.set('_selfAdminModulePageEdit.ready4Videos', true) //-- So, 'Session' comes in

    $('.row-module-page-edit-all-videos').show()
  },
  'click .btn-view-documents'(e, tpl) {
    e.preventDefault()

    _selfAdminModulePageEdit.ready4Documents.set(true) //-- Not working well

    Session.set('_selfAdminModulePageEdit.ready4Documents', true) //-- So, 'Session' comes in

    $('.row-module-page-edit-all-documents').show()
  },  
  'click .btn-close-module-page-edit-all-documents'(e, tpl) {
    e.preventDefault()

    _selfAdminModulePageEdit.ready4Documents.set(false) //-- Not working well

    Session.set('_selfAdminModulePageEdit.ready4Documents', false) //-- So, 'Session' comes in

    _subsAdminModulePageEdit.clear('all_active_training_module_documents_cfs')

    $('.row-module-page-edit-all-documents').hide() 
  },  
  'click .btn-close-module-page-edit-all-videos'(e, tpl) {
    e.preventDefault()

    _selfAdminModulePageEdit.ready4Videos.set(false) //-- Not working well

    Session.set('_selfAdminModulePageEdit.ready4Videos', false) //-- So, 'Session' comes in

    _subsAdminModulePageEdit.clear('all_active_training_module_video')

    $('.row-module-page-edit-all-videos').hide() 
  },
  'change #edit_sel_page_type'(e, tpl) {
    e.preventDefault()

    let type = $(e.currentTarget).val()

    if(type === 'video') {
      _selfAdminModulePageEdit.isTypeVideo.set(true)
      _selfAdminModulePageEdit.isTypeCode.set(false)
      _selfAdminModulePageEdit.isTypeQuiz.set(false)
    } 
    else if(type === 'code') {
      _selfAdminModulePageEdit.isTypeVideo.set(false)
      _selfAdminModulePageEdit.isTypeCode.set(true)
      _selfAdminModulePageEdit.isTypeQuiz.set(false)
    } else {
      _selfAdminModulePageEdit.isTypeVideo.set(false)
      _selfAdminModulePageEdit.isTypeCode.set(false)
      _selfAdminModulePageEdit.isTypeQuiz.set(true)
    }
  },
  'change #edit_sel_template'(e, tpl) {
    let type = $(e.currentTarget).val()
    let _selected = $(e.currentTarget).find(':selected').data('systemname');

    if(_selected && _selected.includes('ViewportComp')) {
      _selfAdminModulePageEdit.hasViewportComp.set(true)
    } else {
      _selfAdminModulePageEdit.hasViewportComp.set(false)
    }
  },
  'click .btn-view-audios'(e, tpl) {
    e.preventDefault()

    // _selfAdminModulePageEdit.ready4Audios.set(true)

    Session.set('_selfAdminModulePageEdit.ready4Audios', true) //-- 'Session' works better.

    _subsAdminModulePageEdit.clear('all_active_training_module_video')    

    $('.row-module-page-edit-all-audios').show()//.draggable()
  },
  'click .btn-close-module-page-edit-all-audios'(e, tpl) {
    e.preventDefault()

    // _selfAdminModulePageEdit.ready4Audios.set(false)
    Session.set('_selfAdminModulePageEdit.ready4Audios', false) //-- 'Session' works better.

    _subsAdminModulePageEdit.clear('all_training_module_audios_cfs')

    $('.row-module-page-edit-all-audios').hide() 
  },
  'change #edit_page_duration'(e, tpl) {
    e.preventDefault()

    let duration = Math.round($(e.currentTarget).val())
// console.log(duration)
    let durationHMS = Util.videoSecondsToHMS(duration)
// console.log(durationHMS)
    $('#edit_page_duration_hms').val(durationHMS)
    // _selfAdminModulePageEdit.pageDurationHMS.set(durationHMS)
    $(e.currentTarget).val(duration)
  },
  'click .checkbox-document'(e, tpl) {
    e.preventDefault();

    let _pageId = Session.get("pageToBuild");
    // console.log(_pageId, this);

    let 
      _isChecked = $(e.currentTarget).is(':checked'),
      _docId = this._id;

    let _obj = {
      pageId: _pageId,
      documentId: _docId
    }

    if(_isChecked) {
      addDocumentToPage.call(_obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })
    } else {
      removeDocumentFromPage.call(_obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }      
      })
    }
  }     
})

Template.AdminModulePageEdit.onDestroyed(()=>{
   Session.set('_selfAdminModulePageEdit.ready4Videos', false)
   Session.set('_selfAdminModulePageEdit.ready4Audios', false)
   Session.set('_selfAdminModulePageEdit.ready4Documents', false)
   Session.set("AdminModulePageEdit.PageDocuments", null);

  _subsAdminModulePageEdit.clear()
})

