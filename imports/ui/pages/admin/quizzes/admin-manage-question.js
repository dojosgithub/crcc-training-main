/**
 * Admin Manage Question template logic
 *
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { TrainingModuleQuestions } from '/both/api/collections/training-module-questions.js'

// import '/imports/ui/stylesheets/admin/quizzes/admin-manage-question.less'
// import '/imports/ui/stylesheets/question.less'
import '/imports/ui/pages/admin/quizzes/admin-manage-question.html'

// import '/imports/ui/pages/admin/quizzes/admin-question-image.js'
// import '/imports/ui/pages/admin/quizzes/admin-question-video.js'
// import '/imports/ui/pages/admin/quizzes/admin-question-audio.js'

let _selfAdminManageQuestion
// let _myQ2Mng

Template.AdminManageQuestion.onCreated(function adminManageQuestion() {
  _selfAdminManageQuestion = this

  _selfAdminManageQuestion.Question = this.data.Question
  // _selfAdminManageQuestion.Qid = this.data.Qid
  // // console.log(_selfAdminManageQuestion.Question)

  // console.log(_selfAdminManageQuestion.Qid)
  // Tracker.autorun(() => {

  // console.log(Session.get('curQid'))  

  //   _myQ2Mng = TrainingModuleQuestions.findOne({
  //     _id: Session.get('curQid')
  //   })

  //   console.log(_myQ2Mng)

  //   if(_myQ2Mng && _myQ2Mng.content) {
  //     $('.question-body').html(_myQ2Mng.content)
  //   }
  //   // $('.question-body').html(_myQ2Mng.content)
  // })
  

})

Template.AdminManageQuestion.onRendered(function adminManageQuestionOnRendered() {
  // console.log(getSelectedParagraphText())
  $(".editable div").initialize( function(e) {
    // $(this).css("background-color", "yellow")
    // $(this).addClass('question-pagraph')
    // console.log("dom changed", $(this))

    $(this).addClass('question-paragraph') 

    // let pos = $(this).position()
    // let x = pos.left
    // let y = pos.top

    // $('.quiz-question-settings-container .media-circle-container').show().css({
    //   // left: '-17px',
    //   left: (x-33)+'px',
    //   top: y +2 +'px'
    // })

    // console.log("from initialize => ", $(this).length, $(this).html(), e.which)

    // Session.set('currentQuestionParagraph', this)

    // $('.question-paragraph.init').bind('click', function(e) {
    //   let content = $(this).html()
    //     console.log(content)
    //   if(content === 'Type your question text') {
    //     $(this).empty()
    //   }
    // })

  })

  // _selfAdminManageQuestion.Question = this.data.Question

  // $('.quiz-question-settings-container .question-body').html(_selfAdminManageQuestion.Question.content)  

  // Tracker.autorun(() => {
  //   console.log(Session.get('curQid'))
  //   if(Session.get('curQid')) {
  //     let test = $('#test').val()
  //     console.log(test)
  //     $('.question-body').html(test) 
  //   }
  // })
  // let test = $('#test').val()
  // $('.quiz-question-settings-container .question-body').html(test)
})

Template.AdminManageQuestion.helpers({
  Question() {
    return _selfAdminManageQuestion.Question
    // return Tracker.nonreactive(function() {
      // return _selfAdminManageQuestion.Question
    // })

    // let myQ = localStorage.getItem('myq')
// console.log("myQ from AMQ", myQ)

    // $('.question-body').html(JSON.parse(myQ).content)

    // return JSON.parse(myQ)


  },
  // contenteditable() {
  //   return '<div class="question-body editable" contenteditable="true" role="textbox" aria-multiline="true" tabindex="0">'+this.content+'</div>'   
  //   // return '<div class="question-body editable" contenteditable="true" role="textbox" aria-multiline="true" tabindex="0">this.content</div>'   
  // }
})

Template.AdminManageQuestion.events({
  'click .btn-close-admin-manage-question'(e, tpl) {
    e.preventDefault()

    $('.row-admin-manage-question').hide()
  },
   'mouseup .editable'(e, tpl) {
    e.preventDefault()

    $('.btn-question-text-style').removeClass('active')
    $('div.question-paragraph span').removeClass('current-node')
    $('.quiz-question-settings-container .question-tooltip').hide()
    // $(e.currentTarget).blur()
    // console.log(getSelectedParagraphText())
    // getSelectedParagraphText()
    // let text = getSelectionText()

    // console.log(text)

    // markSelection()

    let selection = getSelectedText();    
    // let selectionHTML = getSelectedHTML()
    // let selectionHtml = getSelectionHtml()
    let selection_text = selection.toString();
    
    let containerNode = getSelectionContainerElement()

  // console.log(selection_text)

    if(selection_text !== '') {
      // let span = document.createElement('SPAN')
      // span.textContent = selection_text
      // span.className = 'bold'
      
      // let range = selection.getRangeAt(0)
      // range.deleteContents()
      // range.insertNode(span)

      // console.log(selection_text, selection_text.length)
      // console.log(selection_text, selection, selectionHTML, selectionHtml)

      let selectionPos = getSelectionPosition()      

      let tooltipX = selectionPos.left
      let tooltipR = selectionPos.right
      let tooltipY = selectionPos.top
      let tooltipC = ($('.quiz-question-settings-container .question-tooltip').outerWidth()+selectionPos.width)/2
      // let tooltipC = selectionPos.width/2
      
      $('.quiz-question-settings-container .question-tooltip').show().css({
        // left: tooltipX-tooltipC + 'px',
        left: tooltipR-tooltipC + 'px',
        top: tooltipY-40 + 'px',
      })

      let classes = $(containerNode).attr('class')

      if(classes) {
        if(classes.includes('bold')) {
          $('[data-style="bold"]').addClass('active')
        }
        if(classes.includes('italic')) {
          $('[data-style="italic"]').addClass('active')
        }
        if(classes.includes('underline')) {
          $('[data-style="underline"]').addClass('active')
        }            
       if(classes.includes('header1')) {
          $('[data-style="header1"]').addClass('active')
        } 
       if(classes.includes('header2')) {
          $('[data-style="header2"]').addClass('active')
        } 
       if(classes.includes('header3')) {
          $('[data-style="header3"]').addClass('active')
        } 
       if(classes.includes('superscript')) {
          $('[data-style="superscript"]').addClass('active')
        } 
       if(classes.includes('subscript')) {
          $('[data-style="subscript"]').addClass('active')
        } 
      }

    } else {
      $('.quiz-question-settings-container .question-tooltip').hide()
    }

    let div = $(e.currentTarget)

    // console.log("mouseup: ", e.which,  div)
    // console.log("containerNode1 -> ", containerNode, $(containerNode).html().length, $(containerNode).html())

    // console.log(selection_text, selection_text.length, containerNode)

    if(!$(containerNode).hasClass('question-title')) {
      if(($(containerNode).hasClass('question-paragraph')      
          && $(containerNode).html() === '<br>') 
          || 
          //-- The very initial move into the question body area.
          //-- This would be mostly by mouse click.
          ($(containerNode).hasClass('editable') 
          && $(containerNode).html().length === 0)) {

            $('div').removeClass('current')
          // if(e.which !== 13 ) {
            let pos = $(containerNode).position()
            let x = pos.left
            let y = pos.top

            let deltaY = 2
            // if($(containerNode).hasClass('question-body')) {
            //   deltaY = 9
            // }
            // else if($(containerNode).hasClass('question-abstract')) {
            //   deltaY = 17
            // }         
            
            let left = $(containerNode).hasClass('question-paragraph') ? x-33 : x-27
            let top = y+deltaY
            $('.quiz-question-settings-container .media-circle-container').show().css({
              // left: '-17px',
              left: left+'px',
              top: top +'px'
            })

          $('.quiz-question-settings-container .btn-view-media-icons').show().removeClass('on').addClass('off').blur()
          $('.quiz-question-settings-container .li-add-media').removeClass('on').addClass('off').hide()
          $('.quiz-question-settings-container .question-tooltip').hide()
          
          $(containerNode).addClass('current')
        // }  
      }
      else {
        $('.quiz-question-settings-container .btn-view-media-icons').removeClass('on').addClass('off').hide()
        $('.quiz-question-settings-container .li-add-media').removeClass('on').addClass('off').hide()
      }
    }
  }, 
  'mouseup .editable0'(e, tpl) {
    e.preventDefault()

    $('.quiz-question-settings-container .question-tooltip').hide()
    // $(e.currentTarget).blur()
    // console.log(getSelectedParagraphText())
    // getSelectedParagraphText()
    // let text = getSelectionText()

    // console.log(text)

    // markSelection()


    let selection = getSelectedText();
    let selection_text = selection.toString();
    
  // console.log(selection_text)

    if(selection_text !== '') {
      // let span = document.createElement('SPAN')
      // span.textContent = selection_text
      // span.className = 'bold'
      
      // let range = selection.getRangeAt(0)
      // range.deleteContents()
      // range.insertNode(span)

      // console.log(selection_text, selection_text.length)
      let selectionPos = getSelectionPosition()      

      let tooltipX = selectionPos.left
      let tooltipR = selectionPos.right
      let tooltipY = selectionPos.top
      let tooltipC = ($('.quiz-question-settings-container .question-tooltip').outerWidth()+selectionPos.width)/2
      // let tooltipC = selectionPos.width/2

      $('.quiz-question-settings-container .question-tooltip').show().css({
        // left: tooltipX-tooltipC + 'px',
        left: tooltipR-tooltipC + 'px',
        top: tooltipY-40 + 'px',
      })

      // console.log(selection_text, $('.quiz-question-settings-container .question-tooltip').outerWidth(), selectionPos)

    } else {
      $('.quiz-question-settings-container .question-tooltip').hide()
    }

    let div = $(e.currentTarget)

    // console.log("mouseup: ", e.which,  div)

    let containerNode = getSelectionContainerElement()
    // console.log("containerNode1 -> ", containerNode, $(containerNode).html().length, $(containerNode).html())

    // console.log(selection_text, selection_text.length, containerNode)

    if(!$(containerNode).hasClass('question-title')) {
      if(($(containerNode).hasClass('question-paragraph')      
          && $(containerNode).html() === '<br>') 
          || 
          //-- The very initial move into the question body area.
          //-- This would be mostly by mouse click.
          ($(containerNode).hasClass('editable') 
          && $(containerNode).html().length === 0)) {

            $('div').removeClass('current')
          // if(e.which !== 13 ) {
            let pos = $(containerNode).position()
            let x = pos.left
            let y = pos.top

            let deltaY = 2
            if($(containerNode).hasClass('question-body')) {
              deltaY = 9
            }
            else if($(containerNode).hasClass('question-abstract')) {
              deltaY = 17
            }         
            
            let left = $(containerNode).hasClass('question-paragraph') ? x-33 : x-27
            let top = y+deltaY
            $('.quiz-question-settings-container .media-circle-container').show().css({
              // left: '-17px',
              left: left+'px',
              top: top +'px'
            })

          $('.quiz-question-settings-container .btn-view-media-icons').show().removeClass('on').addClass('off').blur()
          $('.quiz-question-settings-container .li-add-media').removeClass('on').addClass('off').hide()
          $('.quiz-question-settings-container .question-tooltip').hide()
          
          $(containerNode).addClass('current')
        // }  
      }
      else {
        $('.quiz-question-settings-container .btn-view-media-icons').removeClass('on').addClass('off').hide()
        $('.quiz-question-settings-container .li-add-media').removeClass('on').addClass('off').hide()
      }
    }
  },
  'keyup .editable'(e, tpl) {
    e.preventDefault()

    $('.quiz-question-settings-container .question-tooltip').hide()

    // console.log(e.which)
    if(e.which === 13) { //-- Enter key
      // $(e.currentTarget).addClass('question-pagraph')
    }
    else if(e.which === 38) { //-- Up arrow

    }
    else if(e.which === 40) { //-- Down arrow

    }
    else if(e.which === 8) { //-- Delete key
      // console.log("Delete Key")
    }  

    let containerNode = getSelectionContainerElement()
    // console.log("containerNode2 -> ", containerNode, $(containerNode).html().length, $(containerNode).html())
    if(!$(containerNode).hasClass('question-title')) {
      if(($(containerNode).hasClass('question-paragraph')
          && !$(containerNode).hasClass('question-title') 
          && $(containerNode).html() === '<br>') 
          || 
          //-- The very initial move into the question body area.
          //-- This would be mostly by mouse click, but, just in case.        
          ($(containerNode).hasClass('editable')
          && $(containerNode).html().length === 0)) {

            $('div').removeClass('current')
          // if(e.which !== 13 ) {
            let pos = $(containerNode).position()
            let x = pos.left
            let y = pos.top

            let deltaY = 2
            if($(containerNode).hasClass('question-body')) {
              deltaY = 9
            }
            else if($(containerNode).hasClass('question-abstract')) {
              deltaY = 17
            }           

            let left = $(containerNode).hasClass('question-paragraph') ? x-33 : x-27
            let top = y+deltaY
            $('.quiz-question-settings-container .media-circle-container').show().css({
              // left: '-17px',
              left: left+'px',
              top: top +'px'
            })

          $('.quiz-question-settings-container .btn-view-media-icons').show().removeClass('on').addClass('off').blur()
          $('.quiz-question-settings-container .li-add-media').removeClass('on').addClass('off').hide()

          $(containerNode).addClass('current')
        // }  
      } else {
        $('.quiz-question-settings-container .btn-view-media-icons').removeClass('on').addClass('off').hide()
        $('.quiz-question-settings-container .li-add-media').removeClass('on').addClass('off').hide()
      }

      $('.quiz-question-settings-container .question-tooltip').hide()
    }

//     let tempContent = ''
//     $('.quiz-question-settings-container .question-body .question-paragraph').each(function(i, q) {
//       // console.log(q.innerHTML)
//       tempContent += q.innerHTML
//     })
// console.log(tempContent)
//     $('#tempContent').val(tempContent)

  },
  // 'keypress .editable'(e, tpl) {
  //   e.preventDefault()

  //   if(e.which === 13) { //-- Enter key

  //     let div = $(e.currentTarget).closest('div')

  //     console.log('keypress => ', div)
  //   }
  // },  
  'click .btn-view-media-icons.off'(e, tpl) {
    e.preventDefault()

    $(e.currentTarget).removeClass('off').addClass('on').blur()
    $('.quiz-question-settings-container .li-add-media').show().removeClass('off').addClass('on')
  },
  'click .btn-view-media-icons.on'(e, tpl) {
    e.preventDefault()

    $(e.currentTarget).removeClass('on').addClass('off').blur()
    $('.quiz-question-settings-container .li-add-media').removeClass('on').addClass('off').hide()

    // let x = $(e.currentTarget).position().left
    // let y = $(e.currentTarget).position().top

    // $('.li-add-image').css({
    //   top: 
    // })

  },
  'click .btn-add-media'(e, tpl) {
    e.preventDefault()

    let elem = $(e.currentTarget)

    elem.blur()

    $('.row-admin-question-media').hide()

    if(elem.hasClass('add-image')) {
      $('.row-admin-question-image').show()
    }
    else if(elem.hasClass('add-video')) {    
      $('.row-admin-question-video').show()
    }
    else {
      $('.row-admin-question-audio').show()
    }
  },
  'click .btn-question-text-style'(e, tpl) {
    e.preventDefault()

    let currentTarget = $(e.currentTarget)

    let styleClass = currentTarget.data('style')

    let containerNode = getSelectionContainerElement()
    let selection = getSelectedText()
    let selection_text = selection.toString()

    if(currentTarget.hasClass('active')) {
      currentTarget.removeClass('active') //-- Take the style button back to normal

      if($(containerNode).hasClass(styleClass)) { //-- When being fresh pressed 
        $(containerNode).removeClass(styleClass)
      } else { //-- When being pressed again, find the current-node and remove the style applied
        $('span.current-node').removeClass(styleClass)
      }
  
    } else {
      if(selection_text !== '') {
        let tagName = $(containerNode).prop('tagName')

        if(tagName === 'SPAN') {
          $(containerNode).addClass(styleClass)
        } else {
          let span = document.createElement('SPAN')
          span.textContent = selection_text
          span.className = styleClass + ' current-node' //-- Adding 'current-node' is critical to select/apply another style right away.
        
          let range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(span)
        }
      } else { //-- When another style button in the tooltip is pressed

        if(styleClass.includes('header')) {
          $('.header1,.header2,.header3').removeClass('active')
          $('span.current-node').removeClass('header1 header2 header3')
        }
        if(styleClass.includes('script')) {
          $('.superscript,.subscript').removeClass('active')
          $('span.current-node').removeClass('superscript subscript')

          $('.header1,.header2,.header3').removeClass('active')
          $('span.current-node').removeClass('header1 header2 header3')
        }        
        //-- select the current node and add the style class to it.
        $('span.current-node').addClass(styleClass)
      }   

      currentTarget.addClass('active') //-- Make the style button active.
    }
  }, 
})

function getSelectedParagraphText() {
  if (window.getSelection) {
      selection = window.getSelection();
  } else if (document.selection) {
      selection = document.selection.createRange();
  }
  var parent = selection.anchorNode;
  while (parent != null && parent.localName != "P") {
    parent = parent.parentNode;
  }
  console.log(selection, selection.getRangeAt(0), parent)
  if (parent == null) {
    return "";
  } else {
    return parent.innerText || parent.textContent;
  }
}

function getSelectionText() {
    var text = "", selection;
    if (window.getSelection) {
        selection = window.getSelection();
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        selection = document.selection;
        text = document.selection.createRange().text;
    }

    oRange = selection.getRangeAt(0); //get the text range
    oRect = oRange.getBoundingClientRect();
    
    console.log(oRange, oRect);

    return text;
}

function getSelectedText() {
  t = (document.all) ? document.selection.createRange().text : document.getSelection();

  return t;
}

function getSelectionContainerElement() {
    var range, sel, container;
    if (document.selection && document.selection.createRange) {
        // IE case
        range = document.selection.createRange();
        return range.parentElement();
    } else if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt) {
            if (sel.rangeCount > 0) {
                range = sel.getRangeAt(0);
            }
        } else {
            // Old WebKit selection object has no getRangeAt, so
            // create a range from other selection properties
            range = document.createRange();
            range.setStart(sel.anchorNode, sel.anchorOffset);
            range.setEnd(sel.focusNode, sel.focusOffset);

            // Handle the case when the selection was selected backwards (from the end to the start in the document)
            if (range.collapsed !== sel.isCollapsed) {
                range.setStart(sel.focusNode, sel.focusOffset);
                range.setEnd(sel.anchorNode, sel.anchorOffset);
            }
        }

        if (range) {
           container = range.commonAncestorContainer;

           // Check if the container is a text node and return its parent if so
           return container.nodeType === 3 ? container.parentNode : container;
        }   
    }
}

function getSelectionPosition() {
  s = window.getSelection();
  oRange = s.getRangeAt(0); //get the text range
  oRect = oRange.getBoundingClientRect();

  return oRect;
}

// var observeDOM = (function(){
//     var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
//         eventListenerSupported = window.addEventListener;

//     return function(obj, callback){
//         if( MutationObserver ){
//             // define a new observer
//             var obs = new MutationObserver(function(mutations, observer){
//                 if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
//                     callback();
//             });
//             // have the observer observe foo for changes in children
//             obs.observe( obj, { childList:true, subtree:true });
//         }
//         else if( eventListenerSupported ){
//             obj.addEventListener('DOMNodeInserted', callback, false);
//             obj.addEventListener('DOMNodeRemoved', callback, false);
//         }
//     };
// })();

// // Observe a specific DOM element:
// observeDOM( document.getElementById('dom_element') ,function(){ 
// // observeDOM( document.getElementsByClassName('editable') ,function(){ 
//     console.log('dom changed');
// });

// var markSelection = (function() {
//     var markerTextChar = "\ufeff";
//     var markerTextCharEntity = "&#xfeff;";

//     var markerEl, markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);

//     var selectionEl;

//     return function() {
//         var sel, range;

//         if (document.selection && document.selection.createRange) {
//             // Clone the TextRange and collapse
//             range = document.selection.createRange().duplicate();
//             range.collapse(false);

//             // Create the marker element containing a single invisible character by creating literal HTML and insert it
//             range.pasteHTML('<span id="' + markerId + '" style="position: relative;">' + markerTextCharEntity + '</span>');
//             markerEl = document.getElementById(markerId);
//         } else if (window.getSelection) {
//             sel = window.getSelection();

//             if (sel.getRangeAt) {
//                 range = sel.getRangeAt(0).cloneRange();
//             } else {
//                 // Older WebKit doesn't have getRangeAt
//                 range.setStart(sel.anchorNode, sel.anchorOffset);
//                 range.setEnd(sel.focusNode, sel.focusOffset);

//                 // Handle the case when the selection was selected backwards (from the end to the start in the
//                 // document)
//                 if (range.collapsed !== sel.isCollapsed) {
//                     range.setStart(sel.focusNode, sel.focusOffset);
//                     range.setEnd(sel.anchorNode, sel.anchorOffset);
//                 }
//             }

//             range.collapse(false);

//             // Create the marker element containing a single invisible character using DOM methods and insert it
//             markerEl = document.createElement("span");
//             markerEl.id = markerId;
//             markerEl.appendChild( document.createTextNode(markerTextChar) );
//             range.insertNode(markerEl);
//         }

//         if (markerEl) {
//             // Lazily create element to be placed next to the selection
//             if (!selectionEl) {
//                 selectionEl = document.createElement("div");
//                 selectionEl.style.border = "solid darkblue 1px";
//                 selectionEl.style.backgroundColor = "lightgoldenrodyellow";
//                 selectionEl.innerHTML = "&lt;- selection";
//                 selectionEl.style.position = "absolute";

//                 document.body.appendChild(selectionEl);
//             }

//             // Find markerEl position http://www.quirksmode.org/js/findpos.html
//         var obj = markerEl;
//         var left = 0, top = 0;
//         do {
//             left += obj.offsetLeft;
//             top += obj.offsetTop;
//         } while (obj = obj.offsetParent);

//             // Move the button into place.
//             // Substitute your jQuery stuff in here
//             selectionEl.style.left = left + "px";
//             selectionEl.style.top = top + "px";

//             markerEl.parentNode.removeChild(markerEl);
//         }
//     };
// })();




