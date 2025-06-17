/**
 * TR Module Users form methods
 */
import {Meteor} from 'meteor/meteor';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { check } from 'meteor/check'

// import Email from 'meteor/tarang:email-ses'
import { Email } from 'meteor/email';

import { TrainingModuleUsers } from '/both/api/collections/training-module-users.js'
import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js'

import { SimUsersSummary } from '/both/api/collections/sim-users-summary.js'

export const upsertModuleUser = new ValidatedMethod({
  name: 'TrainingModuleUsers.methods.upsertModuleUser',  
  // validate: new SimpleSchema(TrainingModuleUsers.schema).validator(),
  // validate: null,
  validate: ()=>{},
  run(obj) {
    check(obj, Object)
// console.log(obj)
    Meteor.users.update(obj.userId, {
      $set: {
        'profile.trainingModules': obj.profile.trainingModules,
        // trainingModules: obj.trainingModules,
        modifiedAt: new Date
      }
    }, (err, res) => {
      if(err) { return 0 }
      else {

        if(obj.profile.trainingModules.length > 0) {

          let _trStatusSummary = TrainingStatusSummary.find({
            userId: obj.userId
          }).fetch();

          if(_trStatusSummary && _trStatusSummary.length > 0) {
            _trStatusSummary.forEach((t) => {
              if(obj.profile.trainingModules.includes(t.moduleId)) {
                t.checked = true;
              } else {
                t.checked = false;
              }
            })
          } else {

            let _sus = SimUsersSummary.findOne({
                userId: obj.userId,
                status: { $ne: 'Deleted' },
                simulationName: { $regex: /^Baseline/ }
            });

            obj.profile.trainingModules.forEach((m) => {

              TrainingStatusSummary.update({
                  userId: obj.userId,
                  moduleId: m,
              }, {
                  $setOnInsert: {
                      clientId: obj.profile.client_id,
                      buId: obj.profile.bu_id,
                      simulationId: _sus.simulation_id || 0,
                      trainingStatus: 'Assigned',
                      progress: {
                          curPage: 0,
                          percent: 0,
                          pages: 0,
                          totalPages: 0                                                            
                      },
                      timer: {
                          duration: null,
                          pause: null
                      },
                      simAssigned: 0,
                      score: {
                          correct: 0,
                          total: 0,
                          percent: 0
                      },
                      createdAt: new Date,
                      assignedAt: new Date
                  },
                  $set: {
                      status: 1,
                      checked: true,
                      modifiedAt: new Date    
                  }                                                    
              }, 
              {
                  upsert: true
              });

            })
          }

        }

        // if(Meteor.isServer) {
        //   let emailAddress = obj.email.address

        //   // if(process.env.NODE_ENV === "production") {  


        //       // let to = emailAddress
        //       let to = "david.qwk@gmail.com"
        //       let from = "dqw.kim@gmail.com"
        //       let subject = "CRAA Training Module is ready for you."
        //       let body = "Hello " + obj.fullname + ",<br><br>"
        //           body += 'Your training module has been set up and ready. Please visit CRAA Training Site and complete the module.'
        //           body += "<br><br>"
        //           body += "Your Training Module: <b>" + obj.moduleName + "</b>"
        //           body += "<br><br>"
        //           body += "CRAA Training Site: <a href='https://training.craassessments.com/' target='_blank'>https://training.craassessments.com</a>"
        //           body += "<br><br>"
        //           body += "If you have any questions, please contact us at <a href='mailto:info@craassessments.com' target='_top'>info@craassessments.com</a>"
        //           body += "<br><br>Regards,<br>CRA Assessments Team"

        //       // check([to, from, subject, text], [String]);

        //       this.unblock();

        //       Email.send({
        //         to: to,
        //         from: from,
        //         // replyTo: from,
        //         subject: subject,
        //         html: body
        //       });  
        //   // } 
        // }

        return res
      }     
    })
  }
})

