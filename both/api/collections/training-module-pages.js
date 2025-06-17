/**
 * Training Module Pages collection
 */
import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

// import { SimpleSchema } from 'meteor/aldeed:simple-schema'

// const SimpleSchema = require('simpl-schema') //-- not working

import SimpleSchema from 'simpl-schema' //-- this is from Npm version of simpl-schema

export const TrainingModulePages = new Mongo.Collection('training_module_pages')

const defaultValue = value => function autoValue() {
  if (!this.isUpdate && !this.isUpsert && !this.isSet) {
    return value;
  }
}

TrainingModulePages.creatorSchema = new SimpleSchema({
  fullname: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    optional: true
  }
})

TrainingModulePages.videoSchema = new SimpleSchema({
  videoId: {
    type: String,
    optional: true
  },
  videoSVid: {
    type: String,
    optional: true
  },  
  videoSrc: {
    type: String,
    optional: true
  },
  videoDuration: {
    type: Number,
    optional: true    
  }
})

TrainingModulePages.audioSchema = new SimpleSchema({
  audioId: {
    type: String,
    optional: true
  },
  audioName: {
    type: String,
    optional: true
  },
  audioDuration: {
    type: Number,
    optional: true    
  }  
})

// TrainingModulePages.quizSchema = new SimpleSchema({
//   quizId: {
//     type: String,
//     optional: true
//   },
//   quizType: {
//     type: String,
//     optional: true
//   }
// })

// TrainingModulePages.surveySchema = new SimpleSchema({
//   surveyId: {
//     type: String,
//     optional: true
//   },
//   surveyType: {
//     type: String,
//     optional: true
//   }
// })

TrainingModulePages.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true
  },
  moduleId: {
    type: String,
    optional: true
  },
  title: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    optional: true
  },
  video: {
    type: TrainingModulePages.videoSchema,
    optional: true
  },  
  audio: {
    type: TrainingModulePages.audioSchema,
    optional: true
  },
  template: {
    type: String,
    optional: true
  },
  quizId: {
    type: String,
    optional: true,
  },
  quizType: {
    type: Number,
    optional: true,
    defaultValue: 1
  },
  quizShowScoreFeedback: {
    type: Boolean,
    optional: true,
    defaultValue: false
  },
  surveyId: {
    type: String,
    optional: true
  },  
  instructions: {
    type: String,
    optional: true
  }, 
  transcript: {
    type: String,
    optional: true
  },      
  order: {
    type: Number,
    optional: true
  },
  status: {
    type: Number,
    optional: true,
    autoValue: defaultValue(2)
  },
  creator: {
    type: TrainingModulePages.creatorSchema,
    optional: true
  },
  duration: {
    type: Number,
    optional: true    
  },
  durationHMS: {
    type: String,
    optional: true    
  },  
  createdAt: {
    type: Date,
    optional: true,
    defaultValue: new Date()    
  },
  modifiedAt: {
    type: Date,
    optional: true,
    defaultValue: new Date()    
  },  
})

// TrainingModulePages.attachSchema(TrainingModulePages.schema)

