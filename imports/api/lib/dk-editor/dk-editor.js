/**
 * dkEditor ver. 0.1
 *
 * @author David Kim
 */
'use strict'

class DKEditorInit {

  constructor ( selector, _document ) {

    //-- The container for dkEditor
    this._selector = selector
    this._container = $('#'+this._selector)

    //-- The container for the initial menu button, 
    //-- which is usually the parent elem of the editor container.
    this._document = _document ? $("'"+_document+"'") || $('#'+_document) :  $('#'+selector).parent()

    //-- Initial paragraph elem to get the editing area ready.
    this._dkParagraph = `<div class="dk-paragraph current"><br></div>`

    //-- Initialize the editor.
    this.init()
  }

  init() {
    
    //-- dkEditor stylesheet
    import './dk-editor.scss'

    //-- Get the positions for the initial elems.  
    this._createInitMenu()
    this._createTooltipMenu()

    this._createEditorContainer()
    // this._createInitMenu()
    this._eventListeners()

    // this._setInitPositions()
  }

  toString() {
    return `${this.selector}`
  }

  print() {
    console.log(this._selector)
  }

  bind(scope, fn) {
   return function() {
      return fn.apply(scope, arguments);
   }
  }  

  _setInitPositions() {
    
    //-- Place the initial menu at the bottom center of the editor container.
    // let parentOffset = this._document.offset()
    let editorContainerWidth = $('.dk-editor-container').width()
    let initMenuWidth = $('.dk-editor-init-menu').width()
    let initMenuLeft = (editorContainerWidth - initMenuWidth)/2

    $('.dk-editor-init-menu').css('margin-left', initMenuLeft +'px')
  }

  _createEditorContainer() {
    // const dkContainer = $('#'+this._selector)

    let elem = `<div class="dk-editor-container editable" contenteditable="true" role="textbox" 
      aria-multiline="true" tabindex="0">`
      elem += this._dkParagraph
      elem += `</div>`

    this._container.append(elem)

    this._setInitialCaretForcefully('current')
  }

  _createInitMenu() {
    
    let menuElem = 
      `<div class="dk-editor-init-menu">
        <button class="dk-editor-edit" title="Switch to Edit Mode">
          <span class="glyphicon glyphicon-pencil"></span>
        </button>
        <button class="dk-editor-preview" title="Preview">
          <span class="glyphicon glyphicon-eye-open"></span>
        </button>        
        <button class="dk-editor-config" title="Settings">
          <span class="glyphicon glyphicon-cog"></span>
        </button>
      </div>`

    // this._document.append(menuElem)
    // this._document.prepend(menuElem)
    this._container.append(menuElem)
  }

  _createTooltipMenu() {
    let tooltipMenuElem = 
        `<div class="dk-tooltip">
          <button class="btn btn-xs btn-default btn-dk-font-bold"> <i class="fa fa-bold"></i> </button>
          <button class="btn btn-xs btn-default btn-dk-font-italic"> <i class="fa fa-italic"></i> </button> 
          <button class="btn btn-xs btn-default btn-dk-font-underline"> <i class="fa fa-underline"></i> </button>
          <button class="btn btn-xs btn-default btn-dk-font-link"> <i class="fa fa-link"></i> </button> | 
          <button class="btn btn-xs btn-default btn-dk-font-header1"> <i class="fa fa-header"></i>1</button>
          <button class="btn btn-xs btn-default btn-dk-font-header2"> <i class="fa fa-header"></i>2</button>
          <button class="btn btn-xs btn-default btn-dk-font-header3"> <i class="fa fa-header"></i>3</button> |                     
          <button class="btn btn-xs btn-default btn-dk-font-superscript"> <i class="fa fa-superscript"></i> </button>
          <button class="btn btn-xs btn-default btn-dk-font-subscript"> <i class="fa fa-subscript"></i> </button> | 
          <button class="btn btn-xs btn-default btn-dk-font-quote"> <i class="fa fa-quote-left"></i> </button> -->
          <button class="btn btn-xs btn-default btn-dk-text-style" data-style="bold"><i class="fa fa-bold"></i> </button>
          <button class="btn btn-xs btn-default btn-dk-text-style" data-style="italic"> <i class="fa fa-italic"></i> </button> 
          <button class="btn btn-xs btn-default btn-dk-text-style" data-style="underline"> <i class="fa fa-underline"></i> </button> | 
          <button class="btn btn-xs btn-default btn-dk-text-style header1" data-style="header1"> <i class="fa fa-header"></i>1</button>
          <button class="btn btn-xs btn-default btn-dk-text-style header2" data-style="header2"> <i class="fa fa-header"></i>2</button>
          <button class="btn btn-xs btn-default btn-dk-text-style header3" data-style="header3"> <i class="fa fa-header"></i>3</button> | 
          <button class="btn btn-xs btn-default btn-dk-text-style superscript" data-style="superscript"> <i class="fa fa-superscript"></i> </button>
          <button class="btn btn-xs btn-default btn-dk-text-style subscript" data-style="subscript"> <i class="fa fa-subscript"></i> </button> | 
          <button class="btn btn-xs btn-default btn-dk-text-style" data-style="quote"> <i class="fa fa-quote-left"></i> </button>
          <button class="btn btn-xs btn-default btn-dk-text-style" data-style="link"> <i class="fa fa-link"></i> </button>
          <input type="text" class="input-dk-link">
          <button class="btn btn-xs btn-default btn-hide-link-input">x</button>
        </div>`

    this._tooltipMenu = tooltipMenuElem
  }