if(Meteor.isServer) {
Meteor.methods({
  'TrainingModuleUsers.upsertModuleUser'(obj) {
      check(obj, Object)
  // console.log(obj)
      Meteor.users.update(obj.userId, {
        $set: {
          'profile.trainingModules': obj.profile.trainingModules,
          // trainingModules: obj.trainingModules,
          modifiedAt: new Date
        }
      }, (err, res) => {
        if(err) { return 0 }
        else {

          let _checked = false;

          TrainingStatusSummary.update({
            userId: obj.userId
          }, {
            $set: {
              checked: _checked
            }
          }, {
            multi: true
          });
// console.log(obj.profile.trainingModules)
          if(obj.profile.trainingModules.length > 0) {

            // let _trStatusSummary = TrainingStatusSummary.find({
            //   userId: obj.userId
            // }).fetch();

            let _sus = SimUsersSummary.findOne({
                userId: obj.userId,
                status: { $ne: 'Deleted' },
                $or: [
                  { simulationName: { $regex: /^Baseline/ } },
                  { simulationName: { $regex: /^Prehire/ } }
                ]                
            });      
// console.log("SUS => ", obj, _sus);
            if(_sus) {
              obj.profile.trainingModules.forEach((m) => {

                // if(Meteor.isServer) {
                  TrainingStatusSummary.update({
                      userId: obj.userId,
                      moduleId: m,
                  }, {
                      $setOnInsert: {
                          clientId: _sus.clientId,
                          buId: _sus.buId,
                          simulationId: _sus.simulationId || 0,
                          trainingStatus: 'Assigned',
                          progress: {
                              curPage: 0,
                              percent: 0,
                              pages: 0,
                              totalPages: 0                                                            
                          },
                          timer: {
                              duration: null,
                              pause: null
                          },
                          simAssigned: 0,
                          score: {
                              correct: 0,
                              total: 0,
                              percent: 0
                          },
                          createdAt: new Date
                      },
                      $set: {
                          status: 1,
                          checked: true,
                          modifiedAt: new Date,
                          assignedAt: new Date   
                      }                                                    
                  }, 
                  {
                      upsert: true
                  });

                // }
               
              }) //-- obj.profile.trainingModules.forEach((m) => {

              } //-- if(_sus) {

          } //-- if(obj.profile.trainingModules.length > 0) {

          return res
        }     
      })
    }
})  

}

export const sendTRModuleNotification = new ValidatedMethod({
  name: 'TrainingModuleUsers.methods.sendTRModuleNotification',  
  // validate: null,
  validate: ()=>{},
  run(obj) {
    check(obj, Object)

    if(Meteor.isServer) {

      try {
        let emailAddress = obj.email

        if(process.env.NODE_ENV === "production") {  

            let to = emailAddress
            // let to = "david.qwk@gmail.com"
            // let from = "dqw.kim@gmail.com"
            let from = "CRA Assessments <admin@craassessments.com>"       
            let subject = "Training Module Assigned."

let body = `
Hello ${obj.fullname},
<br><br>
You have been assigned a training module administered by CRA Assessments.
<br><br><br>
Training Module: <b>${obj.moduleName}</b>
<br><br><br>
Please navigate to <a href="https://training.craassessments.com" target="_blank">https://training.craassessments.com</a> 
and signin using the same username and password you created for the simulation website.
<br><br>
Remember to use the CHROME browser when using this website.  If CHROME is not your default browser, please copy/paste the above link into the CHROME address bar.
<br><br>
If you have any questions or comments, please contact us at 
<br>
<a href='mailto:help@craassessments.com' target='_top'>help@craassessments.com</a>
<br><br><br>
Regards,
<br><br>
CRA Assessments 
`
            this.unblock();

            Email.send({
              to: to,
              from: from,
              // replyTo: from,
              subject: subject,
              html: body
            });  

            return 1
        } 
      } catch (e) {
        return 0
      }
    }
  }
})

// export const upsertModuleUser = new ValidatedMethod({
//   name: 'TrainingModuleUsers.methods.upsertModuleUser',  
//   validate: new SimpleSchema(TrainingModuleUsers.schema).validator(),
//   run(obj) {
//     check(obj, Object)

//     return TrainingModuleUsers.upsert({
//       userId: obj.userId,
//       moduleId: obj.moduleId
//     }, {
//       $setOnInsert: {
//         createdAt: new Date
//       },
//       $set: {
//         status: obj.status,
//         modifiedAt: new Date
//       }
//     })
//   }
// })

