/**
 * Admin New Document template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TrainingModuleDocumentsCFS } from '/both/api/collections/training-module-documents.js'

// import DKEditor from '/imports/api/lib/dk-editor/dk-editor.js'

// import '/imports/ui/stylesheets/admin/documents/admin-new-document.less'
import '/imports/ui/pages/admin/documents/admin-new-document.html'

let _selfAdminNewDocument;
let _subsAdminNewDocument;

Template.AdminNewDocument.onCreated(() => {
  _selfAdminNewDocument = this;

  _selfAdminNewDocument.uploadedDocIdsOrigin = []

  _selfAdminNewDocument.uploadedDocIds = new ReactiveVar([])
  
  _selfAdminNewDocument.uploadedDocsReady = new ReactiveVar()  
  _selfAdminNewDocument.uploadedDoc = new ReactiveDict()
  _selfAdminNewDocument.docToEdit = new ReactiveVar()

  _subsAdminNewDocument = new SubsManager()  

  Tracker.autorun(() => {

    if(_selfAdminNewDocument.uploadedDocIds.get().length > 0) {
      let handleUploadedTrainingModuleDocumentsCFS = _subsAdminNewDocument.subscribe('training_module_documents_cfs_w_ids', _selfAdminNewDocument.uploadedDocIds.get())
  
      _selfAdminNewDocument.uploadedDocsReady.set(handleUploadedTrainingModuleDocumentsCFS.ready())
    }

  })

})

Template.AdminNewDocument.onRendered( function adminNewDocumentOnRendered() {
  // const dkEditor = new DKEditor('new_document_container')

  // dkEditor.print()
})

Template.AdminNewDocument.helpers({
  uploadedDocuments() {
    if(_selfAdminNewDocument.uploadedDocIds.get().length > 0) {
    // if(_selfAdminNewAudio.uploadedAudiosReady.get()) {
      let tmd = TrainingModuleDocumentsCFS.find()
      // console.log(_selfAdminNewAudio.uploadedAudioIds.get(), tma.fetch())
      // if(tma.fetch().length > 0) {
      // return TrainingModuleAudiosCFS.find()
      // console.log(tma.fetch())
      return tmd
    // }
    }
  },
  documentToEdit() {
    return _selfAdminNewDocument.docToEdit.get()
  } 
})

Template.AdminNewDocument.events({
  'change .admin-new-doc-multiple'(e, tpl) {
    e.preventDefault()

    if (e.currentTarget.files && e.currentTarget.files[0]) {
      FS.Utility.eachFile(e, function(file) {
        // console.log(file)

        let newFile = new FS.File(file);
        // newFile.uploadedFrom = Meteor.userId();
        newFile.status = 1
        newFile.metadata = {
          owner: Meteor.userId()
        }

        let maxChunk = 2097152; //-- 2M
        // var maxChunk = 10240; //-- 10K? (this will consume CPU a lot, both server and user browser?)
        FS.config.uploadChunkSize =
          ( newFile.original.size < 10*maxChunk ) ? newFile.original.size/10 : maxChunk;

        TrainingModuleDocumentsCFS.insert(newFile, function (err, fileObj) {
          //If !err, we have inserted new doc with ID fileObj._id, and
          //kicked off the data upload using HTTP
          if(err) {
            // console.log("err => ", err)
            toastr.error("Something went wrong. Please try again.")
          } else {
            // console.log(fileObj)
            if(fileObj && fileObj._id) {
              // toastr.info("Successfully done.")
              // console.log(fileObj.uploadProgress())

              let myInterval = setInterval(function () {
                  // console.log(fileObj.uploadProgress());
                  if( fileObj.uploadProgress() === 100 
                      && fileObj.hasStored('thumbs') 
                      && fileObj.hasStored('base')) {
                    // console.log('done')
                      clearInterval(myInterval);     

                      $('.li-doc-being-uploaded-'+fileObj._id).fadeOut(1000)

                  }
              }, 100)

              _selfAdminNewDocument.uploadedDocIdsOrigin.push(fileObj._id)
              _selfAdminNewDocument.uploadedDocIds.set(_selfAdminNewDocument.uploadedDocIdsOrigin)

              // let f = new FS.File(file);
              // TrainingModuleImages.insert(f)
            } else {
              toastr.error("Something went wrong. Please try again.")
            }
          }
        })
      }) //-- FS.Utility.eachFile
    }
  },  
})