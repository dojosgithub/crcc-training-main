/**
 *  Admin_doc template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TrainingModuleDocumentsCFS } from '/both/api/collections/training-module-documents.js'
import { updateDocument, updateDocumentStatus, deleteDocument } from '/both/api/methods/training-module-documents.js'

// import '/imports/ui/stylesheets/admin_docs/admin_doc-template.less'
import '/imports/ui/pages/admin/documents/admin-documents-template.html'

Template.AdminDocumentsActions.events({
  'click .btn-delete-table-doc'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to remove this document?")) {
      let did = $(e.currentTarget).parent().parent().data('did')  
      let status = parseInt($(e.currentTarget).data('status'))  

      let objDoc = {
        _id: did,
        status: status
      }

      updateDocumentStatus.call(objDoc, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })   
    }
  },
  'click .btn-save-table-doc'(e, tpl) {
    e.preventDefault()

    let did = $(e.currentTarget).parent().parent().data('did')
    let title = $('#input_table_doc_title_'+did).val()
    let desc = $('#txta_table_doc_desc_'+did).val()
    let src = $('#txta_table_doc_src_'+did).val()    

    if(did !== '') {

      let objDoc = {
        _id: did,
        title: title,
        description: desc,
      _doc: {
          src: src
        },        
      }

      updateDocument.call(objDoc, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })
    }
  },
  'click .btn-update-table-doc-status'(e, tpl) {
    e.preventDefault()

    // console.log(this)
    let status = parseInt($(e.currentTarget).data('status'))
    let command = status === 1 ? 'activate' : 'deactivate' 

    if(confirm("Are you sure to " + command + " this document?")) {
      let did = $(e.currentTarget).parent().parent().data('did')    

      let objDoc = {
        _id: did,
        status: status
      }

      updateDocumentStatus.call(objDoc, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully " + command + "d.")
        }
      })
    }
  },    
})

Template.AdminModulePageEditAllDocumentsActions.events({
  'click .btn-save-table-document'(e, tpl) {
    e.preventDefault()

    let did = $(e.currentTarget).parent().parent().data('did')
    let title = $('#input_table_document_title_'+did).val()
    let desc = $('#txta_table_document_desc_'+did).val()    

    if(did !== '') {

      let objDoc = {
        _id: did,
        title: title,
        description: desc
      }

      updateDocument.call(objDoc, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully updated.")
        }
      })
    }
  },
  'click .btn-select-this-document'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to select this document?")) {
      let did = $(e.currentTarget).parent().parent().data('did')

      let _doc = TrainingModuleDocumentsCFS.findOne(did)

      if(_doc && _doc._id) {

        let obj = {
          _id: Session.get("pageToBuild"),
          document: {
            _id: _doc._id,
            name: _doc.original.name            
          }
        }
        
        updateModulePageDocument.call(obj, (err, res) => {
          if(err) {
            toastr.info("Something went wrong. " + err)
          } else {
            toastr.info("Successfully updated.")
          }
        })

      }
    }
  },   
})
