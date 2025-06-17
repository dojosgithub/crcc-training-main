/**
 * File collection on Training Module Audio objects
 */
import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'

if(___isOnAWS) {

TrainingModuleAudiosCFS.allow({
  insert: () => true,
  update: () => true,
  remove: () => true, 
  download: () => true
})	

}

// TrainingModuleAudiosCFS.allow({
//   insert: function(userId, file) { return userId && file.metadata && file.metadata.owner === userId; },
//   update: function(userId, file, fields, modifier) {
//     return userId && file.metadata && file.metadata.owner === userId;
//   },
//   remove: function(userId, file) { return userId && file.metadata && file.metadata.owner === userId; }
// });
