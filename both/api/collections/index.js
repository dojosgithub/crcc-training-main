//-- Import collections (server-side)

import './users.js'
import './training-modules.js'
import './training-module-pages.js'
import './training-module-images.js'
import './training-module-videos.js'
import './training-module-audios.js'
import './training-module-documents.js'
import './training-module-templates.js'
import './training-module-settings.js'
import './training-module-logs.js'
import './training-module-user-logs.js'
import './training-module-user-stats.js'
import './training-module-quizzes.js'
import './training-module-questions.js'
import './training-module-answers.js'
import './training-module-scores.js'
import './training-module-score-summary.js'
import './training-module-surveys.js'
import './training-module-survey-questions.js'
import './training-module-survey-answers.js'
import './training-module-survey-data.js'
import './training-module-users.js'
import './clients.js'
// import './training-module-user-quizzes.js'

import './sim-users-summary.js' //-- this is a remote collection SimUsersSummary
import './user-notes.js' //-- this is a remote collection UserNotes

import './training-status-summary.js';

import './training-module-monitoring-notes.js';

// import './hooks.js'

//   import { SimUsersSummary } from './sim-users-summary.js'
// This observeChanges works, general hooks not working
// var observer = SimUsersSummary.find({}).observeChanges({
//     added: function(id, message) {
//       console.log("added", id, message)
//     },
//     changed: function (id, fields) {
//     console.log("after", id, fields);
//     },
//     removed: function() {
//       console.log('removed')
//     }
// });

import './training-timer-log.js';
