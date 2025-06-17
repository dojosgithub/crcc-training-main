if(Meteor.isServer) {

    /**
     * Publication logic on TrainingModule User Stats collection
     */
    import { Meteor } from 'meteor/meteor'
    import { check } from 'meteor/check'
    
    import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js'
    
    Meteor.publish('training_status_summary_w_uid', (uid) => {
      check(uid, Match.Optional(Match.OneOf(undefined, null, String)))

      if(uid) {
        return TrainingStatusSummary.find({
          userId: uid,
          checked: true
        })
      }
    })

    Meteor.publish('training_status_summary_w_uids_n_mids', (obj) => {
        check(obj, Object)
      
        return TrainingStatusSummary.find({
          userId: {$in: obj.userIds},
          moduleId: {$in: obj.moduleIds}
        })
      })

    }
    