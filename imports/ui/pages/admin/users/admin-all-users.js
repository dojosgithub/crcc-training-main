/**
 * Admin All Users template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { Users } from '/both/api/collections/users.js'
import { TrainingModules } from '/both/api/collections/training-modules.js'

// import '/imports/ui/stylesheets/admin/users/admin-all-users.less'
import { AdminAllUsers } from '/imports/ui/pages/admin/users/admin-all-users.html'
import { AdminManageAllUsers } from '/imports/ui/pages/admin/users/admin-manage-all-users.js'

import { AdminAllUsersTemplate } from '/imports/ui/pages/admin/users/admin-all-users-template.js'

let _selfAdminAllUsers

Template.AdminAllUsers.onCreated(function adminAllUsersOnCreated() {

  _selfAdminAllUsers = this

  _selfAdminAllUsers.tplManageUserTRModules = new ReactiveVar()
  _selfAdminAllUsers.tplManageUserTRModulesUID = new ReactiveVar()
  _selfAdminAllUsers.tplAdminAllUserSearch = new ReactiveVar()

  _selfAdminAllUsers.autorun(() => {
    let TRModulesCursor = TrainingModules.find()

    if(TRModulesCursor && TRModulesCursor.fetch()) {
      let modules = []
      TRModulesCursor.fetch().forEach(function(m) {
        // console.log(m)
        if(m && m._id) {
          modules[m._id] = {name: m.name, pages: m.numPages, status: m.status}
        }
      })
      // console.log(modules)
      // Session.set('moduleNamesById', modules)
      // console.log(Session.get('moduleNamesById'))
      // __moduleNamesById = modules
      __moduleNameNPagesById = modules
    }
  })

  let initSelector = {
    'profile.role': {$ne: '1'},
    'profile.status': {$ne: 4}    
  }

  Session.set('_selfAdminAllUsers.initSelector', initSelector)

})

Template.AdminAllUsers.onRendered(function adminAllUsersOnRendered() {
  $('#tblAdminAllUsers_filter').append($('.btn-view-search-options'))
  $('#tblAdminAllUsers_filter').append($('.btn-manage-all-users'))
})

Template.AdminAllUsers.helpers({
  adminAllUsersSelector() {
    return Session.get('_selfAdminAllUsers.initSelector')
  },
  tplManageUserTRModules() {
    return _selfAdminAllUsers.tplManageUserTRModules.get()
  },
  userData() {
    return _selfAdminAllUsers.tplManageUserTRModulesUID.get()
  },
  tplAdminAllUserSearch() {
    return _selfAdminAllUsers.tplAdminAllUserSearch.get()
  }
})

Template.AdminAllUsers.events({
  'click .btn-sync-user-data'(e, tpl) {
    e.preventDefault()

    if(Meteor.user()) {
      let _this = $(e.currentTarget)
      let uid = _this.parent().data('uid')

      let targetUser = Meteor.users.findOne(uid)

      // console.log(targetUser)

      if(targetUser && targetUser.profile.online) {
        toastr.warning("Aborted. " + targetUser.profile.fullname + " is currently online.")
        return
      }
      
      _this.button("loading")

      let obj = {
        _id: uid
      }

      import("/both/api/methods/admin-all-users.js").then(userMethods => {
        const { syncUserData } = userMethods
        syncUserData.call(obj, (err, res) => {
          if(err) {
            toastr.error("Something went wrong. Please try again. " + err)
          } else {
            if(res && res.success) {
              // console.log(res)
              toastr.info("User " + res.user.fullname + "'s data has been successfully synced.")
              _this.button("reset")
            }          
          }
                  
        })
      })

    } else {
      toastr.error("Your session has expired. Please sign-in and try again.")
      FlowRouter.go("/signout")
    }

  },
  'click .btn-manage-all-users'(e, tpl) {
    e.preventDefault()

    $('.admin-manage-all-users-container').show()
  },
  'click .btn-close-manage-all-users'(e, tpl) {
    e.preventDefault()

    $('.admin-manage-all-users-container').hide()
  },
  'click .btn-manage-user-tr-modules'(e, tpl) {
    e.preventDefault()

    let uid = $(e.currentTarget).parent().data('uid')
    // console.log('uid', uid)
    // _selfAdminAllUsers.tplManageUserTRModulesUID.set(uid)

    Session.set('manageTRModuleUid', uid)

    const utrModule = import('/imports/ui/pages/admin/users/admin-manage-user-tr-modules.js')

    utrModule.then(() => {
      _selfAdminAllUsers.tplManageUserTRModules.set('AdminManageUserTRModules')
      $(".admin-manage-user-tr-modules-container").show()
    })
  },
  'click .btn-close-manage-user-tr-modules'(e, tpl) {
    e.preventDefault()
    
    Session.set('myUserTRModules', null)

    $(".admin-manage-user-tr-modules-container").hide()
  },
  'click .btn-view-search-options'(e, tpl) {
    e.preventDefault()

    // if(!_selfAdminAllUsers.tplAdminAllUserSearch.get()) {
      import('/imports/ui/pages/admin/users/admin-all-users-search.js').then(() => {
        _selfAdminAllUsers.tplAdminAllUserSearch.set('AdminAllUsersSearch')
      })
    // } else {
    //   $('.row-admin-all-users-search').show()
    // } 
  },
  'click .btn-close-admin-all-users-search'(e, tpl) {
    e.preventDefault()

    _selfAdminAllUsers.tplAdminAllUserSearch.set(null)
  }
})

Template.AdminAllUsers.onDestroyed(() => {
  _selfAdminAllUsers.tplAdminAllUserSearch.set(null)
  // $('.row-admin-all-users-search').hide()

  // Session.set('_selfAdminAllUsers', null)

  Session.set('_selfAdminAllUsers.clientsToSearch', null)
  Session.set('_selfAdminAllUsers.busToSearch', null)
  Session.set('_selfAdminAllUsers.initSelector', null)

})


