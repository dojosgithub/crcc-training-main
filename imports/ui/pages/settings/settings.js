/**
 * Settings logic
 */

import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'
import { Session } from 'meteor/session'

import { TrainingModuleSettings } from '/both/api/collections/training-module-settings.js'
import { updateSettings } from '/both/api/methods/training-module-settings.js'

// import '/imports/ui/stylesheets/settings/settings.less'
import { Settings } from '/imports/ui/pages/settings/settings.html'

let _selfSettings

Template.Settings.onCreated(function settingsOnCreated() {

  _selfSettings = this

  _selfSettings.mySettings = new ReactiveVar()

  let mySettingsInit = localStorage.getItem('mstgs')
  let mySettings

  if(mySettingsInit) {
    mySettings = JSON.parse(mySettingsInit)
    _selfSettings.mySettings.set(mySettings)
  }

})

Template.Settings.helpers({
  mySettings() {    
    // return TrainingModuleSettings.find().fetch()[0]
    // console.log(_selfSettings.mySettings.get())
    return _selfSettings.mySettings.get()
  },
  selectedTheme() {
    let curTheme = _selfSettings.mySettings.curValue.moduleTheme
    console.log(this)
  }
})

Template.Settings.events({
  'change .chkb-video-autoplay'(e, tpl) {
    e.preventDefault()

    let autoplay = $(e.currentTarget).is(':checked')
    // let _id = $(e.currentTarget).data('_id')
    let _id = _selfSettings.mySettings.curValue._id

    let uid = Meteor.userId()

    if(uid) {

      let obj = {
        _id: _id,
        _set: {
          videoAutoplay: autoplay
        }        
      }

      updateSettings.call(obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          
          if(res) {
            _selfSettings.mySettings.set(res)
            localStorage.setItem('mstgs', JSON.stringify(res))

            toastr.info("Successfully updated.")
          }
        }        
      })
    }
  },
  'click .btn-select-video-alignment'(e, tpl) {
    e.preventDefault()

    let _id = _selfSettings.mySettings.curValue._id
    let alignment = $(e.currentTarget).data('alignment')

    if(_id && alignment !== '') {

      let obj = {
        _id: _id,
        _set: {
          videoAlignment: alignment
        }        
      }

      if(alignment !== 'left') {
        alert("Not supported at this time.");
      }
      /*
      updateSettings.call(obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. Please try again." + err)
        } else {
          // console.log(res)
          if(res) {
            _selfSettings.mySettings.set(res)
            localStorage.setItem('mstgs', JSON.stringify(res))

            toastr.info("Successfully updated.")

            location.reload()
          }
        }        
      }) 
      */


    }
  }
})
