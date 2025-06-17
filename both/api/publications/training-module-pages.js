if(Meteor.isServer) {

/**
 * Publication logic on TrainingModulePages collection
 */
import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'
import { TrainingModuleTemplates } from '/both/api/collections/training-module-templates.js'

// Meteor.publish('all_module_pages_w_module_id', (moduleId) => {
Meteor.publish('all_module_pages_w_module_id', function(moduleId) {
  check(moduleId, String)

  // return TrainingModulePages.find({
  //   moduleId: moduleId,
  //   status: {$ne: 4}
  // }, {
  //   sort: {
  //     order: 1
  //   }
  // })

  // return TrainingModulePages.aggregate([
  // {
  //   $match: {
  //     moduleId: moduleId,
  //     status: {$ne: 4}
  //   }
  // },
  // {
  //   $lookup: {
  //     from: "training_module_templates",
  //       localField: "template",
  //       foreignField: "_id",
  //       as: "template"      
  //   }
  // }
  // ])

  // return ReactiveAggregate(this, TrainingModulePages,[
  // {
  //   $match: {
  //     moduleId: moduleId,
  //     status: {$ne: 4}
  //   }
  // },
  // {
  //   $lookup: {
  //     from: "training_module_templates",
  //       localField: "template",
  //       foreignField: "_id",
  //       as: "thisTemplate"      
  //   },
  //   $lookup: {
  //     from: "training_module_quizzes",
  //       localField: "template",
  //       foreignField: "_id",
  //       as: "thisTemplate"      
  //   },        
  // },
  // {
  //   $sort: {
  //     order: 1
  //   }
  // }  
  // ])

  return ReactiveAggregate(this, TrainingModulePages,[
  {
    $match: {
      moduleId: moduleId,
      status: {$ne: 4}
    }
  },
  {
    $lookup: {
      from: "training_module_templates",
        localField: "template",
        foreignField: "_id",
        as: "thisTemplate"      
    },
  },
  // // { $unwind: "$thisTemplate" },
  // {
  //   $lookup: {
  //     from: "training_module_quizzes",
  //       localField: "template",
  //       foreignField: "_id",
  //       as: "thisQuizTemplate"      
  //   },        
  // },
  // // { $unwind: "$thisQuizTemplate" },
  // {
  //   $lookup: {
  //     from: "training_module_surveys",
  //       localField: "template",
  //       foreignField: "_id",
  //       as: "thisSurveyTemplate"      
  //   },        
  // },  
  {
    $sort: {
      order: 1
    }
  }  
  ])

})

Meteor.publish('active_module_pages_w_module_id', function(moduleId) {
  check(moduleId, String)

  return ReactiveAggregate(this, TrainingModulePages,[
  {
    $match: {
      moduleId: moduleId,
      status: 1
    }
  },
  {
    $lookup: {
      from: "training_module_templates",
        localField: "template",
        foreignField: "_id",
        as: "thisTemplate"      
    }
  },
  {
    $sort: {
      order: 1
    }
  }
  ])
})

Meteor.publish('active_module_pages_w_module_id_count', (moduleId) => {
  check(moduleId, String)

  return TrainingModulePages.find({
    moduleId: moduleId,
    status: 1
  }).count()
})

Meteor.publish('active_module_pages_w_module_id_limit', (value) => {
  check(value, Object)

  return TrainingModulePages.find({
    moduleId: value.moduleId,
    status: 1
  }, {
    sort: {
      order: 1
    },
    limit: value.limit,
    skip: value.skip
  })
})

Meteor.publish('module_page_w_id', (pageId) => {
  check(pageId, String)

  return TrainingModulePages.find({
    _id: pageId,
    status: {$ne: 4}
  }, {
    sort: {
      order: 1
    }
  })
})

Meteor.publish("module_pages_n_modules_w_svid", function(surveyId) {
  check(surveyId, String)

  return ReactiveAggregate(this, TrainingModulePages,[
  {
    $match: {
      status: {$ne: 4},
      type: 'survey',
      surveyId: surveyId
    }
  },
  {
    $lookup: {
      from: "training_modules",
      localField: "moduleId",
      foreignField: "_id",
      as: "thisModule"
    }
  },
  {
    $sort: {
      createdAt: 1
    }
  }  
  ])
})

Meteor.publish("module_pages_n_modules_w_svids", function(surveyIds) {
  check(surveyIds, Array)

  return ReactiveAggregate(this, TrainingModulePages,[
  {
    $match: {
      status: {$ne: 4},
      type: 'survey',
      surveyId: {$in: surveyIds}
    }
  },
  {
    $lookup: {
      from: "training_modules",
      localField: "moduleId",
      foreignField: "_id",
      as: "thisModule"
    }
  },
  {
    $sort: {
      createdAt: 1
    }
  }  
  ])

})

}
