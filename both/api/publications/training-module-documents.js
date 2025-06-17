if(Meteor.isServer) {

/**
 * File colletion on the training module audio objects
 */
import { Meteor} from 'meteor/meteor'

import { check } from 'meteor/check'

import { TrainingModuleDocumentsCFS } from '/both/api/collections/training-module-documents.js'

  Meteor.publish('training_module_documents_cfs_w_ids', function publishTrainingModuleDocumentsCFSWIds(ids) {
    check(ids, Array) 

    return TrainingModuleDocumentsCFS.find({
      _id: {$in: ids},
      status: {$ne: 4}
    })
  })

  Meteor.publish('all_active_training_module_documents_cfs', function publishAllTrainingModuleDocumentsCFS() {
    return TrainingModuleDocumentsCFS.find({status: 1})
  })

}
 

