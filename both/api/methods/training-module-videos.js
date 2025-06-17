/**
 * Training Module Videos methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// import { Email } from 'meteor/tarang:email-ses'
// import { Email } from 'meteor/email'

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'

// export const insertVideo = new Method('insertVideo', function(video) {
  
//   return TrainingModuleVideos.insert(video, {validate: true})
// })

export const insertVideo = new ValidatedMethod({
  name: 'insertVideo',
  // validate: new SimpleSchema(TrainingModuleVideos.schema).validator(),
  validate: ()=>{},
  run(video) {
    check(video, Object)

    video.createdAt = new Date
    video.modifiedAt = new Date
    
    // console.log(video);

    return TrainingModuleVideos.insert(video)
  }
})

export const updateVideoStatus = new ValidatedMethod({
  name: 'updateVideoStatus',
  // validate: new SimpleSchema(TrainingModuleVideos.schema).validator({clean: true, fliter: true}), 
  validate: ()=>{}, 
  run(video) {
    check(video, Object)
    
    return TrainingModuleVideos.update(video._id, {
      $set: {
        status: video.status,       
        modifiedAt: new Date
      }
    })
  }  
})

export const updateVideo = new ValidatedMethod({
  name: 'updateVideo',
  // validate: new SimpleSchema(TrainingModuleVideos.schema).validator({clean: true, fliter: true}),
  validate: ()=>{},
  run(video) {
    check(video, Object);

    $_set = {
      title: video.title,        
      description: video.description,
      'video.src': video.video.src,
      modifiedAt: new Date      
    }

    if(video.video.duration) {
      $_set['video.duration'] = video.video.duration;
    }
        
    // console.log($_set);

    return TrainingModuleVideos.update(video._id, {
      $set: $_set
    })
  }  
})

export const countTotalVideos = new ValidatedMethod({
  name: 'countTotalVideos',  
  validate: ()=>{},
  run() {

    let count = TrainingModuleVideos.find({status: {$ne:4}}).count()
    // let count = 42
    // if(Meteor.isServer) {
      // if(Meteor.isClient){
      // Meteor.defer(() => {  
        // Email.send({ to:'david.qwk@gmail.com', from:'dqw.kim@gmail.com', subject:'test', text: 'test text' })
    //     // this.unblock()
      // })
    // }
    // }
    return count
    
  }  
})

export const countSearchResult = new ValidatedMethod({
  name: 'TrainingModuleVideos.methods.countSearchResult',  
  // validate: null,
  validate: ()=>{},
  run(input) {
    check(input, Object)
  
    let keyword = input.keyword

    let result = TrainingModuleVideos.find({
      $or: [
        {label: {$regex: new RegExp(keyword, 'i')}},
        {description: {$regex: new RegExp(keyword, 'i')}},        
      ],      
      status: {$ne: 4}
    })

    let count = result.count()

    return count
  }  
})
