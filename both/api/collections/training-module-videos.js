/**
 * TrainingModuleVideos collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

// import { SimpleSchema } from 'meteor/aldeed:simple-schema'

// const SimpleSchema = require('simpl-schema') //-- not working

// import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema
import Tabular from 'meteor/aldeed:tabular'

export const TrainingModuleVideos = new Mongo.Collection('training_module_videos')

// TrainingModuleVideos.creatorSchema = new SimpleSchema({
//   fullname: {
//     type: String,
//     optional: true
//   },
//   userId: {
//     type: String,
//     optional: true
//   }
// })

// TrainingModuleVideos.videoSchema = new SimpleSchema({
//   src: {
//     type: String,
//     optional: true
//   },
//   videoId: {
//     type: String,
//     optional: true
//   },  
//   duration: {
//     type: Number,
//     optional: true
//   }
// })

// TrainingModuleVideos.schema = new SimpleSchema({
//   _id: {
//     type: String,
//     optional: true
//   },  
//   title: {
//     type: String,
//     optional: true
//   },
//   description: {
//     type: String,
//     optional: true
//   },  
//   order: {
//     type: Number,
//     optional: true,
//     defaultValue: 0
//   },
//   status: {
//     type: Number,
//     optional: true,
//     autoValue: function() {
//       if(this.isInsert) {
//         return 2
//       }
//     }
//   },
//   video: {
//     type: TrainingModuleVideos.videoSchema,
//     optional: true,
//     blackbox: true
//   },
//   creator: {
//     type: TrainingModuleVideos.creatorSchema,
//     optional: true
//   },
//   createdAt: {
//     type: Date,
//     optional: true,
//     defaultValue: new Date  
//   },
//   modifiedAt: {
//     type: Date,
//     optional: true,
//     defaultValue: new Date
//   },  
// })

// TrainingModuleVideos.attachSchema(TrainingModuleVideos.schema)

//-- Videos collection table
TabularTables = {};

TabularTables.TrainingModuleVideos = new Tabular.Table({
  name: "TrainingModuleVideos",
  collection: TrainingModuleVideos,
  order: [[4, 'desc']],
  pageLength: 10,
  lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
  processing: false,
  language: {
     // lengthMenu: "Display _MENU_ records per page",
     lengthMenu: "Showing _MENU_ videos per page",
     zeroRecords: "No video Data",
     // info: "Showing page _PAGE_ of _PAGES_",
     info: "Showing _START_ to _END_ of _TOTAL_ videos",
     infoEmpty: "No video records available",
     infoFiltered: "(filtered from _MAX_ total videos)",
     processing: ""
  },
  columns: [
    {width: 50, title: "Video",
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {    
        
        return Blaze.renderWithData(Template.AdminVideoThumbnail, {
          data: rowData
        }, cell);
      },
    },
    {data: "title", title: "Title", class:'tbl-video-title-container', width: 250, render(v,t,d) {
      let title = v || ''
      let myTitle = '<input type="text" class="input-table-video-title" id="input_table_video_title_'+d._id+'" value="'+title+'">'
      return myTitle 
    }},
    {data: "video", title: "Duration", class:'tbl-video-duration-container', width: 100, render(v,t,d) {
      let duration = v.duration || ''
      let myDuration = '<input type="text" class="input-table-video-duration" id="input_table_video_duration_'+d._id+'" value="'+duration+'">'
      return myDuration
    }},    
    {data: "description", title: "Description", width: 150, render(v, t, d) {
      let desc = v || ''
      return '<textarea class="txta-table-video-desc" id="txta_table_video_desc_'+d._id+'">' + desc + '</textarea>'
    }},
    {data: "video", title: "Source", width: 250, render(v, t, d) {
      let src = v.src || ''
      return '<textarea class="txta-table-video-src" id="txta_table_video_src_'+d._id+'">' + src + '</textarea>'
    }},     
    {width: 100,
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {
        // console.log(cell, cellData, rowData)
        return Blaze.renderWithData(Template.AdminVideoActions, {
          data: rowData
        }, cell);
      },  
    },
     {data: "createdAt", visible: false},
     {data: "_id", visible: false},
     {data: "status", visible: false},
     {data: "video.videoId", visible: false},
  ]   
})

TabularTables.TrainingModuleVideosMini = new Tabular.Table({
  name: "TrainingModuleVideosMini",
  collection: TrainingModuleVideos,
  order: [[5, 'desc'], [4, 'desc'], [0, 'asc']],
  pageLength: 10,
  lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
  processing: false,
  language: {     
     lengthMenu: "Showing _MENU_ videos per page",
     zeroRecords: "No video Data",     
     info: "Showing _START_ to _END_ of _TOTAL_ videos",
     infoEmpty: "No video records available",
     infoFiltered: "(filtered from _MAX_ total videos)",
     processing: ""
  },
  columns: [
    {class: 'video-thumbnail', title: "Video",
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {            
        return Blaze.renderWithData(Template.AdminVideoThumbnail, {
          data: rowData
        }, cell);
      },
    },  
    {data: "title", title: "Title", class: 'col-xs-2 module-page-edit-all-videos-title', render(v,t,d) {
      let title = v || ''
      let myTitle = '<input type="text" class="input-table-video-title" id="input_table_video_title_'+d._id+'" value="'+title+'">'
      return myTitle 
    }},
    {data: "video", title: "Duration", class:'tbl-video-duration-container', width: 60, render(v,t,d) {
      let duration = v.duration || ''
      let myDuration = '<input type="text" class="input-table-video-duration" id="input_table_video_duration_'+d._id+'" value="'+duration+'">'
      return myDuration
    }},    
    {data: "description", title: "Description", class: 'col-xs-1 module-page-edit-all-videos-desc', render(v, t, d) {
      let desc = v || ''
      return '<textarea class="txta-table-video-desc" id="txta_table_video_desc_'+d._id+'">' + desc + '</textarea>'
    }},
    {data: "video", title: "Source", class: 'col-xs-1', render(v, t, d) {
      let src = v && v.src || ''
      return '<textarea id="txta_module_page_edit_all_videos_src_'+d._id+'" class="txta-module-page-edit-all-videos-src" readonly>' + src + '</textarea>'
    }},
    {class: 'col-xs-1',
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {        
        return Blaze.renderWithData(Template.AdminModulePageAllVideosActions, {
          data: rowData
        }, cell);
      },  
    },     
     {data: "createdAt", visible: false},
     {data: "modifiedAt", visible: false},
     {data: "_id", visible: false},
     {data: "status", visible: false},
  ]   
})

