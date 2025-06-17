import { Session } from 'meteor/session'

import { usersOnline, usersProfileOnlineUpdate } from '/both/api/methods/admin-all-users.js'

import './admin-main.html'

Template.AdminMain.onCreated(function adminMainOnCreated() {

  // Tracker.autorun(() => {
  //   usersOnline.call({}, (err, res) => {
  //     // console.log(err, res)
  //     if(err) {
  //     } else {     
  //       Session.set('UsersOnline', res.data)
  //     }
  //   })    
  // })

})

Template.AdminMain.helpers({
  // UsersOnline() {
  //   if(Session.get("UsersOnline")) {
  //     return Session.get("UsersOnline")
  //   }
  // },
  UsersOnline() {
    let users = Meteor.users.find({
      _id: {$ne: Meteor.userId()},
      'profile.role': {$ne: '1'},
      'profile.online': true,
      "profile.status": 1,  
      // heartbeat: {$exists: true}
    }, {
      sort: {
        'profile.role': 1
      }
    }).fetch()

    let 
      oUsers = [],
      roleNames = [null, null, null, null, 'CA', 'CS', 'A', 'S']

    if(users && users.length > 0) {
      users.forEach(u => {
        if(!u.heartbeat) {          
          // Meteor.users.update(u._id, {
          //   $set: {'profile.online': false}
          // })
          usersProfileOnlineUpdate.call({
            uid: u._id,
            status: false
          });         
        } else {
          if(u && u.profile && u.profile.fullname) {
            let myRole = parseInt(u.profile.role)

            let uObj = {
              fullname: u.profile.fullname,
              role: myRole,
              roleName: roleNames[myRole],
              lastBeat: u.heartbeat,
              idle: u.profile.idle,
              client: u.profile.clientName || ''
            }
         
            oUsers.push(uObj)
          }
        }
      })

      return oUsers
    } else {
      return 0
    }
  },

})

Template.AdminMain.onDestroyed(() => {
  Session.set('UsersOnline', null)
})
