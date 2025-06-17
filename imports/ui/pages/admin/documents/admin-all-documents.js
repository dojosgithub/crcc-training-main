/**
 * Admin All Documents template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { TrainingModuleDocumentsCFS } from '/both/api/collections/training-module-documents.js'

// import '/imports/ui/stylesheets/admin/documents/admin-all-documents.less'
import '/imports/ui/pages/admin/documents/admin-all-documents.html'

import '/imports/ui/pages/admin/documents/admin-documents-template.js'

let _selfAdminAllDocuments

Template.AdminAllDocuments.onCreated( function adminAllDocumentsOnCreated() {
  _selfAdminAllDocuments = this;

  _selfAdminAllDocuments.table = new ReactiveVar(true)
})

Template.AdminAllDocuments.helpers({
    docTableSelector() {    
        return {
          status: {$ne: 4}
        }
    },
    viewTable() {
      return _selfAdminAllDocuments.table.get()
    },    
})