/**
 * Admin Module page Preview template
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Session } from 'meteor/session'

import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'

// import '/imports/ui/stylesheets/admin/modules/admin-module-page-preview.less'
import { AdminModulePagePreview } from '/imports/ui/pages/admin/modules/admin-module-page-preview.html'

import { countActiveModulePages } from '/both/api/methods/training-module-pages.js'

import '/imports/ui/pages/templates/comp-templates'
import '/imports/ui/pages/templates/page-templates'

Template.AdminModulePagePreview.onCreated(function adminModulePagePreviewOnCreated() {

})

Template.AdminModulePagePreview.helpers({
  Pages() {    
    return TrainingModulePages.find()
  },  
  Page() {

    let page = TrainingModulePages.find(Session.get("pageToPreview")).fetch()

    if(page && page.length > 0) {

      //-- The result data is an array and kind of tricky to deal with inside 
      //-- the template. This logic block will convert the array to an object, 
      //-- and will make the template data called easily in the template.  
      if(page[0].thisTemplate && page[0].thisTemplate[0] && page[0].thisTemplate[0]._id) {
        let myTemplate = {
          _id: page[0].thisTemplate[0]._id,
          systemName: page[0].thisTemplate[0].systemName //-- this one will be injected to the dynamic template
        }

        page[0].thisTemplate = myTemplate
      }
  // console.log('page2 => ', page)
      return page
    }
  },
  // compTemplate() {
  //   return 'CompTemplateTest'
  // },
  // pageTemplate() {
  //   return 'PageTemplateTest'
  // }  
})
