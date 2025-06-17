/**
 * New-module form methods
 */
import {Meteor} from 'meteor/meteor';

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { check } from 'meteor/check'

import { Method } from '/imports/api/lib/method.js';

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingStatusSummary } from '/both/api/collections/training-status-summary.js'

import { SimUsersSummary } from '/both/api/collections/sim-users-summary.js';

export const insertModule = new ValidatedMethod({
  name: 'insertModule',
  // validate: new SimpleSchema(TrainingModules.schema).validator({clean: true, filter: true}), 
  validate: ()=>{}, 
  run(module) {
    check(module, Object)

    module.createdAt = new Date
    module.modifiedAt = new Date
    
    let newModuleId = TrainingModules.insert(module)
    if(newModuleId) {
      Meteor.users.update({ //-- Assign the new module to the system admins
        'profile.role': '1'
      }, {
        $addToSet: { 'profile.trainingModules': newModuleId}
      }, {multi: true})
    }

    return newModuleId
  }

})

export const updateModule = new ValidatedMethod({
  name: 'updateModule',  
  // validate: new SimpleSchema(TrainingModules.schema).validator(),
  validate: ()=>{},
  run(module) {
    check(module, Object)

    return TrainingModules.update(module._id, {
      $set: {
        name: module.name,
        description: module.description,
        progressOption: module.progressOption,
        order: module.order,
        modifiedAt: new Date
      }
    })
  }
})

export const updateModuleCoverImage = new ValidatedMethod({
  name: 'updateModuleCoverImage',
  // validate: new SimpleSchema(TrainingModules.schema).validator(),
  validate: ()=>{},
  run(module) {
    check(module, Object)

    return TrainingModules.update(module._id, {
      $set: {
        coverImage: module.coverImage,
        modifiedAt: new Date
      }
    })
  }
})

export const updateModuleDuration = new ValidatedMethod({
  name: 'updateModuleDuration',  
  // validate: new SimpleSchema(TrainingModules.schema).validator(),
  validate: ()=>{},
  run(module) {
    check(module, {
      _id: String,
      duration: String
    })

    return TrainingModules.update(module._id, {
      $set: {
        duration: module.duration
      }
    })
  }
})

export const activateModule = new ValidatedMethod({
  name: 'activateModule',  
  // validate: new SimpleSchema(TrainingModules.schema).validator(),
  validate: ()=>{},
  run(module) {
    check(module, Object)

    return TrainingModules.update(module._id, {
      $set: {
        status: 1,
        modifiedAt: new Date
      }
    })
  }
})

export const deactivateModule = new ValidatedMethod({
  name: 'deactivateModule',  
  // validate: new SimpleSchema(TrainingModules.schema).validator(),
  validate: ()=>{},
  run(module) {
    check(module, Object)

    return TrainingModules.update(module._id, {
      $set: {
        status: 2,
        modifiedAt: new Date
      }
    })
  }
})

