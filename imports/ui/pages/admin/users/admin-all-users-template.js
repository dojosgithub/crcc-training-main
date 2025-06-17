/**
 * Admin All Users Modules/Modules template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { Users } from '/both/api/collections/users.js'
import { assignTrainingModule2User, updateUserStatus } from '/both/api/methods/admin-all-users.js'

// import { TrainingModuleUsers } from '/both/api/collections/training-module-users.js'
import { TrainingModuleUserStats } from '/both/api/collections/training-module-user-stats.js'
import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js'

// import '/imports/ui/stylesheets/admin/users/admin-all-users-actions.less'
// import '/imports/ui/stylesheets/admin/users/admin-all-users-modules.less'
// import '/imports/ui/stylesheets/admin/users/admin-all-users-template.less'
import { AdminAllUsersActions, AdminAllUsersModules } from '/imports/ui/pages/admin/users/admin-all-users-template.html'

let _selfAdminAllUsersActions

Template.AdminAllUsersActions.onCreated(function adminAllUsersActionsOnCreated() {
  _selfAdminAllUsersActions = this
})

Template.AdminAllUsersActions.onRendered(function adminAllUsersActionsOnRendered() {
})

Template.AdminAllUsersActions.helpers({
})

Template.AdminAllUsersActions.events({
})


let _selfAdminAllUsersModules
let _subsAdminAllUsersModules

Template.AdminAllUsersModules.onCreated(function adminAllUsersModulesOnCreated() {
  _selfAdminAllUsersModules = this

  _selfAdminAllUsersModules.uids = []
  _selfAdminAllUsersModules.mids = []

  _subsAdminAllUsersModules = new SubsManager()
  _subsAdminAllUsersStatusSummary = new SubsManager()

  // _selfAdminAllUsersModules.uid = new ReactiveVar()
  _selfAdminAllUsersModules.ready4UserStats = new ReactiveVar()
  _subsAdminAllUsersStatusSummary.ready4StatusSummary = new ReactiveVar()

  _selfAdminAllUsersModules.autorun(() => {
    // if(_selfAdminAllUsersModules.uid.get()) {
    //   let handleUserModules = _subsAdminAllUsersModules.subscribe('module_users_w_modules_by_uid', _selfAdminAllUsersModules.uid.get())
    //   _selfAdminAllUsersModules.ready.set(handleUserModules.ready())
    // }

    if(Session.get('_selfAdminAllUsersModules.userIds') && Session.get('_selfAdminAllUsersModules.moduleIds')) {
      let userIds = Session.get('_selfAdminAllUsersModules.userIds') || []
      let moduleIds = Session.get('_selfAdminAllUsersModules.moduleIds') || []

      let objUidsMids = {
        userIds: userIds,
        moduleIds: moduleIds
      }

      let handleUserStats = _subsAdminAllUsersModules.subscribe('training_module_user_stats_w_uids_n_mids', objUidsMids)
      _selfAdminAllUsersModules.ready4UserStats.set(handleUserStats.ready())

      let handleUserStatusSummary = _subsAdminAllUsersStatusSummary.subscribe('training_status_summary_w_uids_n_mids', objUidsMids)
      _subsAdminAllUsersStatusSummary.ready4StatusSummary.set(handleUserStatusSummary.ready())      
    }
  })
})

Template.AdminAllUsersModules.onRendered(function adminAllUsersModulesOnRendered() {
})

Template.AdminAllUsersModules.helpers({
  Modules() {
    let modules = ''
// console.log(this)
    if(this.data.profile.trainingModules) {
      let moduleIds = this.data.profile.trainingModules
      let userId = this.data._id

      _selfAdminAllUsersModules.uids.push(userId)

      let _userIds = $.unique(_selfAdminAllUsersModules.uids)

      Session.set('_selfAdminAllUsersModules.userIds', _userIds)

    // if(this.data.trainingModules) {
    //   let moduleIds = this.data.trainingModules    
      let len = moduleIds.length
      let i = 0
      moduleIds.forEach(function(mid) {

        _selfAdminAllUsersModules.mids.push(mid)

        let _moduleIds = $.unique(_selfAdminAllUsersModules.mids)

        Session.set('_selfAdminAllUsersModules.moduleIds', _moduleIds)

        let myStat = TrainingModuleUserStats.findOne({
          userId: userId,
          moduleId: mid
        })

        let mySummary = TrainingStatusSummary.findOne({
          userId: userId,
          moduleId: mid
        })

        // console.log(myStat.fetch())
        // console.log(myStat)

        // let totalPages = 0
        // let viewedPages = 0
        // let viewedPercent = 0

        let 
          _status = __moduleNameNPagesById[mid] && __moduleNameNPagesById[mid].status,
          _class = _status === 1 ? 'active' : 'inactive',
          _name = __moduleNameNPagesById[mid] && __moduleNameNPagesById[mid].name

        modules += '<div class="user-tr-module-name ' + _class + '">' + _name + '</div>'

        if(myStat && myStat.pages && myStat.pages.length > 0) {
          let totalPages = __moduleNameNPagesById[mid] && __moduleNameNPagesById[mid].pages

          if(totalPages > 0) {
            let viewedPages = myStat.pages.length -1
            let viewedPercent = Math.round(viewedPages/totalPages * 100)

            if(viewedPercent === 100) {
              if(mySummary && mySummary.startedAt > new Date(2021, 0, 29) && mySummary.trainingStatus !== 'Completed') {
                viewedPages = viewedPages -1;
                viewedPercent = 99;
              }
            }

            modules += '<button class="btn btn-xs btn-default btn-user-progress">' 
            modules += viewedPages + '/' + totalPages + ' (' + viewedPercent + '%)'
            modules += '</button>'
          }

          // console.log(myStat, myStat.pages, mid, totalPages)
        }

        if(i < len-1) {
          modules += '<hr class="users-module-divider">'
        }
        i++
      })
    }

    return modules
  },
  Modules1() {
    let modules = ''

    if(this.data.profile.trainingModules) {
      let moduleIds = this.data.profile.trainingModules
    // if(this.data.trainingModules) {
    //   let moduleIds = this.data.trainingModules    
      let len = moduleIds.length
      let i = 0
      moduleIds.forEach(function(m) {
        // modules += __moduleNamesById[m]
        modules += '<button class="btn btn-xs btn-default btn-user-tr-module-progress">'
        modules += '<span class="user-tr-module-name">'+__moduleNamesById[m]+'</span></button>'
        // if(i < len-1) {
        //   modules += '<br />'
        // }
        i++
      })
    }

    return modules
  },
  Progress() {

  }  
})

Template.AdminAllUsersActions.events({
  'click .btn-activate-user'(e, tpl) {
    e.preventDefault()

    let uid = $(e.currentTarget).data('uid')

    if(confirm("Are you sure to activate the user?")) {
      // Meteor.users.update(uid, {
      //   'profile.status': 1
      // }, (err, res) => {
      //   if(err) {
      //     toastr.error("Something went wrong. Please try again.")
      //   } else {
      //     toastr.info("Successfully activated.")
      //   }
      // })

      updateUserStatus.call({uid: uid, status: 1}, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again.")
        } else {
          toastr.info("Successfully activated.")
        }
      })

    }
  },
  'click .btn-deactivate-user'(e, tpl) {
    e.preventDefault()

    let uid = $(e.currentTarget).data('uid')

    if(confirm("Are you sure to de-activate the user?")) {
      // Meteor.users.update(uid, {
      //   'profile.status': 2
      // }, (err, res) => {
      //   if(err) {
      //     toastr.error("Something went wrong. Please try again.")
      //   } else {
      //     toastr.info("Successfully deactivated.")
      //   }
      // })


      updateUserStatus.call({uid: uid, status: 2}, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again.")
        } else {
          toastr.info("Successfully de-activated.")
        }
      })

    }
  },  
})
