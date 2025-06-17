/**
 * ETL methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'


export const migrateVideoObject = new ValidatedMethod({
  name: 'ETL.methods.migrateVideoObject',
  // validate: new SimpleSchema(TrainingModuleVideos.schema).validator(),
  validate: ()=>{},
  run() {

    let videoObjects = TrainingModuleVideos.find().fetch()

    if(videoObjects && videoObjects.length > 0) {
      videoObjects.forEach(function(v) {
        if(v.videoSrc) {

          TrainingModuleVideos.update(v._id, {
            $set: {
              'video.src': v.videoSrc
            }
          })
        }
      })
    }

    return videoObjects
  }
})

