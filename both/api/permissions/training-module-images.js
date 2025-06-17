/**
 * File collection on Training Module image objects
 */
import { TrainingModuleImagesCFS } from '/both/api/collections/training-module-images.js'

if(___isOnAWS) {

TrainingModuleImagesCFS.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
  download: () => true  
})

}

// TrainingModuleImagesCFS.allow({
//   insert: function(userId, file) { return userId && file.metadata && file.metadata.owner === userId; },
//   update: function(userId, file, fields, modifier) {
//     return userId && file.metadata && file.metadata.owner === userId;
//   },
//   remove: function(userId, file) { return userId && file.metadata && file.metadata.owner === userId; }
// });