  _eventListeners() {

    let _self = this
    // document.addEventListener("keyup", this.bind(this, this.keyup()), false)
    // document.addEventListener("keyup", function(e) {
    //   console.log(e.keyCode)
    // })
    $('.dk-editor-container').bind("keyup", function(e) {
      e.preventDefault()
      // console.log(e.keyCode)
      // if(e.keyCode === 13) { //-- Enter key
      //   let currentParagraph = $('.dk-paragraph.current')
      //   $(currentParagraph[0]).removeClass('current')
      //   // $(getSelection().focusNode).addClass('current')
      //   // $('.dk-paragraph').removeClass('current')
      //   // $(':focus').addClass('current')
      //   // $(document.activeElement).addClass('current')
      //   // console.log($(':focus'), document.activeElement)
      // }
      if(e.keyCode === 13) { //-- Enter key
        $('.dk-paragraph.current').removeClass('current')
        let focusedParagraph = $(getSelection().focusNode)
        focusedParagraph.prev('.dk-paragraph.current').removeClass('current')
        $(focusedParagraph).addClass('current')
      }
      else if(e.keyCode === 40) { //-- Down arrow
        // $('.dk-paragraph.current').removeClass('current')
        
        let focusedParagraph = $(getSelection().focusNode)
        focusedParagraph.prev('.dk-paragraph.current').removeClass('current')  
        $(getSelection().focusNode).addClass('current')     
      }       
      else if(e.keyCode === 38) { //-- Upper arrow
        // $('.dk-paragraph.current').removeClass('current') 

        let focusedParagraph = $(getSelection().focusNode)      
        focusedParagraph.next('.dk-paragraph.current').removeClass('current')
        $(getSelection().focusNode).addClass('current')
      }
      else if(e.keyCode === 8) { //-- Back key
        $('.dk-paragraph.current').removeClass('current')
        // let focusedParagraph = $(getSelection().focusNode)
        // focusedParagraph.next('.dk-paragraph.current').removeClass('current')
        $(getSelection().focusNode).addClass('current')
      }

      // $(e.currentTarget).append(this._dkParagraph)
// console.log(getSelection().focusNode, getSelection().getRangeAt(0).focusNode)
      // $(document.activeElement).addClass('active')

      // $(getSelection().focusNode).addClass('current')
    })

    $('.dk-editor-container').bind("mouseup", function(e) {
      e.preventDefault()

      let selection = _self._getSelectedText()
      let selectionText = selection.toString()

      if(selectionText !== '') {

        let selectionPos = _self._getSelectionPosition()      

        let tooltipX = selectionPos.left
        let tooltipR = selectionPos.right
        let tooltipY = selectionPos.top

        console.log(selectionText, selectionPos)
        // let tooltipC = ($('.post-editor-container .post-tooltip').outerWidth()+selectionPos.width)/2+3      
        
        // $('.post-editor-container .post-tooltip').show().css({        
        //   left: tooltipR-tooltipC + 'px',
        //   top: tooltipY-40 + 'px',
        // })

      }
        $('.dk-paragraph.current').removeClass('current')
        let focusedParagraph = $(getSelection().focusNode)
           
      // $(e.currentTarget).append(this._dkParagraph)
// console.log(getSelection().focusNode, getSelection().getRangeAt(0).focusNode)
      // $(document.activeElement).addClass('active')

      $(getSelection().focusNode).addClass('current')
    })

    // $(document.activeElement).addClass('active')
    // console.log(getSelection().getRangeAt(0).commonAncestorContainer.parentNode)
  }

  // keyup(e) {
  //   console.log('bbb', this)
  // }

  parents (selector) {
    var elements = [];
    var elem = this;
    var ishaveselector = selector !== undefined;
   
    while ((elem = elem.parentElement) !== null) {
      if (elem.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }
   
      if (!ishaveselector || elem.matches(selector)) {
        elements.push(elem);
      }
    }
   
    return elements;
  }

  _setInitialCaretForcefully(className) {
    let ___cur = document.getElementsByClassName(className)[0]
    let ___s = window.getSelection()
    let ___r = document.createRange()
    ___r.setStart(___cur, 0)
    ___r.setEnd(___cur, 0)
    ___s.removeAllRanges()
    ___s.addRange(___r)

    $(___cur).trigger('mouseup')    
  }

  _getSelectedText() {
    let t = (document.all) ? document.selection.createRange().text : document.getSelection()
    return t
  }

  _getSelectionPosition() {
    s = window.getSelection();
    oRange = s.getRangeAt(0); //get the text range
    oRect = oRange.getBoundingClientRect();

    return oRect
  }  
}

export default class DKEditor extends DKEditorInit {
  constructor( selector, _document ) {
    // this._selector = selector

    super(selector, _document)

    // console.log('from EKEditorActions', super.print())
  }
}

// const dkEditorActions = new DKEditorActions()

