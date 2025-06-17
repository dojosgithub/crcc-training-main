if(Meteor.isServer) {

/**
 * File colletion on the training module images
 */
import { Meteor} from 'meteor/meteor'

import { check } from 'meteor/check'

import { TrainingModuleImagesCFS, TrainingModuleImages } from '/both/api/collections/training-module-images.js'


  Meteor.publish('all_training_module_images_cfs', function publishAllTrainingModuleImagesCFS() {
    return TrainingModuleImagesCFS.find({status: 1}, {
      sort: {modifiedAt: -1, uploadedAt: -1}
    })
  })

  Meteor.publish('training_module_images_cfs_w_page_limit', function publishAllTrainingModuleImagesCFSWPageLimit(thumb) {
    check(thumb, Object)

    let page = thumb.page
    let limit = thumb.limit

    return TrainingModuleImagesCFS.find({
      status: 1
    }, {
      skip: (page-1) * limit,
      limit: limit,
      sort: {modifiedAt: -1, uploadedAt: -1}
    })
  })

  Meteor.publish('training_module_image_cfs_w_id', function publishTrainingModuleImageCFSWId(id) {
    
    return TrainingModuleImagesCFS.find({
      _id: id, 
      status: 1
    }, {
      sort: {modifiedAt: -1, uploadedAt: -1}
    })
  }) 

  Meteor.publish('training_module_images_cfs_w_ids', function publishTrainingModuleImageCFSWIds(ids) {
    check(ids, Array)

    return TrainingModuleImagesCFS.find({
      _id: {$in: ids},
      status: 1
    }, {
      sort: {modifiedAt: -1, uploadedAt: -1}
    })
  }) 

  // Meteor.publish('training_module_images_cfs_w_keyword0', function publishTrainingModuleImageCFSWId(keyword) {
  //   check(keyword, String)

  //   return TrainingModuleImagesCFS.find({
  //     $text: { //-- Text search works only for the whold word. We need LIKE, so, this won't work.
  //       $search: keyword
  //     },
  //     status: 1
  //   })
  // }) 

  Meteor.publish('training_module_images_cfs_w_keyword', function publishTrainingModuleImageCFSWKeyword(keyword) {
    check(keyword, String)
    
    return TrainingModuleImagesCFS.find({
      $or: [
        {label: {$regex: new RegExp(keyword, 'i')}},
        {description: {$regex: new RegExp(keyword, 'i')}},
        {'original.name': {$regex: new RegExp(keyword, 'i')}},
      ],      
      status: 1
    }, {
      sort: {modifiedAt: -1, uploadedAt: -1}
    })
  }) 

  Meteor.publish('training_module_images_cfs_w_keyword_limit', function publishTrainingModuleImageCFSWLeywordLimit(input) {
    check(input, Object)
    
    let keyword = input.keyword
    let page = input.page
    let limit = input.limit

    let result = TrainingModuleImagesCFS.find({
      $or: [
        {label: {$regex: new RegExp(keyword, 'i')}},
        {description: {$regex: new RegExp(keyword, 'i')}},
        {'original.name': {$regex: new RegExp(keyword, 'i')}},
      ],      
      status: 1
    }, {
      skip: (page-1) * limit,
      limit: limit,
      sort: {modifiedAt: -1, uploadedAt: -1}
    })

    // let count = result.count()

    // result.count = count
    // result['count'] = count
    // result._mongo.count = count
    // console.log(result)
    // return {result: result, count: count}
    return result
  })

}

