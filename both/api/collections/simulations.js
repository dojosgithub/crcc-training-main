// if(Meteor.isServer) {
  // import { CoreDB } from '/both/startup/config/db-config.js'

import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

 export const Simulations = new Mongo.Collection("simulations");

// }
