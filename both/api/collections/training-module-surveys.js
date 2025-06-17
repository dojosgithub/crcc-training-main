/**
 * TrainingModuleSurveys collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

// import { SimpleSchema } from 'meteor/aldeed:simple-schema'

// const SimpleSchema = require('simpl-schema') //-- not working

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema
import Tabular from 'meteor/aldeed:tabular'

export const TrainingModuleSurveys = new Mongo.Collection('training_module_surveys')

TrainingModuleSurveys.creatorSchema = new SimpleSchema({
  fullname: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  }
})

TrainingModuleSurveys.settingsSchema = new SimpleSchema({
  surveyType: {
    type: Number,
    defaultValue: 1
  },
  questionOrderType: {
    type: Number,
    defaultValue: 1
  },
  answerType: {
    type: Number,
    defaultValue: 1
  },  
  scoreOption: {
    type: Number,
    optional: true,
    defaultValue: 1
  },
  scoreOptionPoints: {
    type: Number,
    optional: true,
    defaultValue: 10
  },
  possibleAttempts: {
    type: Number,
    defaultValue: 1
  },
  possibleAttemptsReducePercent: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  possibleAttemptsReduceTarget: {
    type: Number,
    defaultValue: 1
  },
  surveyDurationHours: {
    type: Number,
    optional: true    
  },
  surveyDurationMinutes: {
    type: Number,
    optional: true    
  },
  showTimer: {
    type: Boolean,
    optional: true
  },
  showWarningMessage: {
    type: Boolean,
    optional: true
  },
  warningMessageMinutes: {
    type: Number,
    optional: true
  },
  warningMessage: {
    type: String,
    optional: true
  }
})

TrainingModuleSurveys.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },  
  title: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  settings: {
    type: TrainingModuleSurveys.settingsSchema,
    optional: true,
    blackbox: true
  },
  questions: {
    type: Number,
    optional: true,
    defaultValue: 0
  },  
  order: {
    type: Number,
    optional: true,
    defaultValue: 0
  },
  status: {
    type: Number,
    optional: true,
    autoValue: function() {
      if(this.isInsert) {
        return 2
      }
    }
  },
  creator: {
    type: TrainingModuleSurveys.creatorSchema,
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

// TrainingModuleSurveys.attachSchema(TrainingModuleSurveys.schema)

//-- Surveys collection table
TabularTables = {};

TabularTables.TrainingModuleSurveys = new Tabular.Table({
  name: "TrainingModuleSurveys",
  collection: TrainingModuleSurveys,
  order: [[4, 'desc']],
  pageLength: 10,
  lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
  processing: false,
  language: {
     // lengthMenu: "Display _MENU_ records per page",
     lengthMenu: "Showing _MENU_ surveys per page",
     zeroRecords: "No survey data",
     // info: "Showing page _PAGE_ of _PAGES_",
     info: "Showing _START_ to _END_ of _TOTAL_ surveys",
     infoEmpty: "No survey data available",
     infoFiltered: "(filtered from _MAX_ total surveys)",
     processing: ""
  },
  columns: [
    {data: "title", title: "Title", width: 150, render(v,t,d) {
      let title = v || ''
      let myTitle = '<input type="text" class="input-survey-title" id="input_survey_title_'+d._id+'" value="'+title+'">'
      return myTitle 
    }},
    {data: "description", title: "Description", width: 250, render(v, t, d) {
      let desc = v || ''
      return '<textarea class="txta-survey-desc" id="txta_survey_desc_'+d._id+'">' + desc + '</textarea>'
    }},
    // {data: "settings", title: "Duration", width: 50, render(v, t, d) {
    //   let hours = v && v.surveyDurationHours || ''
    //   let mins = v && v.surveyDurationMinutes || '00'
    //   return hours ? hours + ':' + mins : mins
    // }},
    {data: "questions", title: "Questions", width: 100},
    {data: "status", title: "Status", width: 50, render(v, t, d) {
      let status = v === 1 ? 'active.' : 'inactive'
      return status
    }},
    {width: 150,
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {        
        return Blaze.renderWithData(Template.AdminSurveyActions, {
          data: rowData
        }, cell);
      },  
    },
     {data: "createdAt", visible: false},
     {data: "_id", visible: false},
     {data: "status", visible: false},
  ]   
})

TabularTables.TrainingModuleSurveysReportTable = new Tabular.Table({
  name: "TrainingModuleSurveysReportTable",
  collection: TrainingModuleSurveys,
  order: [[5, 'desc']],
  // sort: false,
  pageLength: 10,
  lengthMenu: [[10, 20, 30, 50, 100, 150], [10, 20, 30, 50, 100, 150]],
  processing: false,
  language: {
     // lengthMenu: "Display _MENU_ records per page",
     lengthMenu: "Showing _MENU_ surveys per page",
     zeroRecords: "No survey data",
     // info: "Showing page _PAGE_ of _PAGES_",
     info: "Showing _START_ to _END_ of _TOTAL_ surveys",
     infoEmpty: "No survey data available",
     infoFiltered: "(filtered from _MAX_ total surveys)",
     processing: ""
  },
  columns: [
    {data: "title", title: "Title", width: 100, orderable: false, render(v,t,d) {
      let title = v || ''
      let myTitle = '<input type="text" class="input-survey-title" id="input_survey_title_'+d._id+'" value="'+title+'">'
      return myTitle 
    }},
    // {data: "settings", title: "Duration", width: 50, render(v, t, d) {
    //   let hours = v && v.surveyDurationHours || ''
    //   let mins = v && v.surveyDurationMinutes || '00'
    //   return hours ? hours + ':' + mins : mins
    // }},
    {data: "questions", title: "Questions", width: 100, orderable: false},
    {title: "Modules", width: 150, orderable: false, 
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {   
      // console.log(cellData)
        return Blaze.renderWithData(Template.AdminSurveyReportTableModules, {
          data: rowData
          // data: cellData
        }, cell);
      },  
    },    
    {title: "Stats", width: 100, orderable: false, 
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {        
        return Blaze.renderWithData(Template.AdminSurveyReportTableStats, {
          data: rowData
        }, cell);
      },  
    },
    {width: 150, orderable: false, title: 'Actions', 
      createdCell: Meteor.isClient && function (cell, cellData, rowData) {        
        return Blaze.renderWithData(Template.AdminSurveyReportTableActions, {
          data: rowData
        }, cell);
      },
    },
     {data: "createdAt", visible: false},
     {data: "_id", visible: false},
     {data: "status", visible: false},
  ]   
})

