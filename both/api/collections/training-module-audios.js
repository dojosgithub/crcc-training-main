/**
 * CFS based TrainingModuleAudios collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import Tabular from 'meteor/aldeed:tabular'

import { s3Config } from '/both/startup/config/s3-config.js'

import { Util } from '/imports/api/lib/util.js'

let baseDir = '';
if (Meteor.isServer) {
  baseDir = process.env.PWD;
}

let s3AudioStoreBase

if(process.env.NODE_ENV === "production" && ___isOnAWS) {
  s3AudioStoreBase = new FS.Store.S3('audio_base', {
    region: s3Config && s3Config.region, //optional in most cases
    accessKeyId: s3Config && s3Config.accessKeyId, //"account or IAM key", //required if environment variables are not set
    secretAccessKey: s3Config && s3Config.secretAccessKey, //"account or IAM secret", //required if environment variables are not set
    bucket: s3Config && s3Config.bucket_media, // "mybucket", //required
    // ACL: 'public-read-write', // "myValue", //optional, default is 'private', but you can allow public or secure access routed through your app URL
    folder: 'audio/base', // "folder/in/bucket", //optional, which folder (key prefix) in the bucket to use
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
  stores = [s3AudioStoreBase]
} else {
  stores = [
      new FS.Store.FileSystem('audio_base', {
        // path: baseDir + '/public/temp/audio~' 
        path: 'temp/audio/base' //-- this will be .meteor/local/build/programs/server/temp/audio/base
      })  
  ]
}

if(___isOnAWS) {

  export const TrainingModuleAudiosCFS = new FS.Collection('training_module_audios_cfs', {
    stores: stores,
    filter: {
      maxSize: 10485760, // 10M in bytes
      allow: {
        contentTypes: ['audio/*'] //allow only audio files in this FS.Collection
      }
    }
  });

//-- Audio collection table
TabularTables = {};

TabularTables.TrainingModuleAudiosCFS = new Tabular.Table({
 name: "TrainingModuleAudiosCFS",
 collection: TrainingModuleAudiosCFS.files,
 order: [[9, 'desc'], [6, 'desc']],
 pageLength: 10,
  lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
  processing: false,
  // skipCount: true,
// pagingType: 'simple', 
// infoCallback: (settings, start, end) => `Showing ${start} to ${end}`,
 language: {
     // lengthMenu: "Display _MENU_ records per page",
     lengthMenu: "Showing _MENU_ audios per page",
     zeroRecords: "No audio Data",
     // info: "Showing page _PAGE_ of _PAGES_",
     info: "Showing _START_ to _END_ of _TOTAL_ audio",
     infoEmpty: "No audio records available",
     infoFiltered: "(filtered from _MAX_ total audio)",
     processing: ""
 },
 columns: [
  // {data: "thumbnail()", width: 100, title: "Audio" 
  // {data: "_id", width: 70, title: "Audio", render(v,t,d) {
  //   if(process.env.NODE_ENV === "production") {  
  //     return '<img src="" />'
  //   } else {
  //     return '<img src="/cfs/files/training_module_audios_cfs/'+v+'/'+d.original.name+'?store=thumbs" width="50" class="thumbnail" />'
  //   }
  // }},
  {width: 60, title: "Audio",
    createdCell: Meteor.isClient && function (cell, cellData, rowData) {
      // console.log(cell, cellData, rowData)
      return Blaze.renderWithData(Template.AdminAudioThumbnail, {
        data: rowData
      }, cell);
    },  
  },
  // {data: "url", width: 100, title: "Audio", tmpl: Meteor.isClient && Template.AdminAudioThumbnail, 
  //     tmplContext: function (rowData) {
  //       // console.log(rowData);
  //         return {
  //             row: rowData,
  //             // column: 'title'
  //         };
  // }
  {data: "title", title: "Name / File", width: 350, render(v,t,d) {
    let title = v || ''
    let nameFile = '<input type="text" class="input-table-audio-title" id="input_table_audio_title_'+d._id+'" value="'+title+'">'
        nameFile += '<br />'
        nameFile += '<span class="audio-table-file-name">' + d.original.name + '</span>'
    return nameFile 
  }},
  {data: "duration", title: "Duration", width: 100, render(v, t, d) {
    let duration = v || ''
    return `<input type="text" class="input-table-audio-duration" id="input_table_audio_duration_${d._id}" value="${duration}">`
  }},
  // {data: "original.name", title: "File", width: 200},
  {data: "description", title: "Description", width: 200, render(v, t, d) {
    let desc = v || ''
    return '<textarea class="txta-table-audio-desc" id="txta_table_audio_desc_'+d._id+'">' + desc + '</textarea>'
  }},
  {data: "original.type", width: 85, title: "Type"},
  {data: "original.size", title: "Size", width: 70, render(v,t,d) {
    return '<span class="audio-size">' + Util.formatBytes(v) + '</span>'
  }},
  {data: "uploadedAt", title: "Created / Modified", width: 200, render(v,t,d) {
    let date
    if(d.modifiedAt) {
      date = '<span class="audio-date">' + Util.dateFormatN(v) + '<br />' + Util.dateFormatN(d.modifiedAt) + '</span>'
    } else {
      date = '<span class="audio-date">' + Util.dateFormatN(v) + '</span>'
    }
    return date 
  }},
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
      return Blaze.renderWithData(Template.AdminAudioActions, {
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

TabularTables.TrainingModuleAudiosCFSMini = new Tabular.Table({
 name: "TrainingModuleAudiosCFSMini",
 collection: TrainingModuleAudiosCFS.files,
 order: [[6, 'desc'], [5, 'desc']],
 pageLength: 10,
  lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
  processing: false,
  // skipCount: true,
// pagingType: 'simple', 
// infoCallback: (settings, start, end) => `Showing ${start} to ${end}`,
 language: {
     // lengthMenu: "Display _MENU_ records per page",
     lengthMenu: "Showing _MENU_ audios per page",
     zeroRecords: "No audio Data",
     // info: "Showing page _PAGE_ of _PAGES_",
     info: "Showing _START_ to _END_ of _TOTAL_ audio",
     infoEmpty: "No audio records available",
     infoFiltered: "(filtered from _MAX_ total audio)",
     processing: ""
 },
 columns: [
  {class: 'audio-thumbnail', title: "Audio",
    createdCell: Meteor.isClient && function (cell, cellData, rowData) {
      // console.log(cell, cellData, rowData)
      return Blaze.renderWithData(Template.AdminAudioThumbnail, {
        data: rowData
      }, cell);
    },  
  },
  {data: "title", title: "Name / Source", class: 'module-page-edit-all-audios-title', render(v,t,d) {
    let title = v || ''
    let nameFile = '<input type="text" class="input-table-audio-title" id="input_table_audio_title_'+d._id+'" value="'+title+'">'
        nameFile += '<br />'
        nameFile += '<span class="audio-table-file-name">' + d.original.name + '</span>'
    return nameFile 
  }},
  {class: 'module-page-edit-all-audios-duration', data: "duration", title: "Duration", width: 100, render(v, t, d) {
    let duration = v || ''
    return `<input type="text" class="input-table-audio-duration" id="input_table_audio_duration_${d._id}" value="${duration}">`
  }},  
  // {data: "original.name", title: "File", width: 200},
  {data: "description", title: "Description", class: 'module-page-edit-all-audios-desc', render(v, t, d) {
    let desc = v || ''
    return '<textarea class="txta-table-audio-desc" id="txta_table_audio_desc_'+d._id+'">' + desc + '</textarea>'
  }},
  // {data: "original.type", class: 'audio-type', title: "Type"},
  // {data: "original.size", title: "Size", class: 'module-page-edit-all-audios-size', render(v,t,d) {
  //   return '<span class="audio-size">' + Util.formatBytes(v) + '</span>'
  // }},
  // {data: "uploadedAt", title: "Created / Modified", class: 'col-md-2', render(v,t,d) {
  //   let date
  //   if(d.modifiedAt) {
  //     date = '<span class="audio-date">' + Util.dateFormatN(v) + '<br />' + Util.dateFormatN(d.modifiedAt) + '</span>'
  //   } else {
  //     date = '<span class="audio-date">' + Util.dateFormatN(v) + '</span>'
  //   }
  //   return date 
  // }},
  {class: 'module-page-edit-all-audios-actions',
    createdCell: Meteor.isClient && function (cell, cellData, rowData) {
      // console.log(cell, cellData, rowData)
      return Blaze.renderWithData(Template.AdminModulePageEditAllAudiosActions, {
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


