/**
 * Training Module Audio methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'

// export const insertAudio = new ValidatedMethod({
//   name: 'insertAudio',
//   validate: new SimpleSchema(MySchema.TrainingModuleAudios).validator(),
//   run(audio) {
//     check(audio, Object)

//     audio.createdAt = new Date
//     audio.modifiedAt = new Date
    
//     return TrainingModuleAudios.insert(audio)
//   }
// })

export const updateAudio = new ValidatedMethod({
  name: 'TrainingModuleAudiosCFS.methods.updateAudio',
  // validate: new SimpleSchema(MySchema.TrainingModuleAudios).validator(),
  validate: ()=>{},
  run(audio) {
    check(audio, Object)        
    
    return TrainingModuleAudiosCFS.update(audio._id, {
      $set: {
        title: audio.title,        
        description: audio.description,
        duration: audio.duration,
        modifiedAt: new Date
      }
    })
  }  
})

export const updateAudioStatus = new ValidatedMethod({
  name: 'updateAudioStatus',
  // validate: null,
  validate: ()=>{},
  run(audio) {
    check(audio, Object)
    
    return TrainingModuleAudiosCFS.update(audio._id, {
      $set: {
        status: audio.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const countTotalAudios = new ValidatedMethod({
  name: 'countTotalAudios',  
  validate: ()=>{},
  run() {

    return TrainingModuleAudiosCFS.find({status: {$ne:4}}).count()
    
  }  
})

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleAudiosCFS.methods.countSearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleAudiosCFS.find({
      $or: [
        {title: {$regex: new RegExp(keyword, 'i')}},
        {description: {$regex: new RegExp(keyword, 'i')}},
        {'original.name': {$regex: new RegExp(keyword, 'i')}}
      ],      
      status: {$ne: 4}
    })

    let count = result.count()

    return count
  }  
})

// export const deleteAudio = new ValidatedMethod({
//   name: 'deleteAudio',  
//   validate: ()=>{},
//   run(audio) {           
//     check(audio, Object)

//     return TrainingModuleAudiosCFS.update(audio._id, {
//       $set: {
//         status: audio.status,        
//         modifiedAt: new Date
//       }
//     })
//   }  
// })

// export const activateAudio = new ValidatedMethod({
//   name: 'activateAudio',  
//   validate: ()=>{},
//   run(audio) {           
//     check(audio, Object)

//     return TrainingModuleAudiosCFS.update(audio._id, {
//       $set: {
//         status: audio.status,        
//         modifiedAt: new Date
//       }
//     })
//   }  
// })

// export const deactivateAudio = new ValidatedMethod({
//   name: 'deactivateAudio',  
//   validate: ()=>{},
//   run(audio) {           
//     check(audio, Object)

//     return TrainingModuleAudiosCFS.update(audio._id, {
//       $set: {
//         status: audio.status,        
//         modifiedAt: new Date
//       }
//     })
//   }  
// })




