/**
 * Training Module Logs methods
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { Email } from 'meteor/email';

import { Method } from '/imports/api/lib/method.js'

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { TrainingModuleLogs } from '/both/api/collections/training-module-logs.js'

// export const insertSetting = new Method('insertSetting', function(log) {
//   return TrainingModuleLogs.insert(log, {validate: true})
// })

export const insertLog = new ValidatedMethod({
  name: 'TrainingModuleLogs.methods.insertLog',
  // validate: new SimpleSchema(TrainingModuleLogs.schema).validator(),
  validate: ()=>{},
  run: function(log) {
    
    if(log.uid !== 'RhCKr4BuKdt3f3GTs') {
      if(Meteor.isServer) {
        check(log, Object)
      
        this.unblock()      
               
        let user = Meteor.user()

        if(user) {
          log.firstname = user.profile.firstname || '',
          log.lastname = user.profile.lastname || '',
          log.email = user.emails[0].address || '',
          log.client = user.profile.clientName || '',
          log.bu = user.profile.buName || '',
          log.role = user.profile.role || ''
        } else {
          if(log.msg === 'Unauthorized login request') { //-- Upon Chris' request (esp. with Covance pilot user cases, 05/31/2019)
            if(process.env.NODE_ENV === "production") {

              let to = "help@craassessments.com";
              // let to = "david.qwk@gmail.com"
              // let from = "dqw.kim@gmail.com"
              let from = "CRA Assessments <admin@craassessments.com>"       
              let subject = "Training: Unauthorized login request"

  let body = `
  Username entered: ${log.uid}
  `

              let mailObj = {
                to: to,
                from: from,
                subject: subject,
                html: body
              }

              // console.log(mailObj)

              if(log.ip !== '136.49.232.133') {
                if(log.uid !== 'davidqwk3683') {
                  Email.send(mailObj)
                }
              }
              // Email.send({
              //   to: to,
              //   from: from,
              //   // replyTo: from,
              //   subject: subject,
              //   html: body
              // }); 

            }
          }
        }

        log.ip = this.connection.clientAddress
        // log.ip = this.connection.remoteAddress
        log.cAt = new Date

        let _ips = ['136.49.232.133', '70.112.208.4']

        // if(log.ip !== '136.62.61.170') {
        // if(log.ip !== '136.49.232.133') {
        if(!_ips.includes(log.ip)) {  
          return TrainingModuleLogs.insert(log)
        }
      }
    }
  }
})

