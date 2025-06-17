/**
 * Clients collection
 */
 // if(Meteor.isServer) {

	import { Meteor } from 'meteor/meteor'
	import { Mongo } from 'meteor/mongo'

	// import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

	export const Clients = new Mongo.Collection('clients')

// }


