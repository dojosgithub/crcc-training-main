import { Session } from 'meteor/session'

import React, { useState } from 'react';
import { Document, Outline, Page, pdfjs } from 'react-pdf';

// import styled from "styled-components";

import Modal from 'react-modal';
import Draggable from 'react-draggable'; 

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// import samplePDF from '/sample.pdf';

import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import { getOwnPropertySymbols } from 'core-js/fn/object';

import { saveNote, getPageMonitoringNote } from '/both/api/methods/training-module-monitoring-notes.js';

import { insertLog } from '/both/api/methods/training-module-logs.js';
import { insertUserLog } from '/both/api/methods/training-module-user-logs.js';

const viewportReactModalInitStyles = {
  overlay: {
    top: '15%',
    display: "flex",
    justifyContent: "center",
    // alignItems: "center",
    pointerEvents: "none",
    background: "none", 
    zIndex: '1111'   
  },
  content : {  
    bottom: "unset",
    overflow: "visible",
    padding: 0,
    border: "none",
    borderRadius: 0,
    position: "static",
    background: "none",
    pointerEvents: "none"     
  },
  container: {
    pointerEvents: 'all',
    backgroundColor: '#eef3f5'  
  },
  top: {
    height: '35px',
    padding: '5px 10px',
    cursor: 'move',
    backgroundColor: '#7298b9',
    marginBottom: '10px'  
  },
  body: {
    padding: '0 10px 10px'
  },
  instruction: {
    width: '600px',
    padding: '0 10px 10px 30px',
    textAlign: 'left'
  },
  btnClose: {
    marginRight: '10px'
  },
  btnSave: {

  },
  footer: {
    textAlign: 'center',
    paddingBottom: '15px'
  }
}

class Viewport extends React.Component {
  
    // state = { numPages: 0, pageNumber: 1, scale: 1, isFullscreen: true, documentId: '', documentFile: '' };    

    constructor() {
      super();

      this.state = { numPages: 0, pageNumber: 1, scale: 1, isFullscreen: true, documentId: null, 
                      documentFile: null, viewNoteWindow: false, viewInstructionWindow: false };

      this.saveNote = this.saveNote.bind(this);

      this.modalRef = React.createRef();
      this.modalInstructionRef = React.createRef();
    }

    onDocumentLoadSuccess = ({ numPages }) => {
      this.setState({ numPages });
      // Modal.setAppElement('.viewport')
    // this._pageDocuments = this.props.pageDocuments;
    };

    goToPrevPage = () =>
        this.state.pageNumber > 1 && this.setState(state => ({ pageNumber: state.pageNumber - 1 }));

    goToNextPage = () =>
        this.state.pageNumber < this.state.numPages && this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

    setPageNumber = (itemPageNumber) => 
        this.setState(state => ({ pageNumber: itemPageNumber }));

    onItemClick = ({ pageNumber: itemPageNumber }) => {
        this.setPageNumber(itemPageNumber);
        // console.log(itemPageNumber)
      };

    zoomIn = () => { 
      if(this.state.scale < 1.5) {
        this.setState(state => ({ scale: state.scale + 0.25 }))
      }
    }

    zoomOut = () => {
      if(this.state.scale > 0.5) {
        this.setState(state => ({ scale: state.scale - 0.25 }))      
      }
    }

    setScale = (event) => {
      let _scale = parseFloat(event.currentTarget.value);      
      this.setState({ scale: _scale })
    }

    openDocumentDropdown = () => {
      $(".dropdown-menu-select-document-vp1").addClass('showThisElement').css({
        top: vp1Offset.top+'px',
        left: '50px'
      }).mouseleave(function() {
        
        // //checkNReloadUser();

        $(this).removeClass('showThisElement');
      });
    }

    fullScreenToggle = () => {
      // setfullScreenMode(!tfullScreenMode);
      // useFullScreenHandle().enter
      // this.props.fullscreenHandle.enter;
      // console.log(" 1 => ", this.state.isFullscreen)
      this.setState({ isFullscreen: !this.state.isFullscreen})
      // console.log(" 2 => ", this.state.isFullscreen)
    }

