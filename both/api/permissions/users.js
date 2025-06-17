/**
 * Permissions on Meteor.users collection
 */

import { Meteor } from 'meteor/meteor'

//- Permissions to do CRUD on 'users' collection 
// Meteor.users.allow({
//     insert(userId, doc) {
//         return userId;
//     },
//     update(userId, doc, fieldNames, modifier) {
//       return userId;
//     },    
//     remove(userId, doc) {
//       return userId;
//     }   
// })

//-- Or, deny all client-side updates
// Meteor.users.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; },
// });

Meteor.users.deny({
    insert(userId, doc) {
        return userId;
    },
    update(userId, doc, fieldNames, modifier) {
      return userId;
    },    
    remove(userId, doc) {
      return userId;
    }   
})
