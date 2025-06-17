/**
 * Training Module Settings methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleSettings } from '/both/api/collections/training-module-settings.js'

// export const insertSetting = new Method('insertSetting', function(settings) {
//   return TrainingModuleSettings.insert(settings, {validate: true})
// })

export const insertSettings = new ValidatedMethod({
  name: 'TrainingModuleSettings.methods.insertSetting',
  // validate: new SimpleSchema(TrainingModuleSettings.schema).validator(),
  validate: ()=>{},
  run(settings) {
    check(settings, Object)

    settings.createdAt = new Date
    settings.modifiedAt = new Date
    
    return TrainingModuleSettings.insert(settings)
  }
})

export const getSetSettings = new ValidatedMethod({
  name: 'TrainingModuleSettings.methods.getSetSettings',
  // validate: null,
  validate: ()=>{},
  run(user) {
    check(user, Object)
    
    let mySettings = TrainingModuleSettings.findOne({
      userId: user.userId
    })
    if(mySettings && mySettings._id) {
      return mySettings
    } else {
      
      let settingsObj = {
        userId: user.userId,
        videoAutoplay: false, //-- it was true by default until 07/25/2019, disabled 'autoplay' due to muted sound in Chrome etc...
        createdAt: new Date,
        modifiedAt: new Date        
      }

      TrainingModuleSettings.insert(settingsObj, (err, res) => {
        if(res) {
          settingsObj._id = res
          return settingsObj
        }
      })
    }
  }
})

export const updateSettingsVideoAutoplay = new ValidatedMethod({
  name: 'TrainingModuleSettings.methods.updateSettingsVideoAutoplay',
  // validate: new SimpleSchema(TrainingModuleSettings.schema).validator(),
  validate: ()=>{},
  run(settings) {
    check(settings, Object)

    return TrainingModuleSettings.findAndModify({
      query: {_id: settings._id},
      update: {
        $set: {
          videoAutoplay: settings.videoAutoplay,
          modifiedAt: new Date
        }
      },
      new: true
    })

  }
})

export const updateSettings = new ValidatedMethod({
  name: 'TrainingModuleSettings.methods.updateSettings',
  // validate: new SimpleSchema(TrainingModuleSettings.schema).validator(),
  validate: ()=>{},
  run(settings) {
    check(settings, Object)

    settings._set.modifiedAt = new Date

    return TrainingModuleSettings.findAndModify({
      query: {_id: settings._id},
      update: {
        $set: settings._set
      },
      new: true
    })

  }
})
