/**
 * Input Findings template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { upsertUserStats } from '/both/api/methods/training-module-user-stats.js'

// import '/imports/ui/stylesheets/templates/input-findings.less'
import { InputFindings } from '/imports/ui/pages/templates/comp-templates/input-findings.html'

let _selfInputFindings

Template.InputFindings.onCreated(function inputFindingsOnCreated() {

  _selfInputFindings = this

  _selfInputFindings.ready4FindingsInputButton = new ReactiveVar(false)

})

Template.InputFindings.onRendered(function inputFindingsOnRendered() {  

  let iframe = $('.sproutvideo-player')
  let iframeSrc = $(iframe).attr('src')

  let videoId = iframeSrc.split('embed/')[1].split('/')[0]
  
  // console.log(videoId);

  if(videoId !== '') {
    let player = new SV.Player({videoId: videoId})

    player.bind('completed', function() {
      // $(".findings-input-button-container").css("display", "block");
      _selfInputFindings.ready4FindingsInputButton.set(true)      
    })  

    player.bind('progress', function(e) {
      _selfInputFindings.ready4FindingsInputButton.set(false)
      if(!$('.dummy-to-focus').is(':focus')) {
        $('.dummy-to-focus').focus()
      }
    })

    player.bind('pause', function() {
      if(!$('.dummy-to-focus').is(':focus')) {
        $('.dummy-to-focus').focus()
      }
    })    
  }

  $('.input-findings-document').draggable({
    containment: $(this).parent(),
    stop: function(event, ui) {
        // event.toElement is the element that was responsible
        // for triggering this event. The handle, in case of a draggable.
        $( event.originalEvent.target ).one('click', function(e){ e.stopImmediatePropagation(); } );
    }    
  }) 

  $('.user-input-label').html("Your Findings: ")
  $('.elem-user-input').show()

  Tracker.autorun(() => {
    $('#txta_user_input').val(Session.get('userFindingsInput'))  
  })
  
})

Template.InputFindings.helpers({
  isInitialTextOn() {

  },
  isFindingsInputButtonOn() {    
    return _selfInputFindings.ready4FindingsInputButton.get()
  }
})

Template.InputFindings.events({
  'click .btn-view-all-documents'(e, tpl) {
    e.preventDefault()

    $('.row-input-findings-all-documents-top').fadeIn(500)
    $('.row-input-findings-all-documents').fadeIn(500)

    $("#input_findings_intro_modal").modal('show')    
  },
  'click .btn-close-all-documents'(e, tpl) {
    e.preventDefault()

    $('.row-input-findings-all-documents-top').fadeOut(500)
    $('.row-input-findings-all-documents').fadeOut(500)
    $('.findings-input-box-container').hide()
  },
  'click .btn-view-findings-input-box'(e, tpl) {
    e.preventDefault()

    $('.findings-input-box-container').show()
  },
  'click .btn-close-findings-box'(e, tpl) {
    e.preventDefault()

    $('.findings-input-box-container').fadeOut(500).draggable({
      containment: $('.row-input-findings-all-documents')
    })    
  },
  'click .btn-save-findings'(e, tpl) {
    e.preventDefault()

    let input = $('.txa-findings-input').val()

    if(input !== '') {      
      Session.set('userFindingsInput', input)
      toastr.info("Successfully saved.")
      // $('#txta_user_input').val(input)
      $('.findings-input-box-container').hide()
    } else {
      toastr.warning("Nothing to save. Please add a note and try again.")
    }
  },
  'click .btn-submit-findings'(e, tpl) {
    e.preventDefault()

    let input = $('.findings-input-box-container .txa-findings-input').val()

    if(Session.get('userFindingsInput') && Session.get('userFindingsInput') !== '') {

      let 
        currentPageIdx = Session.get("Module.currentPageIdx"),
        _myUserStats = Session.get('myUserStats');

      _myUserStats.pages.push(currentPageIdx)

      Session.set("Modules.template.comp.done", true)
      Session.set('myUserStats', _myUserStats)

      //   _pages = Session.get('myUserStats').pages,
      //   _newPages = _pages.push(currentPageIdx);
        
      // Session.set('myUserStats.pages', _newPages)

      // let statsObj = {
      //   userId: Meteor.userId(),
      //   moduleId: _selfModuleFooter.pageData.moduleId,
      //   _page: _selfModuleFooter.pageData.index,
      //   // numPages: _selfModuleFooter.pageData.numPages,            
      //   numPages: _selfModuleFooter.data.data.numPages, //-- For some reason, only this works            
      //   viewedPages: _selfModuleFooter.pageData.viewedPages,            
      //   completedAt: _selfModuleFooter.pageData.completedAt
      // }

      let statsObj = Session.get("Module.statsObj")

      upsertUserStats.call(statsObj, (err, res) => {
        if(err) {}
        else {
          Session.set('myUserStats', res)
          //-- This should be delayed. Otherwise, the page title 
          //-- will change to the viewed style immediated it's open.
          // _selfModule.pages = res.pages 

          // $('.btn-module-navigation.btn-go-next').not('.btn-disabled').webuiPopover('show');

          // if($('.btn-module-navigation.btn-go-next').hasClass('btn-disabled')) {
          //   $('#module_complete_modal').modal('show')
          // }              
          
          $('.btn-go-next').trigger('click')
        }
      })

      // $('.btn-go-next').trigger('click')

      // let curIndex = _selfModule.currentPageIdx.get()

      // if(Session.get('myUserStats').pages.indexOf(curIndex) !== -1) {
      //   let newIndex = curIndex +1
      //   _selfModule.currentPageIdx.set(newIndex)
      // } else {
      //   toastr.warning("Please complete all the page materials to move on to the next page.")
      // }

    } else {
      toastr.error("Please enter and submit all your findings to move on to the next slide.")
    }
  },  
  // 'click .btn-submit-findings-n-move'(e, tpl) {
  //   e.preventDefault()

  //   let input = $('.txa-findings-input').val()

  //   if(input !== '') {      
  //     Session.set('userFindingsInput', input)
  //   }

  //   // FlowRouter.go('/modules/3/10')    
  // }   
  'click .btn-zoomin-document'(e, tpl) {
    e.preventDefault()

    let vp = $(e.currentTarget).data('vp')

    let thisDoc = $('.input-findings-document-'+vp)

    thisDoc.css({
        width: thisDoc.width() * 1.1,
        height: thisDoc.height() * 1.1,
    })
  }, 
  'click .btn-zoomout-document'(e, tpl) {
    e.preventDefault()

    let vp = $(e.currentTarget).data('vp')

    let thisDoc = $('.input-findings-document-'+vp)

    thisDoc.css({
        width: thisDoc.width() * 0.9,
        height: thisDoc.height() * 0.9
    })
  },     
})


