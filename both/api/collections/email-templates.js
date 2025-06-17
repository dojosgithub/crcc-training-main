import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const EmailTemplates = new Mongo.Collection("email_templates");
