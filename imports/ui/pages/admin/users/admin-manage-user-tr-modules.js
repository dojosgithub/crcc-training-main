/**
 * Admin Manage User's Training Modules template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModuleUsers } from '/both/api/collections/training-module-users.js'

import { upsertModuleUser, sendTRModuleNotification } from '/both/api/methods/training-module-users.js'

import { AdminManageUserTRModules } from '/imports/ui/pages/admin/users/admin-manage-user-tr-modules.html'
// import '/imports/ui/stylesheets/admin/users/admin-manage-user-tr-modules.less'

let _selfAdminManageUserTRModules
let _subsAdminManageUserTRModules

Template.AdminManageUserTRModules.onCreated(function adminManageUserTRModuleOnCreated() {
  _selfAdminManageUserTRModules = this

  // _selfAdminManageUserTRModules.modules = []

  _selfAdminManageUserTRModules.ready4Modules = new ReactiveVar()

  _subsAdminManageUserTRModules = new SubsManager()

  _selfAdminManageUserTRModules.autorun(() => {

    if(Session.get('manageTRModuleUid')) {
      let handleMyModules = _subsAdminManageUserTRModules.subscribe('training_module_users_by_uid', Session.get('manageTRModuleUid'))
      _selfAdminManageUserTRModules.ready4Modules.set(handleMyModules.ready())
    }
  })  
})

Template.AdminManageUserTRModules.helpers({
  Modules() {
    return TrainingModules.find()
  },
  User() {
    let me = Meteor.users.findOne(Session.get('manageTRModuleUid'))

    // return me.profile.trainingModules
    return me
  }
  // _myModules() {
  //   if(_selfAdminManageUserTRModules.ready4Modules.get()) {
  //     _selfAdminManageUserTRModules.modules = []
      
  //     let modules = TrainingModuleUsers.find({
  //       userId: Session.get('manageTRModuleUid')
  //     })

  //     if(modules && modules.fetch() && modules.fetch().length > 0) {
  //       modules.fetch().forEach(function(m) {
  //         _selfAdminManageUserTRModules.modules.push(m.moduleId)
  //       })

  //       // return _selfAdminManageUserTRModules.modules
  //       Session.set('myUserTRModules', _selfAdminManageUserTRModules.modules)
  //     }
  //   }
  // },
  // myModules() {
  //   return Session.get('myUserTRModules')
  // }
})

Template.AdminManageUserTRModules.events({
  // 'change .chk-user-tr-module'(e, tpl) {
  //   e.preventDefault()

  //   let module = $(e.currentTarget).is(':checked')

  //   let mid = $(e.currentTarget).data('mid')
  //   let uid = Session.get('manageTRModuleUid')
  //   let status = module ? 1 : 2

  //   // console.log(module, mid, uid)

  //   let obj = {
  //     userId: uid,
  //     moduleId: mid,
  //     status: status
  //   }

  //   upsertModuleUser.call(obj, (err, res) => {
  //     if(err) {
  //       toastr.error("Something went wrong. Please try again. " + err)
  //     } else {
  //       toastr.info("Successfully saved.")
  //     }
  //   })
  // },
  'change .chk-user-tr-module'(e, tpl) {
    e.preventDefault()

    let uid = Session.get('manageTRModuleUid')
    let moduleName = $($(e.currentTarget).siblings('span.module-name')[0]).text()

    let moduleIds = []

    $(".chk-user-tr-module").each(function(idx) {      
      if($(this).is(':checked')) {
        moduleIds.push($(this).parent().data('mid'))
      }
    })

    // let module = $(e.currentTarget).is(':checked')

    // let mid = $(e.currentTarget).data('mid')
    // let uid = Session.get('manageTRModuleUid')
    // let status = module ? 1 : 2

    // // console.log(module, mid, uid)
    // let user = Meteor.users.findOne(uid)

    let obj = {
      userId: uid,
      // email: user.emails[0] || '',
      // fullname: user.profile.fullname || '',
      // moduleName: moduleName || '',
      profile: {
        trainingModules: moduleIds
      }
    }

    // upsertModuleUser.call(obj, (err, res) => {
    Meteor.call("TrainingModuleUsers.upsertModuleUser", obj, (err, res) => {
      if(err) {
        toastr.error("Something went wrong. Please try again. " + err)
      } else {
        Session.set('myTrainingModules', moduleIds)
        toastr.info("Successfully saved.")
      }
    })
  },
  'click .btn-send-notification'(e, tpl) {
    e.preventDefault()

    let isChecked = $(e.currentTarget).siblings('.chk-user-tr-module').is(':checked')

    if(isChecked) {
      let 
        uid = Session.get('manageTRModuleUid'),
        moduleName = $($(e.currentTarget).siblings('span.module-name')[0]).text() || '',
        _fullname = $(e.currentTarget).parent().data('name');

      let user = Meteor.users.findOne(uid)
      let fullname = user.profile.fullname || _fullname
      let email = user.emails[0].address || ''

      // console.log(uid, moduleName, user, fullname, email)

      let obj = {
        userId: uid,
        email: email,
        fullname: fullname,
        moduleName: moduleName
      }

      $(e.currentTarget).button("loading")

      sendTRModuleNotification.call(obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again. " + err)
        } else {
          toastr.success("Successfully sent out.")
          $(e.currentTarget).button("reset")
        }
      })

    } else {
      toastr.error("Please assign the module to the user first.")
    }

  }  
})

