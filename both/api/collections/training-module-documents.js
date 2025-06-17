/**
 * TrainingModule Documents collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import Tabular from 'meteor/aldeed:tabular'

import { s3Config } from '/both/startup/config/s3-config.js'

import { Util } from '/imports/api/lib/util.js'

import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'

let baseDir = '';
if (Meteor.isServer) {
  baseDir = process.env.PWD;
}

let s3DocumentStoreBase

if(process.env.NODE_ENV === "production" && ___isOnAWS) {
  s3DocumentStoreBase = new FS.Store.S3('document_base', {
    region: s3Config && s3Config.region, //optional in most cases
    accessKeyId: s3Config && s3Config.accessKeyId, //"account or IAM key", //required if environment variables are not set
    secretAccessKey: s3Config && s3Config.secretAccessKey, //"account or IAM secret", //required if environment variables are not set
    bucket: s3Config && s3Config.bucket_media, // "mybucket", //required
    // ACL: 'public-read-write', // "myValue", //optional, default is 'private', but you can allow public or secure access routed through your app URL
    folder: 'document/base', // "folder/in/bucket", //optional, which folder (key prefix) in the bucket to use
    // fileKey: function(fileObj) { return new Date().getTime() + "-" + fileObj.name(); },
    fileKeyMaker(fileObj) {
      // console.log(fileObj)
      // Lookup the copy
      // let store = fileObj && fileObj._getInfo(name) //-- name is not defined?
      // let store = fileObj
      // If the store and key is found return the key
      // if (store && store.key) {return store.key} //-- cannot be sure if this really works

      let filename = fileObj.name()
      // let filenameInStore = fileObj.name({store: name})

      // If no store key found we resolve / generate a key
      // return fileObj.collectionName + '/' + fileObj._id + '-' + (filenameInStore || filename)    
      return fileObj._id + '-base-' + filename 
    },

  });

}


let stores = []

if(process.env.NODE_ENV === "production") { 
  stores = [s3DocumentStoreBase]
} else {
  stores = [
      new FS.Store.FileSystem('document_base', {
        // path: baseDir + '/public/temp/audio~' 
        // path: 'temp/document/base', //-- this will be .meteor/local/build/programs/server/temp/document/base, otherwise, .meteor/local/cfs/files/document_base
        path: baseDir + '/public/temp/document/base',
        fileKeyMaker(fileObj) {
          let filename = fileObj.name()
          // console.log(fileObj)
          return fileObj._id + '-base-' + filename 
        }
      })  
  ]
}

if(___isOnAWS) {

  export const TrainingModuleDocumentsCFS = new FS.Collection('training_module_documents_cfs', {
    stores: stores,
    filter: {
      maxSize: 10485760, // 10M in bytes
      allow: {
        contentTypes: ['application/pdf'] //allow only pdf files in this FS.Collection
      }
    }
  });

  TabularTables = {};

  TabularTables.TrainingModuleDocumentsCFSTable = new Tabular.Table({
    name: "TrainingModuleDocumentsCFSTable",    
    collection: TrainingModuleDocumentsCFS.files,
    order: [[9, 'desc'], [6, 'desc']],
    pageLength: 10,
    //  lengthMenu: [[10, 20, 30, 50, 100, 150],[10, 20, 30, 50, 100, 150]],
     lengthMenu: [10, 20, 30, 50, 100, 150],
     processing: false,
     // skipCount: true,
   // pagingType: 'simple', 
   // infoCallback: (settings, start, end) => `Showing ${start} to ${end}`,
    language: {
        // lengthMenu: "Display _MENU_ records per page",
        lengthMenu: "Showing _MENU_ documents per page",
        zeroRecords: "No document Data",
        // info: "Showing page _PAGE_ of _PAGES_",
        info: "Showing _START_ to _END_ of _TOTAL_ document",
        infoEmpty: "No document records available",
        infoFiltered: "(filtered from _MAX_ total documents)",
        processing: ""
    },
    columns: [
     {data: "title", title: "Label (File)", width: 350, render(v,t,d) {
       let title = v || ''
       let nameFile = '<input type="text" class="input-table-doc-title" id="input_table_doc_title_'+d._id+'" value="'+title+'">'
           nameFile += '<br />'
           nameFile += '<span class="doc-table-file-name">(' + d.original.name + ')</span>'
       return nameFile 
     }},
     {data: "description", title: "Description", width: 200, render(v, t, d) {
       let desc = v || ''
       return '<textarea class="txta-table-doc-desc" id="txta_table_doc_desc_'+d._id+'">' + desc + '</textarea>'
     }},
     {data: "original.type", width: 85, title: "Type"},
     {data: "original.size", title: "Size", width: 70, render(v,t,d) {
       return '<span class="doc-size">' + Util.formatBytes(v) + '</span>'
     }},
     {data: "status", title: "Status", width: 50, render(v, t, d) {
      let status = v === 1 ? 'Active.' : 'Inactive'
      return status
    }},     
    //  {data: "uploadedAt", title: "Created / Modified", width: 200, render(v,t,d) {
    //    let date
    //    if(d.modifiedAt) {
    //      date = '<span class="doc-date">' + Util.dateFormatN(v) + '<br />' + Util.dateFormatN(d.modifiedAt) + '</span>'
    //    } else {
    //      date = '<span class="doc-date">' + Util.dateFormatN(v) + '</span>'
    //    }
    //    return date 
    //  }},
     // {data: "modifiedAt", title: "Modified", width: 150, render(v,t,d) {
     // return Util.dateFormatN(v)
     // }}, 
     // {data: "audioSrc", title: "Source", width: 200, render(v, t, d) {
     //    let src = v || ''
     //    return "<textarea class='txta-audio-src'>" + src + "</textarea>";
     // }},     
     // {data: "_id", width: 100, title: "Action", tmpl: Meteor.isClient && Template.AdminAudioActions},
     {width: 100,
       createdCell: Meteor.isClient && function (cell, cellData, rowData) {
         // console.log(cell, cellData, rowData)
         return Blaze.renderWithData(Template.AdminDocumentsActions, {
           data: rowData
         }, cell);
       },  
     },
   
     // {data: "test()", width: 100, title: "Action"},
     // {data: "", width: 100, title: "Action", render(v,t,d) {
     //   let btn = '<form class="form-inline audio-action-buttons" data-iid="'+d._id+'">'
     //       btn += '<div class="form-group">'
     //       btn += '<button class="btn btn-xs btn-default btn-save-audio-data"><i class="fa fa-save"></i> </button>'
     //       btn += '</div>'
     //       btn += '<div class="form-group">'
     //       btn += '<button class="btn btn-xs btn-danger btn-delete-audio"><i class="fa fa-trash"></i></button>'
     //       btn += '</div>'
     //       btn += '</form>'
   
     //   return btn
     // }},
     {data: "_id", visible: false},
     {data: "modifiedAt", visible: false},
     {data: "original.name", visible: false},
     {data: "url", visible: false},
     {data: "status", visible: false},
    ]   
   })

   TabularTables.TrainingModuleDocumentsCFSMini = new Tabular.Table({
    name: "TrainingModuleDocumentsCFSMini",
    collection: TrainingModuleDocumentsCFS.files,
    order: [[6, 'desc'], [5, 'desc']],
    pageLength: 10,
     lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
     processing: false,
     // skipCount: true,
   // pagingType: 'simple', 
   // infoCallback: (settings, start, end) => `Showing ${start} to ${end}`,
    language: {        
        lengthMenu: "Showing _MENU_ documents per page",
        zeroRecords: "No document Data",
        // info: "Showing page _PAGE_ of _PAGES_",
        info: "Showing _START_ to _END_ of _TOTAL_ document",
        infoEmpty: "No document records available",
        infoFiltered: "(filtered from _MAX_ total document)",
        processing: ""
    },
    columns: [
     {data: "title", title: "Name / Source", class: 'module-page-edit-all-documents-title', render(v,t,d) {
       let title = v || ''
       let nameFile = '<input type="text" class="input-table-document-title" id="input_table_document_title_'+d._id+'" value="'+title+'">'
           nameFile += '<br />'
           nameFile += '<span class="document-table-file-name">' + d.original.name + '</span>'
       return nameFile 
     }},      
     {data: "description", title: "Description", class: 'module-page-edit-all-documents-desc', render(v, t, d) {
       let desc = v || ''
       return '<textarea class="txta-table-document-desc" id="txta_table_document_desc_'+d._id+'">' + desc + '</textarea>'
     }},
     {class: 'module-page-edit-all-documents-actions',
       createdCell: Meteor.isClient && function (cell, cellData, rowData) {
         // console.log(cell, cellData, rowData)
         return Blaze.renderWithData(Template.AdminModulePageEditAllDocumentsActions, {
           data: rowData
         }, cell);
       },
     },
     {data: "_id", visible: false},
     {data: "uploadedAt", visible: false},
     {data: "modifiedAt", visible: false},
     {data: "original.name", visible: false},
     {data: "url", visible: false},
     {data: "status", visible: false},
    ]   
   })
}

