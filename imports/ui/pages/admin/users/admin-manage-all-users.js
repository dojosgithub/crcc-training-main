/**
 * Admin Manage All Users template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Users } from '/both/api/collections/users.js'

import { getAllAppUsers, getAllUsers, getActiveUsersWSummary, getAllClients } from '/both/api/methods/admin-all-users.js'

// import '/imports/ui/stylesheets/admin/users/admin-manage-all-users.less'
import { AdminManageAllUsers } from '/imports/ui/pages/admin/users/admin-manage-all-users.html'

let _selfAdminManageAllUsers

Template.AdminManageAllUsers.onCreated(function adminManageAllUsersOnCreated() {
  _selfAdminManageAllUsers = this
})

Template.AdminManageAllUsers.onRendered(function adminManageAllUsersOnRendered() {
})

Template.AdminManageAllUsers.helpers({
})

Template.AdminManageAllUsers.events({
  'click .btn-sync-all-users'(e, tpl) {
    e.preventDefault()

    $('.progress .progress-bar-all-users').addClass('active')

    let i = 0
    _selfAdminManageAllUsers.allUsersProgressBarInterval = setInterval(() => {
      if(i < 90){
        i = i + 1;
        $(".progress-bar-all-users").css("width", i + "%").text(i + " %");
      }      
    }, 100)

    // getAllUsers({}, (err, res) => {
    getActiveUsersWSummary({}, (err, res) => {
      
      if(err) {
        toastr.error('Something went wrong. Please try again. ' + err)
      }
      else {
        if(res) {
          // console.log(res)
          $(".progress-bar-all-users").css("width", "100%").text( "100%")
          clearInterval(_selfAdminManageAllUsers.allUsersProgressBarInterval)
          // $('.progress').fadeOut('slow')          

          $('.users-added-container').show().find('#num_users_added').html(res.data.length)

          if(res.data && res.data.length > 0) {
            let users = ''
            let usersLength = res.data.length
            let i = 0
            res.data.forEach(function(u) {
              let sep = i < usersLength-1 ? ', ' : ''
              users += u.profile.fullname + sep
              i++
            })

            $('#user_names').html(users)
          }
        }
      }

      $('.progress .progress-bar-all-users').removeClass('active')
    })
  },
  'click .btn-sync-clients'(e, tpl) {
    e.preventDefault()

    $('.progress .progress-bar-clients').addClass('active')

    let i = 0
    _selfAdminManageAllUsers.clientsProgressBarInterval = setInterval(() => {
      if(i < 90){
        i = i + 1;
        $(".progress-bar-clients").css("width", i + "%").text(i + " %");
      }      
    }, 50)

    // getAllUsers({}, (err, res) => {
    getAllClients({}, (err, res) => {
      
      if(err) {
        toastr.error('Something went wrong. Please try again. ' + err)
      }
      else {
        if(res) {
          // console.log(res)
          $(".progress-bar-clients").css("width", "100%").text( "100%")
          clearInterval(_selfAdminManageAllUsers.clientsProgressBarInterval)

          $('.clients-added-container').show().find('#num_clients_added').html(res.data)

          // if(res.length > 0) {
          //   let clients = ''
          //   let clientsLength = res.length
          //   let i = 0
          //   res.forEach(function(u) {
          //     let sep = i < clientsLength-1 ? ', ' : ''
          //     clients += u.profile.fullname + sep
          //     i++
          //   })

          //   $('#client_names').html(clients)
          // }
        }
      }

      $('.progress .progress-bar-clients').removeClass('active')
    })
  },  
})
