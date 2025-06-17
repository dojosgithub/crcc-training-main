/**
 *  Admin All Audios template logic
 */
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'

import { ReactiveVar } from 'meteor/reactive-var'
import { ReactiveDict } from 'meteor/reactive-dict'

import { TrainingModuleAudiosCFS } from '/both/api/collections/training-module-audios.js'
import { updateAudioStatus, countTotalAudios, countSearchResult } from '/both/api/methods/training-module-audios.js'

// import '/imports/ui/stylesheets/admin/audios/admin-all-audios.less'
import { AdminAllAudios } from '/imports/ui/pages/admin/audios/admin-all-audios.html'

import { AdminAudioEdit } from '/imports/ui/pages/admin/audios/admin-audio-edit.js'

import { AdminAudioTemplate } from '/imports/ui/pages/admin/audios/admin-audio-template.js'

let _selfAdminAllAudios
let _subsAdminAllAudios

Template.AdminAllAudios.onCreated(function adminAllAudiosOnCreated() {
  _selfAdminAllAudios = this
  _subsAdminAllAudios = new SubsManager()

  _selfAdminAllAudios.ready = new ReactiveVar()
  _selfAdminAllAudios.count = new ReactiveVar(0)
  _selfAdminAllAudios.audioToEdit = new ReactiveVar()

  _selfAdminAllAudios.searchReady = new ReactiveVar()

  _selfAdminAllAudios.total = new ReactiveVar(0)
  _selfAdminAllAudios.numPages = new ReactiveVar(0)
  _selfAdminAllAudios.curPage = new ReactiveVar(1)

  _selfAdminAllAudios.keyword = new ReactiveVar(null)

  _selfAdminAllAudios.table = new ReactiveVar(true)
  
  _selfAdminAllAudios.pageLimit = new ReactiveDict()
  _selfAdminAllAudios.pageLimit.set('page', 1)
  _selfAdminAllAudios.pageLimit.set('limit', 10)

  _selfAdminAllAudios.autorun(() => {
    // let handleAdminAllAudios = _subsAdminAllAudios.subscribe('all_training_module_audios_cfs')
    // _selfAdminAllAudios.ready.set(handleAdminAllAudios.ready())

    let pageLimitObj = {
      page: _selfAdminAllAudios.pageLimit.get('page'),
      limit: _selfAdminAllAudios.pageLimit.get('limit')
    }

    if(_selfAdminAllAudios.keyword.get()) {

      pageLimitObj.keyword = _selfAdminAllAudios.keyword.get()

      let handleSearchAdminAllAudios = _subsAdminAllAudios.subscribe('training_module_audios_w_keyword_limit', pageLimitObj)
      _selfAdminAllAudios.searchReady.set(handleSearchAdminAllAudios.ready())
    } else {
      let handleAdminAllAudios = _subsAdminAllAudios.subscribe('training_module_audios_w_page_limit', pageLimitObj)
      _selfAdminAllAudios.ready.set(handleAdminAllAudios.ready())
    }

  })

  countTotalAudios.call(null, (err, res) => {    
    _selfAdminAllAudios.total.set(res)
  })

})

Template.AdminAllAudios.onRendered(function adminAllAudiosOnRendered() {

})

Template.AdminAllAudios.helpers({
  Audios() {
    if(_selfAdminAllAudios.ready.get() 
      || _selfAdminAllAudios.keyword.get()) {   
       
      let audios = TrainingModuleAudiosCFS.find()

      if(audios.fetch().length > 0) {

        // _selfAdminAllAudios.count.set(audios.fetch().length)

        return audios        
      }
    }
  },
  audioToEdit() {
    return _selfAdminAllAudios.audioToEdit.get()
  },
  audioTableSelector() {
    return {
      status: {$ne: 4}
    }
  },
  viewTable() {
    return _selfAdminAllAudios.table.get()
  },
  total() {
    let total = _selfAdminAllAudios.total.get()
    let numPages = Math.floor(total / _selfAdminAllAudios.pageLimit.get('limit'))+1

    _selfAdminAllAudios.numPages.set(numPages) 

    let initPageArray = Array.apply(null, {length: numPages}).map(()=> null)
    let length = initPageArray.length

    let pageArray = []

    let li = '<li data-page="prev">Prev</li>'
    pageArray.push(li)

    if(length > 0) {
      for(i = 0; i < length; i++) {
        let p = i+1

        let active = i === 0 ? 'active' : ''
        
        li = '<li data-page="'+p+'" class="'+active+'">' + p + '</li>'

        pageArray.push(li)        
      }
    }

    li = '<li data-page="next">Next</li>'
    pageArray.push(li)

    return pageArray
  },
  totalNumAudios() {
    return _selfAdminAllAudios.total.get()
  }   
})

