if(Meteor.isServer) {

/**
 * Publication logic on TrainingModuleVideos collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { TrainingModuleVideos } from '/both/api/collections/training-module-videos.js'

Meteor.publish('all_training_module_videos', () => 
  TrainingModuleVideos.find({
    status: {$ne: 4} //-- Exclude deleted videos
  })
)

Meteor.publish('all_active_training_module_videos', () => 
  TrainingModuleVideos.find({
    status: 1
  })
)

Meteor.publish('all_inactive_training_module_videos', () => 
  TrainingModuleVideos.find({
    status: 2
  })
)

// Meteor.publish('training_module_videos_w_ids', (ids) => { //-- called by admin-new-video.js
//   check(ids, Array)

//   return TrainingModuleVideos.find({
//     status: {$ne: 4}, 
//     _id: {$in: ids}
//   })
// })

Meteor.publish('training_module_videos_w_ids', function publishTrainingModuleVidoesWIDs(ids) { //-- called by admin-new-video.js
  check(ids, Array)

  return TrainingModuleVideos.find({
    status: {$ne: 4}, 
    _id: {$in: ids}
  })
})

Meteor.publish('training_module_video_w_id', (videoId) => {
  check(videoId, String)

  return TrainingModuleVideos.find({
    _id: videoId,
    status: 1
  })
})

Meteor.publish('training_module_videos_w_page_limit', function publishTrainingModuleVidoesWPageLimit(video) {
  check(video, Object)

  let page = video.page
  let limit = video.limit

  return TrainingModuleVideos.find({
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })
})

Meteor.publish('training_module_videos_w_keyword_limit', function publishTrainingModuleVidoesWKeywordLimit(input) {
  check(input, Object)
  
  let keyword = input.keyword
  let page = input.page
  let limit = input.limit

  let result = TrainingModuleVideos.find({
    $or: [
      {title: {$regex: new RegExp(keyword, 'i')}},
      {description: {$regex: new RegExp(keyword, 'i')}}      
    ],      
    status: {$ne: 4}
  }, {
    skip: (page-1) * limit,
    limit: limit,
    sort: {modifiedAt: -1, createdAt: -1}
  })

  return result
}) 

Meteor.publish('tutorial_video', () => {
  return TrainingModuleVideos.find('FxNoioJpQ2EHDsTxS')
})

}


