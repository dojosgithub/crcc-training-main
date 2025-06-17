/**
 * Admin Module Builder template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import { Util } from '/imports/api/lib/util.js'

import { TrainingModules } from '/both/api/collections/training-modules.js'
import { TrainingModulePages } from '/both/api/collections/training-module-pages.js'

import { AdminModulePageEdit } from '/imports/ui/pages/admin/modules/admin-module-page-edit.js'
import { AdminModulePagePreview } from '/imports/ui/pages/admin/modules/admin-module-page-preview.js'

// import { insertModulePage, activateModulePage, 
//   deactivateModulePage, deleteModulePage, updateModulePageOrder } from '/imports/api/methods/training-module-pages.js'

import { updateModuleDuration } from '/both/api/methods/training-modules.js'
import { insertModulePage, updateModulePageStatus, updateModulePageOrder } from '/both/api/methods/training-module-pages.js'

import Sortable from 'sortablejs';

// import '/imports/ui/stylesheets/admin/modules/admin-module-builder.less'
import { AdminModuleBuilder } from '/imports/ui/pages/admin/modules/admin-module-builder.html'

let _selfAdminModuleBuilder
let _subsAdminModuleBuilder

Template.AdminModuleBuilder.onCreated(function adminModuleBuilderOnCreated() {

  _selfAdminModuleBuilder = this

  _subsAdminModuleBuilder = new SubsManager()

  _selfAdminModuleBuilder.ready4Module = new ReactiveVar()
  _selfAdminModuleBuilder.ready4Pages = new ReactiveVar()

  _selfAdminModuleBuilder.autorun(() => {

    if(Session.get("moduleIdToBuild")) {
      let handleModule = _subsAdminModuleBuilder.subscribe('training_module_w_id', Session.get("moduleIdToBuild"))
      _selfAdminModuleBuilder.ready4Module.set(handleModule.ready())

      let handlePages = _subsAdminModuleBuilder.subscribe('all_module_pages_w_module_id', Session.get("moduleIdToBuild"))
      _selfAdminModuleBuilder.ready4Pages.set(handlePages.ready())
    }

  })
})

Template.AdminModuleBuilder.onRendered(function adminModuleBuilderOnRendered() {

  $('.row-admin-module-page-edit').hide()
  $('.row-admin-module-page-preview').hide()

  let el = document.getElementById('ul_admin_module_builder_pages');
  sortable = new Sortable(el, {
    // sort: true,
    onEnd: function (e) {
      e.oldIndex;  // element's old index within parent
      e.newIndex;  // element's new index within parent

      // $('#ul_admin_module_builder_pages').children('li').each(function(idx, el) {
      $(el).children('li').each(function(idx, el) {
        let pid = $(this).data('pid')
        
        // console.log(pid, idx)

        let objPage = {
          _id: pid,
          order: idx
        }
        //-- Local update not working...
        // TrainingModulePages.update(pid, {
        //   $set: {
        //     order: idx
        //   }
        // })

        updateModulePageOrder.call(objPage)

      })

    },
  })
})

Template.AdminModuleBuilder.helpers({
  Pages() {
 
    // if(_selfAdminModuleBuilder.ready4Pages.get()) { //-- Not working!      
      // return TrainingModulePages.find() 
      let pages = TrainingModulePages.find()

      if(pages && pages.fetch() && pages.fetch().length > 0) {
        // console.log(pages.fetch())
        let duration = 0
        let activePages = 0, allPages = 0

        pages.fetch().forEach((p) => {
          allPages++
          if(p.status === 1) {
            
            activePages += 1

            if(p.duration > 0) {
              duration += p.duration
            }
          }
        })
          
        // let dur = Util.secondsToHMSRaw(duration) || 'n/a'
        let dur = Util.secondsToHMS(duration) || 'n/a'
        let totalText = `<span>Total: ${activePages}/${allPages} [${dur}]`
        $('#all_page_stats').html(totalText)

        if(Session.get("moduleIdToBuild") && dur !== 'n/a') {
          let mObj = {
            _id: Session.get("moduleIdToBuild"),
            duration: dur
          }
          updateModuleDuration.call(mObj)
        }

        return pages
      }
    // }
  }
})

Template.AdminModuleBuilder.events({
  'click .btn-close-admin-module-builder'(e, tpl) {
    e.preventDefault()

    Session.set('moduleIdToBuild', null)
    _subsAdminModuleBuilder.clear()

    $('.row-admin-module-builder').hide()

    Session.set("pageToBuild", null)    
    $('.row-admin-module-page-edit').hide() 

    Session.set("pageToPreview", null)    
    $('.row-admin-module-page-preview').hide()        
  },
  // 'click .btn-add-new-page'(e, tpl) {
  //   e.preventDefault()

  //   // $('.new-module-page-form-container').show()
  // },
  'click .btn-submit-module-new-page'(e, tpl) {
    e.preventDefault()

    let pageTitle = $('#input_page_title').val()
    let pageType = $('#sel_page_type').val()
    let pageDesc = $('#txta_page_desc').val()

    let canGo = true

    if(pageTitle === '') {
      toastr.warning("Page title cannot be null.")
      canGo = false
    }

    if(pageType === '-1') {
      toastr.warning("Plase select a page type.")
      canGo = false
    }

    if(canGo) {

      let allPages = $('#ul_admin_module_builder_pages li.li-admin-module-builder-page')
      let numAllPages = allPages.length

      let objPage = {
        moduleId: Session.get('moduleIdToBuild'),
        title: pageTitle,
        type: pageType,
        description: pageDesc,
        order: numAllPages, //-- Order is kind of index from 0, so, no need to add +1
        creator: {
          fullname: Meteor.user().profile.fullname,
          userId: Meteor.userId()
        }      
      }

      insertModulePage.call(objPage, function(err, res) {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully added.")

          // let order = sortable.toArray()
          // sortable.sort(order)
          // Template.AdminModuleBuilder.__helpers.get('Pages').call()
        }
      })
    }
  },  
  'click .btn-edit-module-page'(e, tpl) {
    e.preventDefault()

    let moduleId = $(e.currentTarget).parent().data('mid')
    let pageId = $(e.currentTarget).parent().data('pid')

    Session.set("pageToBuild", pageId)

    // console.log(moduleId, pageId);

    $('.row-admin-module-page-preview').hide();
    $('.row-admin-module-page-edit').show();
  },
  'click .btn-preview-module-page'(e, tpl) {
    e.preventDefault()

    let moduleId = $(e.currentTarget).parent().data('mid')
    let pageId = $(e.currentTarget).parent().data('pid')

    Session.set("pageToPreview", pageId)

    $('.row-admin-module-page-edit').hide();
    $('.row-admin-module-page-preview').show();
  },
  // 'click .btn-activate-module-page'(e, tpl) {
  //   e.preventDefault()

  //   let moduleId = $(e.currentTarget).parent().data('mid')
  //   let pageId = $(e.currentTarget).parent().data('pid')    

  //   //-- Client-side update not working with error:
  //   //-- update failed: Access denied. Operator $setOnInsert not 
  //   //-- allowed in a restricted collection.
  //   // TrainingModulePages.update(pageId, {
  //   //   $set: { status: 1 }
  //   // })
  //   // TrainingModulePages.update({_id: pageId}, {
  //   //   $set: { status: 1 }
  //   // })

  //   if(confirm("Are you sure to activate this page?")) {
  //     activateModulePage.call({_id: pageId}, (err, res) => {
  //         if(err) {
  //           toastr.error("Something went wrong. " + err)
  //         } else {
  //           toastr.info("Successfully activated.")
  //         }      
  //     })
  //   }
  // },
  // 'click .btn-deactivate-module-page'(e, tpl) {
  //   e.preventDefault()

  //   let moduleId = $(e.currentTarget).parent().data('mid')
  //   let pageId = $(e.currentTarget).parent().data('pid')    

  //   // TrainingModulePages.update(pageId, {
  //   //   $set: { status: 2 }
  //   // })
  //   if(confirm("Are you sure to deactivate this page?")) {
  //     deactivateModulePage.call({_id: pageId}, (err, res) => {
  //         if(err) {
  //           toastr.error("Something went wrong. " + err)
  //         } else {
  //           toastr.info("Successfully deactivated.")
  //         }      
  //     }) 
  //   }
  // },
  'click .btn-update-module-page-status'(e, tpl) {
    e.preventDefault()

    let status = parseInt($(e.currentTarget).data('status'))

    if(status === 4) {
      if(confirm("Are you sure to remove this page?")) {} else {return}
    }

    let moduleId = $(e.currentTarget).parent().data('mid')
    let pageId = $(e.currentTarget).parent().data('pid')
    let activePages = $('#ul_admin_module_builder_pages button.active')
    let numActivePages = activePages.length

    let numPages = status === 1 ? numActivePages+1 : numActivePages-1

    let obj = {
      _id: pageId,
      status: status,
      moduleId: moduleId,
      numPages: numPages
    }

// console.log(obj)

    updateModulePageStatus.call(obj, (err, res) => {
      if(err) {
        toastr.error("Something went wrong. Please try again. " + err)
      } else {
        toastr.info("Successfully updated.")
      }
    })

        // // TrainingModulePages.update(pageId, {
        // //   $set: { status: 4 }
        // // })

        // deleteModulePage.call({_id: pageId}, (err, res) => {
        //     if(err) {
        //       toastr.error("Something went wrong. " + err)
        //     } else {
        //       toastr.info("Successfully deactivated.")
        //     }      
        // }) 

      // }
    // }
  }    
})
