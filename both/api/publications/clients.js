if(Meteor.isServer) {
	
/**
 * Publication logic on Clients collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

import { Clients } from '/both/api/collections/clients.js'

Meteor.publish('all_clients', () => 
  Clients.find({
    status: {$ne: -1} //-- Exclude deleted videos
  })
)

}

