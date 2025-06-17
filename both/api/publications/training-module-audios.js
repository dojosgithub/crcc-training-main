if(Meteor.isServer) {

/**
 * File colletion on the training module audio objects
 */
import { Meteor} from 'meteor/meteor'

import { check } from 'meteor/check'

import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'

// if(Meteor.isServer) {
  Meteor.publish('all_training_module_audios_cfs', function publishAllTrainingModuleAudiosCFS() {
    return TrainingModuleAudiosCFS.find({
      status: {$ne: 4}
    })
  })

  Meteor.publish('all_active_training_module_audios_cfs', function publishAllTrainingModuleAudiosCFS() {
    return TrainingModuleAudiosCFS.find({status: 1})
  })

  Meteor.publish('training_module_audio_cfs_w_id', function publishTrainingModuleAudioCFSWId(id) {
    
    return TrainingModuleAudiosCFS.find({
      _id: id,
      status: 1
    })
  }) 

  Meteor.publish('training_module_audios_cfs_w_ids', function publishTrainingModuleAudioCFSWIds(ids) {
    check(ids, Array)

    return TrainingModuleAudiosCFS.find({
      _id: {$in: ids},
      status: {$ne: 4}
    })
  })   
// }

Meteor.publish('training_module_audios_w_page_limit', (thumb) => {
  check(thumb, Object)

  let page = thumb.page
  let limit = thumb.limit

  return TrainingModuleAudiosCFS.find({
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })
})

Meteor.publish('training_module_audios_w_keyword_limit', (input) => {
  check(input, Object)
  
  let keyword = input.keyword
  let page = input.page
  let limit = input.limit

  let result = TrainingModuleAudiosCFS.find({
    $or: [
      {title: {$regex: new RegExp(keyword, 'i')}},
      {description: {$regex: new RegExp(keyword, 'i')}},      
      {'original.name': {$regex: new RegExp(keyword, 'i')}}     
    ],      
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })

  return result
})

}
 