export const canTakeThisModule = new Method('canTakeThisModule', function(obj) {

  try {
    check(obj, {
      // userId: String,
      userId: Match.Optional(Match.OneOf(undefined, null, String)),
      moduleId: String,
      moduleName: String
    });

    // console.log(module);

    if(Meteor.isServer && obj.userId) {

      let _tsses = TrainingStatusSummary.find({
        userId: obj.userId
      }).fetch();

      let 
        _modulesCanTake = [],
        _modulesToTake = null,
        _modulesCompleted = [],
        _midsSimsNotDone = [],
        _canTakeThisModule = false;

      if(_tsses && _tsses.length >0) {

          _tsses.forEach((t,i) => {
            if(t.trainingStatus === "Completed" || t.trainingStatus === "Started") {
              _modulesCanTake.push(t.moduleId);

              if(t.trainingStatus === "Completed") {
                _modulesCompleted.push(t.moduleId)
              }              
              else if(t.trainingStatus === "Started") {
                _modulesToTake = t.moduleId;
              }
            }
          })

          // console.log(_modulesToTake);
          // console.log(_modulesCompleted)

          // import { CoreDB } from '/both/startup/config/db-config.js';

          // let _sus = CoreDB.mongo.findOne('sim_users_summary', {
          let _sus = SimUsersSummary.findOne({
            userId: obj.userId,
            'trainingQuiz.moduleId': { $in: _modulesCompleted },
            simStatus: { $ne: 'Completed' }
          },{
            sort: {
              createdAt: 1
            },
            limit: 1,
            fields: {
              _id: 0,
              'trainingQuiz.moduleId': 1
            }
          });         

          // if(_sus && _sus.length > 0) {
          //   // console.log(_sus)
          //   _sus.forEach((s) => {
          //     if(s.trainingQuiz.moduleId) {
          //       _midsSimsNotDone.push(s.trainingQuiz.moduleId);
          //     }
          //   })
          // }
          if(_sus) { //-- if fus assinged but not completed exists, tr module for the fus should be the one to take 
            // console.log(_sus);
            // if(!_modulesToTake) {
              // if(_sus.trainingQuiz.moduleId) {
                // _modulesToTake = [_sus.trainingQuiz.moduleId];
                _modulesToTake = _sus.trainingQuiz.moduleId;
              // }
            // }
          }
          else { //-- if all sims assigned are completed, or, no sims assigned yet
            if(!_modulesToTake) { //-- if there's is no tr module the trainee started
              _modulesToTake = obj.moduleId; //-- this module should be the one to take
            }
          }

      } //-- if(_tsses && _tsses.length >0) {

      // _modulesToTake = _modulesToTake.filter(mid => !_midsSimsNotDone.includes(mid));

      // console.log(_modulesToTake)

      // if(_modulesToTake.length === 0 || _modulesToTake.includes(obj.moduleId)) {
      if(_modulesToTake === obj.moduleId || _modulesCanTake.includes(obj.moduleId)) {
          _canTakeThisModule = true
      }

      // console.log(_modulesCanTake, _modulesToTake, _canTakeThisModule)

      

      return _canTakeThisModule;
    }

  } catch(e) {
    // return ;
    console.log(e)
  }
  
});

if(Meteor.isServer) {
export const getTrainingModulesByClient = new ValidatedMethod({  
  name: 'TrainingModules.byClient',  
  validate: ()=>{},  
  run(obj) {
    check(obj, {
      clientId: String,
      buId: Match.Optional(Match.OneOf(undefined, null, String, Number))
    });
    this.unblock();

    let _matchQuery = {
      'profile.clientId': obj.clientId,
      'profile.role': '6',
      'profile.status': { $ne: 4 }
    }

    if(obj.buId) {
      _matchQuery['profile.buId'] = obj.buId
    }

    let pipelineUsers = [
      {
        $match: _matchQuery        
      },
      {
        $lookup: {
          from: 'training_module_user_stats',
          localField: '_id',
          foreignField: 'userId',
          as: 'tmus'
        }
      },
      {
        $unwind: '$tmus'
      },
      {
        $lookup: {
          from: 'training_modules',
          localField: 'tmus.moduleId',
          foreignField: '_id',
          as: 'tm'
        }
      },
      {
        $unwind: '$tm'
      },
      {
        $group: {
          _id: '$tm._id',
          moduleName: { $first: '$tm.name' },
          clientId: { $first: '$profile.clientId' },
          clientName: { $first: '$profile.clientName' },
          buId: { $first: '$profile.buId' },
          buName: { $first: '$profile.buName' }
        }
      },
      {
        $project: {
          _id: 0,
          moduleId: '$_id',
          moduleName: '$moduleName',
          clientId: '$clientId',
          clientName: '$clientName',
          buId: '$buId',
          buName: '$buName'
        }
      }
    ];

    let _result = Promise.await(Meteor.users.rawCollection().aggregate(pipelineUsers).toArray());

    // console.log(_result)

    return _result;

  }
})
}

