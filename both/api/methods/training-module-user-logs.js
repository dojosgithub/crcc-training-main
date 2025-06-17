/**
 * Training Module User Logs methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleUserLogs } from '/both/api/collections/training-module-user-logs.js'

import { UserNotes } from '/both/api/collections/user-notes.js'

// export const insertSetting = new Method('insertSetting', function(log) {
//   return TrainingModuleLogs.insert(log, {validate: true})
// })

export const insertUserLog = new ValidatedMethod({
  name: 'TrainingModuleUserLogs.methods.insertUserLog',
  // validate: new SimpleSchema(TrainingModuleUserLogs.schema).validator(),
  validate: ()=>{},
  run(log) {
    // console.log(log)
    // if(log.uid && log.uid !== 'RhCKr4BuKdt3f3GTs') {
    if(log.uid && log.uid !== 'RhCKr4BuKdt3f3GTs') {
      if(Meteor.isServer) {
        check(log, Object)
      
        this.unblock()      
      
        let user = Meteor.user()

        if(user) {
          log.firstname = user.profile.firstname || '',
          log.lastname = user.profile.lastname || '',
          log.email = user.emails[0].address || ''
          log.client = user.profile.clientName || '',
          log.bu = user.profile.buName || '',
          log.role = user.profile.role || ''
        }

        log.ip = this.connection.clientAddress
        log.cAt = new Date

        let _ips = ['136.49.232.133', '70.112.208.4']
        // if(log.ip !== '136.62.61.170') {
        // if(log.ip !== '136.49.232.133') {
        if(!_ips.includes(log.ip)) {

          if(log.msg && log.msg.includes('SR:')) {
            if(process.env.NODE_ENV === "production") {
              Email.send({
                to: 'david.kim@craassessments.com',
                from: 'david.kim@craassessments.com',          
                subject: "[TR] Check Session Recorder",
                html: log.msg + " " + log.uid + " " + (log.error || '')
              });
            }
          }
          return TrainingModuleUserLogs.insert(log)
        }
      }
    }
  }
});

export const sendPrintScreenNoti = new ValidatedMethod({
  name: 'TrainingModuleUserLogs.methods.sendPrintScreenNoti',
  // validate: null,
  validate: ()=>{},
  run(email) {
    if(Meteor.isServer) { //-- This is critical to make this work
      if(process.env.NODE_ENV === "production") { 
          check(email, {
              to: String,
              from: String,
              subject: String,
              body: String
          });

          let noteObj = {
            userId: Meteor.userId(),
            author: null,
            comment: "Invalid action: print screen on training site",
            privacy: 2,
            createdAt: new Date
          }

          UserNotes.insert(noteObj)

          var to = email.to,
              from = email.from,
              subject = email.subject,
              body = email.body;

          // check([to, from, subject, text], [String]);

          // this.unblock();

          Email.send({
            to: to,
            from: from,          
            subject: subject,
            html: body
          });  
      }
    }
  }
});

