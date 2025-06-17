// if(Meteor.isServer) {
  // import { CoreDB } from '/both/startup/config/db-config.js'

  import { Meteor } from 'meteor/meteor'
  import { Mongo } from 'meteor/mongo'
  
  export const UserNotes = new Mongo.Collection("user_notes")
// }
