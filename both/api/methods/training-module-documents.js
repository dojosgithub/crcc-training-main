/**
 * Training Module Audio methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleDocumentsCFS } from '/both/api/collections/training-module-documents.js'
import { TrainingModuleMonitoringNotes } from '/both/api/collections/training-module-monitoring-notes.js'

export const updateDocument = new ValidatedMethod({
  name: 'TrainingModuleDocumentsCFS.methods.updateDocument',
  // validate: new SimpleSchema(MySchema.TrainingModuleAudios).validator(),
  validate: ()=>{},
  run(doc) {
    check(doc, Object)        
    
    // console.log(doc)

    return TrainingModuleDocumentsCFS.update(doc._id, {
      $set: {
        title: doc.title,        
        description: doc.description,        
        modifiedAt: new Date
      }
    })
  }  
})

export const updateDocumentStatus = new ValidatedMethod({
  name: 'TrainingModuleDocumentsCFS.methods.updateDocumentStatus',
  // validate: null,
  validate: ()=>{},
  run(doc) {
    check(doc, Object)
    
    return TrainingModuleDocumentsCFS.update(doc._id, {
      $set: {
        status: doc.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const getAllDocuments = new ValidatedMethod({
  name: 'TrainingModuleDocumentsCFS.methods.getAllDocuments',
  // validate: null,
  validate: ()=>{},
  run() {
    return TrainingModuleDocumentsCFS.find({
      status: 1
    }).fetch();
  }  
})

export const getDocumentsWithIds = new ValidatedMethod({
  name: 'TrainingModuleDocumentsCFS.methods.getDocumentsWithIds',
  // validate: null,
  validate: ()=>{},
  run(documentIds) {
    check(documentIds, Array)

    let output = Meteor.wrapAsync((sid, callback) => {

      let _data = TrainingModuleDocumentsCFS.find({
        _id: { $in: documentIds},
        status: 1
      }).fetch();

      callback(null, {success: true, data: _data });

    });

    let result = output("DQ")

    if(result) {
      return result.data
    }
  }  
})

export const getPageDocuments = new ValidatedMethod({
  name: 'TrainingModuleDocumentsCFS.methods.getPageDocuments',
  // validate: null,
  validate: ()=>{},
  run(obj) {
    check(obj, {
      pageDocumentIDs: Array
    })

    let output = Meteor.wrapAsync((sid, callback) => {

      let _data = TrainingModuleDocumentsCFS.find({
        _id: { $in: obj.pageDocumentIDs},
        status: 1
      }).fetch();

      callback(null, {success: true, data: _data });

    });

    let result = output("DQ")

    if(result) {
      return result.data
    }
  }  
})

export const getPageDocumentNNoteData = new ValidatedMethod({
  name: 'TrainingModuleDocumentsCFS.methods.getPageDocumentNNoteData',
  // validate: null,
  validate: ()=>{},
  run(obj) {
    check(obj, {
      userId: String,
      pageId: String,
      moduleId: String,
      pageDocumentIDs: Array
    })

    // console.log(obj)

    let output = Meteor.wrapAsync((sid, callback) => {

      let _pageDocuments = TrainingModuleDocumentsCFS.find({
        _id: { $in: obj.pageDocumentIDs},
        status: 1
      }).fetch();

      let _pageNotes = TrainingModuleMonitoringNotes.findOne({
        userId: obj.userId,
        pageId: obj.pageId,
        moduleId: obj.moduleId
      })

      callback(null, {success: true, data: {
        pageDocuments: _pageDocuments,
        pageNotes: _pageNotes
      } });

    });

    let result = output("DQ")

    if(result) {      
      return result.data
    }
  }  
})
