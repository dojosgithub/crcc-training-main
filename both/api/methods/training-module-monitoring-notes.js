/**
 * Training Module Audio methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleMonitoringNotes } from '/both/api/collections/training-module-monitoring-notes.js'
import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'

export const saveNote = new ValidatedMethod({
  name: 'TrainingModuleMonitoringNotes.methods.saveNote',
  // validate: new SimpleSchema(MySchema.TrainingModuleAudios).validator(),
  validate: ()=>{},
  run(obj) {
    check(obj, {
        userId: String,
        pageId: String,
        moduleId: String,
        note: String,
        pageNumber: Number,
        port: Number,
        documentId: String
    })    

    return TrainingModuleMonitoringNotes.update({
        userId: obj.userId,
        moduleId: obj.moduleId,
        pageId: obj.pageId        
    }, {
        $setOnInsert: {
            createdAt: new Date
        },
        $set: {
            note: obj.note,
            page: obj.pageNumber,
            port: obj.port,
            documentId: obj.documentId,
            modifiedAt: new Date
      }
    },
    {
        upsert: true
    })
  }  
})

export const submitNote = new ValidatedMethod({
  name: 'TrainingModuleMonitoringNotes.methods.submitNote',
  // validate: new SimpleSchema(MySchema.TrainingModuleAudios).validator(),
  validate: ()=>{},
  run(obj) {

    check(obj, {
        userId: String,
        pageId: String,
        moduleId: String,
        submitted: Boolean
    })    

    return TrainingModuleMonitoringNotes.update({
        userId: obj.userId,
        moduleId: obj.moduleId,
        pageId: obj.pageId        
    }, {
        $set: {
          status: 3,
          submitted: obj.submitted,
          modifiedAt: new Date
      }
    })
  }
})

export const getPageMonitoringNote = new ValidatedMethod({
    name: 'TrainingModuleMonitoringNotes.methods.getPageMonitoringNote',
    // validate: new SimpleSchema(MySchema.TrainingModuleAudios).validator(),
    validate: ()=>{},
    run(obj) {
      check(obj, {
          userId: String,
          pageId: String,
          moduleId: String          
      })
  
      return TrainingModuleMonitoringNotes.findOne({
          userId: obj.userId,
          moduleId: obj.moduleId,
          pageId: obj.pageId        
      })
    }  
  })

  export const resetPageMonitoringNotesExercise = new ValidatedMethod({
    name: 'TrainingModuleMonitoringNotes.methods.resetPageMonitoringNotesExercise',    
    validate: ()=>{},
    run(obj) {
  
      check(obj, {
          userId: String,
          pageId: String,
          moduleId: String,
          order: Number          
      })    
  
      let _update = TrainingModuleMonitoringNotes.update({
          userId: obj.userId,
          moduleId: obj.moduleId,
          pageId: obj.pageId        
      }, {
          $set: {
            status: 1,
            submitted: false,
            modifiedAt: new Date
        }
      })

      if(_update) {

        let _orders = [obj.order, obj.order+1];

        let _statUpdate = TrainingModuleUserStats.update({
          userId: obj.userId,
          moduleId: obj.moduleId          
        }, {
          $pull: {
            pages: { $in: _orders}
          }
        }, {
          multi: true
        })

        return _statUpdate;
      }
    }
  })  