    viewDocument = async (doc) => {
      // console.log(doc)
      // console.log(Meteor.isProduction)
      // console.log(Meteor.isDevelopment)

      let 
        _path = Meteor.isProduction ? 'https://craav2-media.s3.amazonaws.com/document/base/' : 'temp/document/base/',
        // _path = 'https://craav2-media.s3.amazonaws.com/document/base/',
        _file = doc.copies.document_base.key,
        _docFile = _path + _file;
      
      // console.log(doc, doc._id)
      
      await this.setState({ documentId: doc._id, documentFile: _docFile});      

      // this.setState((state) => {
      //   return {
      //     documentId: doc._id, 
      //     documentFile: _docFile
      //   }
      // })

      // this.setState({ documentId: doc._id, documentFile: _docFile}, () => {
      //   console.log(this.state)
      // });

      // console.log(this.state)
    }

    openNoteWindow = () => {
      // $(".note-window.modal").modal("show");
      // $(".note-window").show();
      // console.log(this.state)
      // console.log(this.props.submitted)
      // console.log(!this.props.submitted)

      if(this.state.documentFile !== null) {
        
        this.setState({viewNoteWindow: true});        

        // $(".note-modal-header").on("mousedown", function(mousedownEvt) {
        //     // var $draggable = $(this);
        //     var $draggable = $(".ReactModal__Overlay");
        //     var x = mousedownEvt.pageX - $draggable.offset().left,
        //         y = mousedownEvt.pageY - $draggable.offset().top;
        //     $("body").on("mousemove.draggable", function(mousemoveEvt) {
        //         $draggable.closest(".note-modal-container").offset({
        //             "left": mousemoveEvt.pageX - x,
        //             "top": mousemoveEvt.pageY - y
        //         });
        //     });
        //     $("body").one("mouseup", function() {
        //         $("body").off("mousemove.draggable");
        //     });
        //     // $draggable.closest(".modal").one("bs.modal.hide", function() {
        //     //     $("body").off("mousemove.draggable");            
        //     // });
        // });

      } else {
        if(!this.props.submitted) {
          toastr.error("Please open a document to review first.")
        } else {
          this.setState({viewNoteWindow: true});
        }
      }
    }

    afterOpenNoteWindow = () => {

    }

    closeNoteWindow = () => {
      this.setState({viewNoteWindow: false})
      $("body").off("mousemove.draggable");
    }

    closeInstructionWindow = () => {
      this.setState({viewInstructionWindow: false})      
    }

    saveNote = () => {      
      // console.log(docId)
      // this.setState({viewNoteWindow: true})

      if(this.props.submitted) {
        toastr.error("Monitoring note cannot be edited once it's submitted.")
      } else {
            
        // console.log(this.state)
      
        let _note = $("#txta_note").val();

        if(_note && _note != '') {
          // console.log(_note)
          let 
            _pageData = this.props.pageData,
            _userData = this.props.userData;

          // console.log(_pageData)
          // console.log(_userData)

          let _obj = {
            userId: _userData._id,
            pageId: _pageData._id,
            moduleId : _pageData.moduleId,
            note: _note,
            pageNumber: this.state.pageNumber,
            documentId: this.state.documentId,
            port: this.props.port
          }

          // console.log(_obj);   

          // getPageMonitoringNote.call(_obj, (err, res) => {
          //   console.log(err, res)
          // })

          saveNote.call(_obj, (err, res) => {
            if(err) {
              console.log(err)
              toastr.error("Something went wrong. Please try again.")
            } else {
              toastr.info("Successfully saved.")

              insertLog.call({uid: Meteor.userId(), venue: 'viewport', note: _obj})
              insertUserLog.call({uid: Meteor.userId(), venue: 'viewport', note: _obj})  
                          
              // Session.set("Viewport.documentId", null)
            }
          })

        } else {
          alert("Error: Invalid data.")
        }
      }
    }

    renderNoData = () => {
      return (<div className='no-data'>Please select a document to view.</div>)
    }

    getParentNode () {
      return document.querySelector(".viewport");
    }

