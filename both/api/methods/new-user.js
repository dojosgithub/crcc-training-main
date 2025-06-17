/**
 * New User methods
 */
import { Meteor } from 'meteor/meteor'

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

import { ValidatedMethod } from 'meteor/mdg:validated-method'

import { Accounts } from 'meteor/accounts-base'

import '/both/api/collections/users.js'

export const insertUser = new ValidatedMethod({
  // name: 'users.methods.insert',
  name: 'insertUser',
  // validate: new SimpleSchema(MySchema.User).validator(), 
  validate: ()=>{}, 
  // validate: () => {},  
  run(user) {
    
    user.createdAt  = new Date()
    user.modifiedAt = new Date()

    // return Meteor.users.insert(user)

    return Accounts.createUser(user)

  }
}) 

export const getUsersByClient = new ValidatedMethod({  
  name: 'Users.byClient',  
  validate: ()=>{},  
  run(obj) {
    check(obj, {
      clientId: String,
      buId: Match.Optional(Match.OneOf(undefined, null, String, Number))
    });
    this.unblock();

    let _query = {
      'profile.clientId': obj.clientId,
      'profile.role': '6',
      'profile.status': 1
    }

    if(obj.buId) {
      _query['profile.buId'] = obj.buId
    }

    let _users = Meteor.users.find(_query).fetch();

    return _users;

  }
})




