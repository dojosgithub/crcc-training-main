/**
 * TrainingModuleScores collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

export const TrainingModuleScoreSummary = new Mongo.Collection('training_module_score_summary')



