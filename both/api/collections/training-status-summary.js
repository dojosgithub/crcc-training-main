/**
 * Training Status Summary collection
 */

// if(Meteor.isServer) {

import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema'

export const TrainingStatusSummary = new Mongo.Collection('training_status_summary')

