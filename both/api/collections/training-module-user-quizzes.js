/**
 * TrainingModuleUserQuizzes collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

// import { SimpleSchema } from 'meteor/aldeed:simple-schema'

// const SimpleSchema = require('simpl-schema') //-- not working

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema
// import Tabular from 'meteor/aldeed:tabular'

export const TrainingModuleUserQuizzes = new Mongo.Collection('training_module_user_quizzes')

TrainingModuleUserQuizzes.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },  
  userId: {
    type: String,
    optional: true
  },
  moduleId: {
    type: String,
    optional: true
  },  
  quizId: {
    type: String,
    optional: true
  },
  questions: {
    type: Array,
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true,
    defaultValue: new Date  
  },
  modifiedAt: {
    type: Date,
    optional: true,
    defaultValue: new Date
  },  
})

// TrainingModuleUserQuizzes.attachSchema(TrainingModuleUserQuizzes.schema)

// //-- Quizzes collection table
// TabularTables = {};

// TabularTables.TrainingModuleUserQuizzes = new Tabular.Table({
//   name: "TrainingModuleUserQuizzes",
//   collection: TrainingModuleUserQuizzes,
//   order: [[4, 'desc']],
//   pageLength: 10,
//   lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
//   processing: false,
//   language: {
//      // lengthMenu: "Display _MENU_ records per page",
//      lengthMenu: "Showing _MENU_ quizzes per page",
//      zeroRecords: "No quiz data",
//      // info: "Showing page _PAGE_ of _PAGES_",
//      info: "Showing _START_ to _END_ of _TOTAL_ quizzes",
//      infoEmpty: "No quiz data available",
//      infoFiltered: "(filtered from _MAX_ total quizzes)",
//      processing: ""
//   },
//   columns: [
//     {data: "title", title: "Title", width: 150, render(v,t,d) {
//       let title = v || ''
//       let myTitle = '<input type="text" class="input-quiz-title" id="input_quiz_title_'+d._id+'" value="'+title+'">'
//       return myTitle 
//     }},
//     {data: "description", title: "Description", width: 250, render(v, t, d) {
//       let desc = v || ''
//       return '<textarea class="txta-quiz-desc" id="txta_quiz_desc_'+d._id+'">' + desc + '</textarea>'
//     }},  
//     {data: "settings", title: "Duration", width: 50, render(v, t, d) {
//       let hours = v && v.quizDurationHours || ''
//       let mins = v && v.quizDurationMinutes || '00'
//       return hours ? hours + ':' + mins : mins
//     }}, 
//     {data: "questions", title: "Questions", width: 100},
//     {data: "status", title: "Status", width: 50, render(v, t, d) {
//       let status = v === 1 ? 'active.' : 'inactive'
//       return status
//     }},          
//     {width: 150,
//       createdCell: Meteor.isClient && function (cell, cellData, rowData) {        
//         return Blaze.renderWithData(Template.AdminQuizActions, {
//           data: rowData
//         }, cell);
//       },  
//     },     
//      {data: "createdAt", visible: false},
//      {data: "_id", visible: false},
//      {data: "status", visible: false},
//   ]   
// })


