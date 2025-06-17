if(Meteor.isServer) {

/**
 * Publication logic on TrainingModules collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate'

import { TrainingModules } from '/both/api/collections/training-modules.js'

Meteor.publish('all_training_modules', () => 
  TrainingModules.find({
    status: {$ne: 4} //-- Exclude deleted modules
  })
)

Meteor.publish('all_active_training_modules', () => 
  TrainingModules.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_modules', () => 
  TrainingModules.find({
    status: 2
  })
)

Meteor.publish('training_module_w_id', (moduleId) => {
  check(moduleId, String)

  TrainingModules.find({
    _id: moduleId,
    status: 1
  })
})

Meteor.publish('training_modules_w_ids', function (ids) {
  check(ids, Array)

  return TrainingModules.find({
    _id: {$in: ids},
    status: 1
  }, {
    sort: {createdAt: 1, modifiedAt: 1}
  })
})

Meteor.publish('training_modules_w_uid', function(uid) {
  check(uid, String)

  return ReactiveAggregate(this, Meteor.users,[
  {
    $match: {
      _id: uid      
    }
  },
  {
    $unwind: "$trainingModules"
  },
  {
    $lookup: {
      from: "training_modules",
        localField: "trainingModules",
        foreignField: "_id",
        as: "thisModule"      
    }
  }
  ])
})

}

