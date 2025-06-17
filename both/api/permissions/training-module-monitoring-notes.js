/**
 * File collection on Training Module MonitoringNotes objects
 */
import { TrainingModuleMonitoringNotes } from '/both/api/collections/training-module-monitoring-notes.js'

if(___isOnAWS) {

TrainingModuleMonitoringNotes.allow({
  insert: () => true,
  update: () => true,
  remove: () => true  
})	

}