    render() {

      const { pageNumber, numPages, scale, isFullscreen, documentId, documentFile, viewNoteWindow, viewInstructionWindow } = this.state;

      // console.log(documentId)
      // const handle = useFullScreenHandle();
      const fullscreenHandle = this.props.fullscreenHandle;

      let _width = screen.width /2;
      // console.log(_folders)

      let _folderElems = [];
  // console.log(this.props)
      let 
        _pageData = this.props.pageData,
        _pageDocuments = this.props.pageDocuments,
        _userData = this.props.userData,
        _pageNotes = this.props.pageNotes;

      let _addNoteBtnLabel = this.props.submitted ? "View Note" : "Add Note";

      for( const [index, value] of _pageDocuments.entries()) {
        let _docElems = [];
        if(value.docs) {
          for( const [j, d] of value.docs.entries()) {
            // _docElems.push(<li key={'d'+j}><a className="btn btn-xs btn-load-document">{d.name}</a></li>)
            _docElems.push(<li key={'d'+j}><a className="btn btn-xs btn-load-document">{d.title}</a></li>)
          }

          _folderElems.push(<li className="dropdown-submenu has-subdocs" key={'f'+index}>{value.title}<ul className="dropdown-menu">{_docElems}</ul></li>)
        } else {
          _folderElems.push(<li className="dropdown-submenu no-subdocs" key={'f'+index} onClick={() => this.viewDocument(value)}>{value.title}</li>)
        }
        // _folderElems.push(<li className="dropdown dropdown-submenu" key={'f'+index}>{value.name}<ul className="dropdown-item">{_docElems}</ul></li>)
        
      }

    return (
        <div className="viewport">
          <FullScreen handle={fullscreenHandle} onChange={this.fullScreenToggle}>          
            
          <nav className="viewport-toolbar">
              <div className="toolbar-left inline-block">
                <div className="dropdown inline-block">                    
                  <button className="toolbarButton btn-view-document-list btn-view-document-list-vp1 dropdown-toggle" 
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="fa fa-clone"></i> Select Document</button> 
                  <ul className="dropdown-menu dropdown-menu-select-document-vp1" role="menu" aria-labelledby="dropdownMenu">
                  { _folderElems }
                  </ul>                                             
                </div> 

                <div className="btn-add-note-container inline-block">                  
                  { this.state.documentFile || this.props.submitted ?
                  <button className="add-note" onClick={this.openNoteWindow} data-toggle="modal" data-target="#note_window"><i className="fa fa-pencil"></i> {_addNoteBtnLabel}</button>
                  : <button className="add-note" onClick={this.openNoteWindow}><i className="fa fa-pencil"></i> {_addNoteBtnLabel}</button>}
                </div>
              </div>
                        
              <div className="toolbar-center inline-block">
                <span className="page-number">{pageNumber} / {numPages}</span>
                <button onClick={this.goToPrevPage}>Prev</button>
                <button onClick={this.goToNextPage}>Next</button>
                <span className="inline-block separator"> | </span>
                <button onClick={this.zoomIn}><i className="fa fa-search-plus"></i></button>
                <button onClick={this.zoomOut}><i className="fa fa-search-minus"></i></button>
                <select className="sel-scale" onChange={this.setScale} value={this.state.scale}>
                  <option value="0.5" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 50 }'>50%</option>
                  <option value="0.75" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 75 }'>75%</option>
                  <option value="1" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 100 }'>100%</option>
                  <option value="1.25" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 125 }'>125%</option>
                  <option value="1.5" data-l10n-id="page_scale_percent" data-l10n-args='{ "scale": 150 }'>150%</option>
                </select>                
              </div>

              <div className="toolbar-right inline-block">
                  {  this.state.isFullscreen ? 
                  <button className="btn-fullscreen" onClick={fullscreenHandle.exit}><i className="fa fa-compress"></i></button>
                  : <button className="btn-fullscreen" onClick={fullscreenHandle.enter}><i className="fa fa-arrows-alt"></i></button> }
              </div>
          </nav>

          <div className="viewport-document-container" style={{height: '92vh', width: '100%', overflow: 'auto'}}>

            { documentFile ? 
              <Document
              // file={samplePDF}
              // file="http://localhost:3500/docs/NA_Subject LAT_EDC_Portrait - Exercise 2 Med History EDC.pdf"
              // file="http://localhost:3000/docs/Exercise 1 - Med History - Con Meds - Version 2 - To Chris for Viewer.pdf"
              file={documentFile}
              // loading="Loading document..."
              className="viewport-document"
              // file="http://localhost:3000/sample3.pdf"
              onLoadSuccess={this.onDocumentLoadSuccess}
              >
                  {/* <Outline onItemClick={this.onItemClick} className="outline-test" /> */}
                  <div className="Test__container__content__toc">
                  {/* {render && ( */}
                    <Outline
                      className="custom-classname-outline"
                      onItemClick={this.onItemClick}                      
                    />
                  {/* )} */}
                </div>                
              <Page pageNumber={pageNumber} width={_width} scale={scale}/>
              </Document>  : <Document noData={this.renderNoData()} />
            }          
          </div>
          <div className="modalContainer" ref={this.modalRef}></div>
          <div className="modalInstructionContainer" ref={this.modalInstructionRef}></div>
          <Modal
          isOpen={viewNoteWindow}
          onAfterOpen={this.afterOpenNoteWindow}
          onRequestClose={this.closeNoteWindow}
          style={viewportReactModalInitStyles}
          // style={styleOverrides}
          // contentLabel="Example Modal"
          ariaHideApp={false}  
          parentSelector={() => this.modalRef.current }
        >

        <Draggable handle=".note-modal-top" bounds="body">
        {/* <h2 ref={_subtitle => (subtitle = _subtitle)}>Hello</h2> */}
        <div className="note-modal-container" style={viewportReactModalInitStyles.container}>
          <div className="note-modal-top" style={viewportReactModalInitStyles.top} >
          <button type="button" className="close" onClick={this.closeNoteWindow} aria-label="Close"><span aria-hidden="true">&times;</span></button>                  
          </div>
          <div className="note-modal-body" style={viewportReactModalInitStyles.body}>
            <textarea name="txta_note" id="txta_note" cols="77" rows="11" defaultValue={_pageNotes ? _pageNotes.note : ''}></textarea>
          </div>
          { !this.props.submitted ? 
          <div className="note-modal-instruction" style={viewportReactModalInitStyles.instruction}>
            You may enter multiple monitoring notes in this popup. Click "Save" to save your text and close the popup. 
          </div>  : ''
          }        
          <div className="note-modal-footer" style={viewportReactModalInitStyles.footer}>
            <button type="button" className="btn btn-default btn-close-note-window" style={viewportReactModalInitStyles.btnClose} onClick={this.closeNoteWindow}>Close</button>
            <button type="button" className="btn btn-primary btn-save-note" style={viewportReactModalInitStyles.btnSave} onClick={this.saveNote}>Save</button>
            {/* <button type="button" onClick={this.saveNote}>Test</button> */}
          </div>
        </div>
        </Draggable>
        </Modal>

        {/* <Modal
          isOpen={viewInstructionWindow}          
          onRequestClose={this.closeInstructionWindow}
          style={viewportReactModalInitStyles}
          // style={styleOverrides}
          // contentLabel="Example Modal"
          ariaHideApp={false}  
          parentSelector={() => this.modalInstructionRef.current }
        >         
        <div className="instruction-modal-container" style={viewportReactModalInstructionStyles.container}>
          <div className="instruction-modal-top" style={viewportReactModalInstructionStyles.top} >
          <button type="button" className="close" onClick={this.closeInstructionWindow} aria-label="Close"><span aria-hidden="true">&times;</span></button>                  
          </div>
          <div className="instruction-modal-body" style={viewportReactModalInitStyles.body}>
          You may enter multiple monitoring notes in this popup. Click "Save" to save your text and close the popup. 
          </div>            
          <div className="instruction-modal-footer" style={viewportReactModalInstructionStyles.footer}>
            <button type="button" className="btn btn-default btn-close-instruction-window" style={viewportReactModalInstructionStyles.btnClose} onClick={this.closeInstructionWindow}>Close</button>          
          </div>
        </div>
        </Modal> */}
        </FullScreen>
        </div>
    );
    }
}

export default (props) => {
  // const [fullscreenMode] = useState(false);
  const handle = useFullScreenHandle();  
  // console.log(props)

  const _pageData = props.pageData || null;
  const _pageDocuments = props.pageDocuments || [];
  const _pageNotes = props.pageNotes || null;
  const _userData = props.userData || null;
  const _submitted = props.submitted || null;
  const _port = parseInt(props.port) || null;

  return (
      <Viewport fullscreenHandle={handle} pageData={_pageData} pageDocuments={_pageDocuments} 
        pageNotes={_pageNotes} userData={_userData} submitted={_submitted} port={_port} />
  )
}