Template.AdminAllAudios.events({ 
  'click .btn-delete-audio'(e, tpl) {
    e.preventDefault()

    if(confirm("Are you sure to delete this audio?")) {
      let aid = $(e.currentTarget).parent().data('aid')

      let obj = {
        _id: aid,
        status: 4
      }
      
      updateAudioStatus.call(obj, (err, res) => {
        if(err) {
          toastr.error("Something went wrong. " + err)
        } else {
          toastr.info("Successfully deleted.")
        }
      })
    }
  },
  'click .btn-activate-audio'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).parent().data('aid')

    let obj = {
      _id: aid,
      status: 1
    }

    updateAudioStatus.call(obj, (err, res) => {
      if(err) {
        toastr.error("Something went wrong. " + err)
      } else {
        toastr.info("Successfully activated.")
      }      
    })
  },
  'click .btn-deactivate-audio'(e, tpl) {
    e.preventDefault()

    let aid = $(e.currentTarget).parent().data('aid')

    let obj = {
      _id: aid,
      status: 2
    }

    updateAudioStatus.call(obj, (err, res) => {
      if(err) {
        toastr.error("Something went wrong. " + err)
      } else {
        toastr.info("Successfully deactivated.")
      }      
    })

  },
  'click .btn-edit-audio'(e, tpl) {
    e.preventDefault()

    let audioId = $(e.currentTarget).parent().data('aid')

    _selfAdminAllAudios.audioToEdit.set(audioId)

    $('.row-admin-audio-edit').show()
    
  },
  'click .btn-view-audio-table'(e, tpl) {
    e.preventDefault()

    let tableOn = $(e.currentTarget).data('on')

    _selfAdminAllAudios.table.set(tableOn)
  }, 
  'change #sel_thumbs_per_page'(e, tpl) {
    e.preventDefault()

    _subsAdminAllAudios.clear()

    let thumbsPerPage = $(e.currentTarget).val()

    _selfAdminAllAudios.pageLimit.set('limit', parseInt(thumbsPerPage))
    _selfAdminAllAudios.pageLimit.set('page', 1)

    $('.ul-admin-all-audios-thumbs-page li').removeClass('active')

    $(".ul-admin-all-audios-thumbs-page li").eq(1).addClass('active')

  },
  'click .ul-admin-all-audios-thumbs-page li'(e, tpl) {
    e.preventDefault()

    let page = $(e.currentTarget).data('page')
    let numPages = _selfAdminAllAudios.numPages.get()
    let curPage = parseInt(_selfAdminAllAudios.curPage.get())
    let nCurPage = curPage

    if(page === 'next') {
      if(curPage < numPages) {
        nCurPage = curPage +1
      }
    }
    else if(page === 'prev') {
      if(curPage > 1) {
        nCurPage = curPage -1
      }
    } else {
      nCurPage = parseInt(page)
    }

    if(curPage !== nCurPage) {

      _subsAdminAllAudios.clear()

      $('.ul-admin-all-audios-thumbs-page li').removeClass('active')

      _selfAdminAllAudios.curPage.set(nCurPage)    

      _selfAdminAllAudios.pageLimit.set('page', nCurPage)      
    }

    $(".ul-admin-all-audios-thumbs-page li").eq(_selfAdminAllAudios.curPage.get()).addClass('active')

  },
  'click .btn-search-thumbs-audios'(e, tpl) {
  // 'change #search_thumbs'(e, tpl) { //-- Too slow
    e.preventDefault()

    let keyword = $('#search_thumbs').val()

    if(keyword !== '') {

      _subsAdminAllAudios.clear()

      // $('.ul-admin-all-audios-thumbs-page li').removeClass('active')
      _selfAdminAllAudios.curPage.set(1) 
      _selfAdminAllAudios.pageLimit.set('page', 1)
      _selfAdminAllAudios.keyword.set(keyword)      

      // if(_selfAdminAllAudios.searchReady.get()) {
        
      //   let total = TrainingModuleAudiosCFS.find().fetch().length


      //   console.log(total, TrainingModuleAudiosCFS.find().fetch())

      //   _selfAdminAllAudios.total.set(total)
      // }
      
    let pageLimitObj = {
      // page: _selfAdminAllAudios.pageLimit.get('page'),
      // limit: _selfAdminAllAudios.pageLimit.get('limit'),
      keyword: keyword
    }

// console.log(keyword)

      countSearchResult.call(pageLimitObj, (err, res) => {
        if(res) {          
          _selfAdminAllAudios.total.set(res)
          // _selfAdminAllAudios.curPage.set(1)
        }
      })

    } else {
      _selfAdminAllAudios.keyword.set(null)
      countTotalAudios.call(null, (err, res) => {    
        _selfAdminAllAudios.total.set(res)
      })      
    }
  }     
})

Template.AdminAllAudios.onDestroyed(function adminAllAudiosOnDestroyed() {
  _subsAdminAllAudios.clear()
})

