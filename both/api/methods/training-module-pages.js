/**
 * Training Module Page methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'

export const insertModulePage = new ValidatedMethod({
  name: 'TrainingModulePages.methods.insert',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator({clean: true, filter: true}),
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  validate: ()=>{},
  run(page) {
    check(page, Object)

    page.createdAt = new Date
    page.modifiedAt = new Date;
    
    return TrainingModulePages.insert(page)
  }
})

export const updateModulePage = new ValidatedMethod({
  name: 'TrainingModulePages.methods.update',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  validate: ()=>{},
  run(page) {
    check(page, Object)        
    
    return TrainingModulePages.update(page._id, {
      $set: {
        title: page.title,
        type: page.type,        
        description: page.description,
        // videoSrc: page.videoSrc,
        template: page.template,
        quizId: page.quizId,
        quizType: page.quizType,
        quizShowScoreFeedback: page.quizShowScoreFeedback,
        surveyId: page.surveyId,
        instructions: page.instructions,
        transcript: page.transcript,
        duration: page.duration,
        durationHMS: page.durationHMS,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateModulePageOrder = new ValidatedMethod({
  name: 'TrainingModulePages.methods.updateOrder',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  validate: ()=>{},
  run(page) {
    check(page, Object)        
    
    return TrainingModulePages.update(page._id, {
      $set: {
        order: page.order,
        modifiedAt: new Date
      }
    })
  }  
})

// export const activateModulePage = new ValidatedMethod({
//   name: 'TrainingModulePages.methods.activate',
//   validate: new SimpleSchema(TrainingModulePages.schema).validator(),
//   run(page) {
//     check(page, Object)        
    
//     return TrainingModulePages.update(page._id, {
//       $set: {
//         status: 1,
//         modifiedAt: new Date
//       }
//     })
//   }  
// })

// export const deactivateModulePage = new ValidatedMethod({
//   name: 'TrainingModulePages.methods.deactivate',
//   validate: new SimpleSchema(TrainingModulePages.schema).validator(),
//   run(page) {
//     check(page, Object)        
    
//     return TrainingModulePages.update(page._id, {
//       $set: {
//         status: 2,
//         modifiedAt: new Date
//       }
//     })
//   }  
// })

// export const deleteModulePage = new ValidatedMethod({
//   name: 'TrainingModulePages.methods.delete',
//   validate: new SimpleSchema(TrainingModulePages.schema).validator(),
//   run(page) {
//     check(page, Object)        
    
//     return TrainingModulePages.update(page._id, {
//       $set: {
//         status: 4,
//         modifiedAt: new Date
//       }
//     })
//   }  
// })

export const updateModulePageStatus = new ValidatedMethod({
  name: 'TrainingModulePages.methods.updateModulePageStatus',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  // validate: new SimpleSchema({
  //   status: { type: Number },
  //   _id: { type: String },
  //   moduleId: { type: String },
  //   numPages: { type: Number }
  // }).validator(),
  validate: ()=>{},
  run(page) {
    check(page, Object)
    
    // console.log(page);

    TrainingModulePages.update(page._id, {
      $set: {
        status: page.status,
        modifiedAt: new Date
      }
    }, (err, res) => {
      if(err) {}
      else {
        return TrainingModules.update(page.moduleId, {
          $set: {
            numPages: page.numPages,
            modifiedAt: new Date
          }
        })
      }
    })
  }  
})

export const updateModulePageVideo = new ValidatedMethod({
  name: 'TrainingModulePages.methods.updateVideo',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  validate: ()=>{},
  run(page) {
    check(page, Object)        
    
    return TrainingModulePages.update(page._id, {
      $set: {
        video: page.video,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateModulePageAudio = new ValidatedMethod({
  name: 'TrainingModulePages.methods.updateAudio',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  validate: ()=>{},
  run(page) {
    check(page, Object)        
    
    return TrainingModulePages.update(page._id, {
      $set: {
        audio: page.audio,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateModulePageDocument = new ValidatedMethod({
  name: 'TrainingModulePages.methods.updatePageDocument',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  validate: ()=>{},
  run(page) {
    check(page, Object)        
    
    return TrainingModulePages.update(page._id, {
      $set: {
        document: page.document,
        modifiedAt: new Date
      }
    })
  }  
})

export const addDocumentToPage = new ValidatedMethod({
  name: 'TrainingModulePages.methods.addDocumentToPage',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  validate: ()=>{},
  run(obj) {
    check(obj, {
      pageId: String,
      documentId: String
    })        
    
    return TrainingModulePages.update(obj.pageId, {
      $addToSet: { 
        document: obj.documentId
      },
      $set: {
        modifiedAt: new Date
      }
    })
  }  
})

export const removeDocumentFromPage = new ValidatedMethod({
  name: 'TrainingModulePages.methods.removeDocumentFromPage',
  // validate: new SimpleSchema(TrainingModulePages.schema).validator(),
  validate: ()=>{},
  run(obj) {
    check(obj, {
      pageId: String,
      documentId: String
    })        
    
    return TrainingModulePages.update(obj.pageId, {
      $pull: { 
        document: obj.documentId
      },
      $set: {
        modifiedAt: new Date
      }
    })
  }  
})

export const countActiveModulePages = new ValidatedMethod({
  name: 'TrainingModulePages.methods.count',
  validate: ()=>{},
  run(moduleId) {  
    check(moduleId, String)

    return TrainingModulePages.find({
      moduleId: moduleId,
      status: 1
    }).count()
  }  
})

export const getPreviousPageData = new ValidatedMethod({
  name: 'TrainingModulePages.methods.getPreviousPageData',
  validate: ()=>{},
  run(obj) {  
    check(obj, {
      pageId: String //-- current page _id
    })

    let _curPage = TrainingModulePages.findOne(obj.pageId);

    if(_curPage) {
      let
        _moduleId = _curPage.moduleId,
        _curPageIdx = _curPage.order,
        _prevPageIdx = _curPageIdx -1;

      let _prevPage = TrainingModulePages.findOne({
        moduleId: _moduleId,
        order: _prevPageIdx
      })

      return _prevPage;

    }

  }  
})