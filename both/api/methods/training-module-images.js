/**
 * Training Module image methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'

export const updateImage = new ValidatedMethod({
  name: 'updateImage',
  validate: ()=>{},
  run(image) {
    check(image, Object)        
    
    return TrainingModuleImagesCFS.update(image._id, {
      $set: {
        label: image.label,        
        description: image.description,      
        modifiedAt: new Date
      }
    })
  }  
})

export const deleteImage = new ValidatedMethod({
  name: 'deleteImage',  
  validate: ()=>{},
  run(image) {           
    check(image, Object)

    return TrainingModuleImagesCFS.update(image._id, {
      $set: {
        status: image.status,        
        modifiedAt: new Date
      }
    })
  }  
})

export const activateImage = new ValidatedMethod({
  name: 'activateImage',  
  validate: ()=>{},
  run(image) {           
    check(image, Object)

    return TrainingModuleImagesCFS.update(image._id, {
      $set: {
        status: image.status,        
        modifiedAt: new Date
      }
    })
  }  
})

export const deactivateImage = new ValidatedMethod({
  name: 'deactivateImage',  
  validate: ()=>{},
  run(image) {           
    check(image, Object)

    return TrainingModuleImagesCFS.update(image._id, {
      $set: {
        status: image.status,        
        modifiedAt: new Date
      }
    })
  }  
})

export const countTotalImages = new ValidatedMethod({
  name: 'countTotalImages',  
  validate: ()=>{},
  run() {

    return TrainingModuleImagesCFS.find({status: {$ne:4}}).count()
    
  }  
})

// export const searchImages = new ValidatedMethod({
//   name: 'searchImages',  
//   validate: ()=>{},
//   run(input) {
//     check(input, Object)
//   // console.log(input)  
//     let keyword = input.keyword
//     let page = input.page
//     let limit = input.limit

//     let result = TrainingModuleImagesCFS.find({
//       $or: [
//         {label: {$regex: new RegExp(keyword, 'i')}},
//         {description: {$regex: new RegExp(keyword, 'i')}},
//         {'original.name': {$regex: new RegExp(keyword, 'i')}},
//       ],      
//       status: 1
//     }, {
//       skip: (page-1) * limit,
//       limit: limit,
//       sort: {modifiedAt: -1, uploadedAt: -1}
//     })

//     let count = result.count()

//     // result.count = count
//     // result['count'] = count
//     result.count = count //-- not working, this isn't delivered to client
//     // console.log(result)
//     // return {result: result, count: count}
//     return result
    
//   }  
// })

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleImagesCFS.methods.countSearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleImagesCFS.find({
      $or: [
        {label: {$regex: new RegExp(keyword, 'i')}},
        {description: {$regex: new RegExp(keyword, 'i')}},
        {'original.name': {$regex: new RegExp(keyword, 'i')}},
      ],      
      status: {$ne: 4}
    })

    let count = result.count()

    return count
  }  
})

