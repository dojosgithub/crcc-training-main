/**
 * File collection on Training Module Documents objects
 */
import { TrainingModuleDocumentsCFS } from '/both/api/collections/training-module-documents.js'

if(___isOnAWS) {

TrainingModuleDocumentsCFS.allow({
  insert: () => true,
  update: () => true,
  remove: () => true, 
  download: () => true
})	

}
