/**
 * Admin All Users Search template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { Clients } from '/both/api/collections/clients.js'
import { exportUsersSearchResult } from '/both/api/methods/admin-all-users-search.js'

import { AdminAllUsersSearch } from '/imports/ui/pages/admin/users/admin-all-users-search.html'
// import '/imports/ui/stylesheets/admin/users/admin-all-users-search.less'

let _selfAdminAllUsersSearch
let _subsAdminAllUsersSearch

Template.AdminAllUsersSearch.onCreated( function adminAllUsersSearchOnCreated() {

  _selfAdminAllUsersSearch = this

  _subsAdminAllUsersSearch = new SubsManager()

  _selfAdminAllUsersSearch.ready = new ReactiveVar()

  _selfAdminAllUsersSearch.autorun(() => {
    let handleClients = _subsAdminAllUsersSearch.subscribe('all_clients')
    _selfAdminAllUsersSearch.ready.set(handleClients.ready())
  })

})

Template.AdminAllUsersSearch.onRendered( function adminAllUsersSearchOnRendered() {
  $('.row-admin-all-users-search').show()
  // $('.row-admin-all-users-search').draggable().resizable()
})

Template.AdminAllUsersSearch.helpers({
  Clients: () => Clients.find()
})

Template.AdminAllUsersSearch.events({
  'click .btn-submit-search-options'(e, tpl) {
    e.preventDefault()

    $('.btn-submit-search-options').button('loading')

    let isClientChecked = $('.chk-li-client:checked')
    let isBUChecked = $('.chk-li-client-bu:checked')

    let _clients = [], _bus = []

    isClientChecked.each((i, c) => {
      // console.log(c, $(c).data('v'))
      _clients.push($(c).data('v'))
    })

    isBUChecked.each((i, b) => {
      // console.log(b, $(b).data('v'))
      _clients.push($(b).data('c'))
      _bus.push($(b).data('v'))
    })

    let clients = $.unique(_clients),
        bus = $.unique(_bus)    

    let initSelector = {
      'profile.role': {$ne: '1'},
      'profile.status': {$ne: 4},
    }

    if(clients.length > 0) {
      initSelector['profile.clientName'] = {$in: clients}      
    }      
      
    if(bus.length > 0) {
      initSelector['profile.buName'] = {$in: bus}      
    }

    Session.set('_selfAdminAllUsers.clientsToSearch', clients)
    Session.set('_selfAdminAllUsers.busToSearch', bus)
    Session.set('_selfAdminAllUsers.initSelector', initSelector)

    // console.log(Session.get('_selfAdminAllUsers.initSelector'))

    $('.btn-submit-search-options').button('reset')

  },
  'click .btn-export-search-results'(e, tpl) {
    e.preventDefault()
    
    $('.btn-export-search-results').button('loading')

    // let clients = Session.get('_selfAdminAllUsers.clientsToSearch')
    //   ? JSON.stringify(Session.get('_selfAdminAllUsers.clientsToSearch'))
    //   : null

    // let bus = Session.get('_selfAdminAllUsers.busToSearch')
    //   ? JSON.stringify(Session.get('_selfAdminAllUsers.busToSearch'))
    //   : null

    let queryObj = {
      init: Session.get('_selfAdminAllUsers.initSelector'),
      // clients: Session.get('_selfAdminAllUsers.clientsToSearch'),
      // bus: Session.get('_selfAdminAllUsers.busToSearch')
    }

    exportUsersSearchResult.call(queryObj, (err, res) => {
      // console.log(err, res)
      if(err) {
        toastr.error("Something went wrong. Please try again. " + err)
      } else {
        if(res) {
          // console.log(res)     
          if(res.err) {
            toastr.error("Something went wrong. Please try again. ")
          } else {
            let download = `
              Download: <a href="https://cdn-training.craassessments.com/${res.path}${res.filename}" download="${res.filename}" referrerpolicy="origin">${res.filename}</a>        
            `
            $('#search_result_export_container').html(download)
          }
        }
      }


      $('.btn-export-search-results').button('reset')
    })
  }
})
